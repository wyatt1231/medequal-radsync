using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Api.Utils.Rtf
{
    /// <summary>
    /// Parses the HTML the web editor (Quill) produces into an <see cref="RtfDocument"/>. Understands block tags with
    /// text-align / margin-left / text-indent, &lt;strong&gt;/&lt;em&gt;/&lt;u&gt;, inline font-size, the editor's soft-break
    /// marker and caret placeholder, and HTML entities. Unknown tags are transparent (their text is kept).
    /// </summary>
    public static class EditorHtmlReader
    {
        public const string SOFT_BREAK_CLASS = "ql-soft-break";
        public const string TRAILING_LINE_ATTRIBUTE = "data-trailing-line";
        private const string CURSOR_CLASS = "ql-cursor";
        private const int TWIPS_PER_EDITOR_INDENT_LEVEL = 720;

        private static readonly HashSet<string> BLOCK_TAGS = new HashSet<string>
        {
            "p", "div", "li", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "pre"
        };

        private static readonly HashSet<string> VOID_TAGS = new HashSet<string>
        {
            "br", "img", "hr", "input", "meta", "link", "col", "area", "base", "wbr", "source"
        };

        private static readonly Dictionary<string, char> NAMED_ENTITIES = new Dictionary<string, char>
        {
            { "amp", '&' }, { "lt", '<' }, { "gt", '>' }, { "quot", '"' }, { "apos", '\'' }, { "nbsp", ' ' },
            { "deg", '°' }, { "plusmn", '±' }, { "micro", 'µ' }, { "middot", '·' },
            { "times", '×' }, { "divide", '÷' }, { "frac12", '½' }, { "frac14", '¼' },
            { "frac34", '¾' }, { "sup2", '²' }, { "sup3", '³' }, { "copy", '©' }, { "reg", '®' },
            { "ndash", '–' }, { "mdash", '—' }, { "lsquo", '‘' }, { "rsquo", '’' },
            { "ldquo", '“' }, { "rdquo", '”' }, { "hellip", '…' }, { "bull", '•' },
            { "ntilde", 'ñ' }, { "Ntilde", 'Ñ' }, { "eacute", 'é' }, { "Eacute", 'É' }
        };

        private static readonly Regex ATTRIBUTE = new Regex(@"([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*(?:""([^""]*)""|'([^']*)'|([^\s""'>]+)))?", RegexOptions.Compiled);

        private class Frame
        {
            public string Tag;
            public bool Bold;
            public bool Italic;
            public bool Underline;
            public int FontSizeHalfPoints;
            public bool SkipContent;
            public bool IsBlock;
        }

        private class ParseContext
        {
            public readonly RtfDocument Document = new RtfDocument();
            public readonly List<Frame> Frames = new List<Frame>();
            public RtfParagraph Paragraph;
            public bool ParagraphFromBlockTag;
            public int TrailingBrCount;
        }

        /// <summary>Parses editor HTML. Null or empty input yields an empty document.</summary>
        public static RtfDocument Read(string html)
        {
            ParseContext ctx = new ParseContext();
            ctx.Frames.Add(new Frame { Tag = "#root", FontSizeHalfPoints = RtfDocument.DEFAULT_FONT_SIZE_HALF_POINTS });
            html ??= "";

            int i = 0;
            while (i < html.Length)
            {
                if (html[i] == '<')
                {
                    i = ReadMarkup(html, i, ctx);
                    continue;
                }

                int next = html.IndexOf('<', i);
                if (next < 0) next = html.Length;
                AppendText(ctx, DecodeEntities(html.Substring(i, next - i)));
                i = next;
            }

            if (ctx.Paragraph != null) EndParagraph(ctx);
            ctx.Document.Normalize();
            return ctx.Document;
        }

        private static int ReadMarkup(string html, int i, ParseContext ctx)
        {
            if (string.CompareOrdinal(html, i, "<!--", 0, 4) == 0)
            {
                int endComment = html.IndexOf("-->", i + 4, StringComparison.Ordinal);
                return endComment < 0 ? html.Length : endComment + 3;
            }

            int end = FindTagEnd(html, i + 1);
            if (end < 0)
            {
                AppendText(ctx, html.Substring(i));
                return html.Length;
            }

            string inner = html.Substring(i + 1, end - i - 1).Trim();
            if (inner.Length == 0 || inner[0] == '!' || inner[0] == '?') return end + 1;

            if (inner[0] == '/')
            {
                CloseTag(ctx, inner.Substring(1).Trim().ToLowerInvariant());
                return end + 1;
            }

            bool selfClosing = inner.EndsWith("/", StringComparison.Ordinal);
            if (selfClosing) inner = inner.Substring(0, inner.Length - 1);

            int nameEnd = 0;
            while (nameEnd < inner.Length && !char.IsWhiteSpace(inner[nameEnd])) nameEnd++;
            string tag = inner.Substring(0, nameEnd).ToLowerInvariant();
            Dictionary<string, string> attributes = ParseAttributes(inner.Substring(nameEnd));

            OpenTag(ctx, tag, attributes, selfClosing || VOID_TAGS.Contains(tag));
            return end + 1;
        }

        private static int FindTagEnd(string html, int i)
        {
            char quote = '\0';
            for (; i < html.Length; i++)
            {
                char c = html[i];
                if (quote != '\0')
                {
                    if (c == quote) quote = '\0';
                    continue;
                }
                if (c == '"' || c == '\'') quote = c;
                else if (c == '>') return i;
            }
            return -1;
        }

        private static void OpenTag(ParseContext ctx, string tag, Dictionary<string, string> attributes, bool isVoid)
        {
            Frame parent = ctx.Frames[ctx.Frames.Count - 1];
            string classes = attributes.TryGetValue("class", out string c) ? " " + c + " " : "";
            Dictionary<string, string> style = ParseStyle(attributes.TryGetValue("style", out string s) ? s : "");

            if (parent.SkipContent || attributes.ContainsKey(TRAILING_LINE_ATTRIBUTE))
            {
                if (!isVoid) ctx.Frames.Add(new Frame { Tag = tag, SkipContent = true });
                return;
            }

            if (classes.Contains(" " + SOFT_BREAK_CLASS + " "))
            {
                CurrentParagraph(ctx).Runs.Add(LineBreak(parent));
                ctx.TrailingBrCount = 0;
                if (!isVoid) ctx.Frames.Add(new Frame { Tag = tag, SkipContent = true });
                return;
            }

            if (tag == "br")
            {
                CurrentParagraph(ctx).Runs.Add(LineBreak(parent));
                ctx.TrailingBrCount++;
                return;
            }

            if (isVoid) return;

            Frame frame = new Frame
            {
                Tag = tag,
                Bold = parent.Bold,
                Italic = parent.Italic,
                Underline = parent.Underline,
                FontSizeHalfPoints = parent.FontSizeHalfPoints,
                SkipContent = classes.Contains(" " + CURSOR_CLASS + " ") || tag == "script" || tag == "style",
                IsBlock = BLOCK_TAGS.Contains(tag)
            };

            if (tag == "strong" || tag == "b") frame.Bold = true;
            if (tag == "em" || tag == "i") frame.Italic = true;
            if (tag == "u") frame.Underline = true;
            ApplyInlineStyle(frame, style);

            if (frame.IsBlock)
            {
                // An empty block wrapping another block (e.g. <div><p>) is a container, not a blank line.
                if (ctx.Paragraph != null && ctx.Paragraph.Runs.Count == 0 && ctx.ParagraphFromBlockTag) ctx.Paragraph = null;
                if (ctx.Paragraph != null) EndParagraph(ctx);
                RtfParagraph paragraph = CurrentParagraph(ctx);
                ctx.ParagraphFromBlockTag = true;
                ApplyBlockStyle(paragraph, style, classes);
            }

            ctx.Frames.Add(frame);
        }

        private static RtfRun LineBreak(Frame format)
        {
            return new RtfRun
            {
                IsLineBreak = true,
                Bold = format.Bold,
                Italic = format.Italic,
                Underline = format.Underline,
                FontSizeHalfPoints = format.FontSizeHalfPoints
            };
        }

        private static void CloseTag(ParseContext ctx, string tag)
        {
            for (int f = ctx.Frames.Count - 1; f > 0; f--)
            {
                if (ctx.Frames[f].Tag != tag) continue;

                bool closesBlock = false;
                for (int k = ctx.Frames.Count - 1; k >= f; k--)
                {
                    if (ctx.Frames[k].IsBlock && !ctx.Frames[k].SkipContent) closesBlock = true;
                    ctx.Frames.RemoveAt(k);
                }
                if (closesBlock && ctx.Paragraph != null) EndParagraph(ctx);
                return;
            }
        }

        private static void AppendText(ParseContext ctx, string text)
        {
            Frame frame = ctx.Frames[ctx.Frames.Count - 1];
            if (frame.SkipContent || text.Length == 0) return;

            StringBuilder cleaned = new StringBuilder(text.Length);
            foreach (char c in text)
            {
                if (c == '\r' || c == '\n' || c == '﻿' || c == '​') continue;
                cleaned.Append(c);
            }
            if (cleaned.Length == 0) return;
            if (ctx.Paragraph == null && IsWhitespaceOnly(cleaned)) return;

            ctx.TrailingBrCount = 0;
            CurrentParagraph(ctx).Runs.Add(new RtfRun
            {
                Text = cleaned.ToString(),
                Bold = frame.Bold,
                Italic = frame.Italic,
                Underline = frame.Underline,
                FontSizeHalfPoints = frame.FontSizeHalfPoints
            });
        }

        private static bool IsWhitespaceOnly(StringBuilder sb)
        {
            for (int i = 0; i < sb.Length; i++)
            {
                if (!char.IsWhiteSpace(sb[i]) || sb[i] == '\t' || sb[i] == ' ') return false;
            }
            return true;
        }

        private static RtfParagraph CurrentParagraph(ParseContext ctx)
        {
            if (ctx.Paragraph == null)
            {
                ctx.Paragraph = new RtfParagraph();
                ctx.ParagraphFromBlockTag = false;
                ctx.TrailingBrCount = 0;
            }
            return ctx.Paragraph;
        }

        private static void EndParagraph(ParseContext ctx)
        {
            // A trailing <br> is the browser's placeholder that keeps a line open (e.g. Quill's empty "<p><br></p>"),
            // not a soft break the author typed; soft breaks are marked with SOFT_BREAK_CLASS.
            List<RtfRun> runs = ctx.Paragraph.Runs;
            while (ctx.TrailingBrCount > 0 && runs.Count > 0 && runs[runs.Count - 1].IsLineBreak)
            {
                runs.RemoveAt(runs.Count - 1);
                ctx.TrailingBrCount--;
            }

            ctx.Document.Paragraphs.Add(ctx.Paragraph);
            ctx.Paragraph = null;
            ctx.TrailingBrCount = 0;
        }

        private static void ApplyInlineStyle(Frame frame, Dictionary<string, string> style)
        {
            if (style.TryGetValue("font-size", out string size) && TryParseLengthInPoints(size, out double points) && points > 0)
            {
                frame.FontSizeHalfPoints = (int)Math.Round(points * 2, MidpointRounding.AwayFromZero);
            }
            if (style.TryGetValue("font-weight", out string weight))
            {
                weight = weight.Trim().ToLowerInvariant();
                if (weight == "bold" || weight == "bolder" || (int.TryParse(weight, out int w) && w >= 600)) frame.Bold = true;
                else if (weight == "normal" || weight == "lighter" || (int.TryParse(weight, out int n) && n < 600)) frame.Bold = false;
            }
            if (style.TryGetValue("font-style", out string fontStyle))
            {
                frame.Italic = fontStyle.Trim().ToLowerInvariant() == "italic";
            }
            if ((style.TryGetValue("text-decoration", out string decoration) || style.TryGetValue("text-decoration-line", out decoration))
                && decoration.ToLowerInvariant().Contains("underline"))
            {
                frame.Underline = true;
            }
        }

        private static void ApplyBlockStyle(RtfParagraph paragraph, Dictionary<string, string> style, string classes)
        {
            string align = style.TryGetValue("text-align", out string a) ? a.Trim().ToLowerInvariant() : "";
            if (classes.Contains(" ql-align-center ")) align = "center";
            if (classes.Contains(" ql-align-right ")) align = "right";
            if (classes.Contains(" ql-align-justify ")) align = "justify";
            paragraph.Alignment = align switch
            {
                "center" => RtfAlignment.Center,
                "right" => RtfAlignment.Right,
                "justify" => RtfAlignment.Justify,
                _ => RtfAlignment.Left
            };

            if ((style.TryGetValue("margin-left", out string left) || style.TryGetValue("padding-left", out left))
                && TryParseLengthInPoints(left, out double leftPoints))
            {
                paragraph.LeftIndentTwips = (int)Math.Round(leftPoints * 20, MidpointRounding.AwayFromZero);
            }
            Match indentClass = Regex.Match(classes, @" ql-indent-(\d+) ");
            if (indentClass.Success) paragraph.LeftIndentTwips = int.Parse(indentClass.Groups[1].Value) * TWIPS_PER_EDITOR_INDENT_LEVEL;

            if (style.TryGetValue("text-indent", out string first) && TryParseLengthInPoints(first, out double firstPoints))
            {
                paragraph.FirstIndentTwips = (int)Math.Round(firstPoints * 20, MidpointRounding.AwayFromZero);
            }
        }

        private static bool TryParseLengthInPoints(string value, out double points)
        {
            points = 0;
            value = value.Trim().ToLowerInvariant();
            double factor;
            if (value.EndsWith("pt", StringComparison.Ordinal)) factor = 1;
            else if (value.EndsWith("px", StringComparison.Ordinal)) factor = 0.75;
            else if (value == "0") return true;
            else return false;

            if (!double.TryParse(value.Substring(0, value.Length - 2), NumberStyles.Float, CultureInfo.InvariantCulture, out double number)) return false;
            points = number * factor;
            return true;
        }

        private static Dictionary<string, string> ParseAttributes(string text)
        {
            Dictionary<string, string> attributes = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            foreach (Match m in ATTRIBUTE.Matches(text))
            {
                string value = m.Groups[2].Success ? m.Groups[2].Value : m.Groups[3].Success ? m.Groups[3].Value : m.Groups[4].Value;
                attributes[m.Groups[1].Value] = DecodeEntities(value);
            }
            return attributes;
        }

        private static Dictionary<string, string> ParseStyle(string style)
        {
            Dictionary<string, string> declarations = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            foreach (string declaration in style.Split(';'))
            {
                int colon = declaration.IndexOf(':');
                if (colon <= 0) continue;
                declarations[declaration.Substring(0, colon).Trim()] = declaration.Substring(colon + 1).Trim();
            }
            return declarations;
        }

        /// <summary>Decodes named (common subset) and numeric HTML character references.</summary>
        public static string DecodeEntities(string text)
        {
            if (text.IndexOf('&') < 0) return text;

            StringBuilder sb = new StringBuilder(text.Length);
            int i = 0;
            while (i < text.Length)
            {
                char c = text[i];
                int semicolon = c == '&' ? text.IndexOf(';', i + 1) : -1;
                if (semicolon > i + 1 && semicolon - i <= 12 && TryDecodeEntity(text.Substring(i + 1, semicolon - i - 1), out string decoded))
                {
                    sb.Append(decoded);
                    i = semicolon + 1;
                    continue;
                }
                sb.Append(c);
                i++;
            }
            return sb.ToString();
        }

        private static bool TryDecodeEntity(string name, out string decoded)
        {
            decoded = null;
            if (name[0] == '#')
            {
                bool isHex = name.Length > 1 && (name[1] == 'x' || name[1] == 'X');
                string digits = isHex ? name.Substring(2) : name.Substring(1);
                if (!int.TryParse(digits, isHex ? NumberStyles.HexNumber : NumberStyles.None, CultureInfo.InvariantCulture, out int codePoint)) return false;
                if (codePoint <= 0 || codePoint > 0x10FFFF || (codePoint >= 0xD800 && codePoint <= 0xDFFF)) return false;
                decoded = char.ConvertFromUtf32(codePoint);
                return true;
            }
            if (NAMED_ENTITIES.TryGetValue(name, out char named))
            {
                decoded = named.ToString();
                return true;
            }
            return false;
        }
    }
}
