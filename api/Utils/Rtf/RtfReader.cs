using System;
using System.Collections.Generic;
using System.Text;

namespace Api.Utils.Rtf
{
    /// <summary>
    /// Parses RTF (as written by the legacy VB.NET RichTextBox, WordPad/RichEdit or <see cref="RtfWriter"/>) into an <see cref="RtfDocument"/>.
    /// Formatting outside the shared subset (fonts, colours, tab stops, pictures, objects) is dropped; text is never altered.
    /// </summary>
    public static class RtfReader
    {
        private const int RTF_DEFAULT_FONT_SIZE_HALF_POINTS = 24;

        private static readonly HashSet<string> SKIPPED_DESTINATIONS = new HashSet<string>
        {
            "fonttbl", "colortbl", "stylesheet", "info", "pict", "object", "objdata", "header", "footer",
            "headerl", "headerr", "headerf", "footerl", "footerr", "footerf", "footnote", "annotation",
            "atnid", "atnauthor", "generator", "listtable", "listoverridetable", "revtbl", "rsidtbl",
            "xmlnstbl", "themedata", "colorschememapping", "latentstyles", "datastore", "filetbl",
            "fldinst", "pn", "nonshppict", "mmathPr", "userprops", "docvar", "bkmkstart", "bkmkend"
        };

        private static readonly Dictionary<string, char> SPECIAL_CHARACTER_WORDS = new Dictionary<string, char>
        {
            { "emdash", '—' }, { "endash", '–' }, { "bullet", '•' },
            { "lquote", '‘' }, { "rquote", '’' }, { "ldblquote", '“' }, { "rdblquote", '”' },
            { "emspace", ' ' }, { "enspace", ' ' }, { "qmspace", ' ' }
        };

        private class GroupState
        {
            public bool Skip;
            public bool Bold;
            public bool Italic;
            public bool Underline;
            public bool Hidden;
            public bool Caps;
            public int FontSizeHalfPoints = RTF_DEFAULT_FONT_SIZE_HALF_POINTS;
            public int UnicodeSkipCount = 1;
            public RtfAlignment Alignment = RtfAlignment.Left;
            public int LeftIndentTwips;
            public int FirstIndentTwips;

            public GroupState Clone()
            {
                return (GroupState)MemberwiseClone();
            }
        }

        private class ParseContext
        {
            public readonly RtfDocument Document = new RtfDocument();
            public readonly Stack<GroupState> Groups = new Stack<GroupState>();
            public GroupState State = new GroupState();
            public RtfParagraph Paragraph;
            public int PendingUnicodeSkip;
        }

        /// <summary>Parses an RTF string. Throws <see cref="FormatException"/> when the input is not RTF.</summary>
        public static RtfDocument Read(string rtf)
        {
            if (rtf == null || !rtf.TrimStart().StartsWith(@"{\rtf", StringComparison.Ordinal))
            {
                throw new FormatException("The value is not RTF.");
            }

            ParseContext ctx = new ParseContext();
            int i = 0;
            while (i < rtf.Length)
            {
                char c = rtf[i];
                if (c == '{')
                {
                    ctx.Groups.Push(ctx.State);
                    ctx.State = ctx.State.Clone();
                    ctx.PendingUnicodeSkip = 0;
                    i++;
                }
                else if (c == '}')
                {
                    if (ctx.Groups.Count > 0) ctx.State = ctx.Groups.Pop();
                    ctx.PendingUnicodeSkip = 0;
                    i++;
                }
                else if (c == '\\')
                {
                    i = ReadControl(rtf, i + 1, ctx);
                }
                else if (c == '\r' || c == '\n')
                {
                    i++;
                }
                else
                {
                    AppendChar(ctx, c);
                    i++;
                }
            }

            if (ctx.Paragraph != null && ctx.Paragraph.Runs.Count > 0) EndParagraph(ctx);

            ctx.Document.Normalize();
            return ctx.Document;
        }

        private static int ReadControl(string rtf, int i, ParseContext ctx)
        {
            if (i >= rtf.Length) return i;

            char c = rtf[i];
            if (!IsAsciiLetter(c)) return ReadControlSymbol(rtf, i, ctx);

            int start = i;
            while (i < rtf.Length && IsAsciiLetter(rtf[i])) i++;
            string word = rtf.Substring(start, i - start);

            bool hasParameter = false;
            int parameter = 0;
            if (i < rtf.Length && (rtf[i] == '-' || char.IsDigit(rtf[i])))
            {
                int paramStart = i;
                i++;
                while (i < rtf.Length && char.IsDigit(rtf[i])) i++;
                hasParameter = int.TryParse(rtf.Substring(paramStart, i - paramStart), out parameter);
            }
            if (i < rtf.Length && rtf[i] == ' ') i++;

            if (word == "bin")
            {
                return Math.Min(rtf.Length, i + Math.Max(0, parameter));
            }

            ApplyControlWord(ctx, word, hasParameter, parameter);
            return i;
        }

        private static int ReadControlSymbol(string rtf, int i, ParseContext ctx)
        {
            char symbol = rtf[i];
            switch (symbol)
            {
                case '\'':
                    if (TryParseHexByte(rtf, i + 1, out byte value))
                    {
                        AppendChar(ctx, Cp1252.Decode(value));
                        return i + 3;
                    }
                    return i + 1;
                case '*':
                    ctx.State.Skip = true;
                    return i + 1;
                case '~':
                    AppendChar(ctx, ' ');
                    return i + 1;
                case '_':
                    AppendChar(ctx, '-');
                    return i + 1;
                case '-':
                    return i + 1;
                case '\r':
                case '\n':
                    if (!ctx.State.Skip) EndParagraph(ctx);
                    return i + 1;
                case '\\':
                case '{':
                case '}':
                    AppendChar(ctx, symbol);
                    return i + 1;
                default:
                    return i + 1;
            }
        }

        private static void ApplyControlWord(ParseContext ctx, string word, bool hasParameter, int parameter)
        {
            GroupState state = ctx.State;
            bool on = !hasParameter || parameter != 0;

            if (SKIPPED_DESTINATIONS.Contains(word))
            {
                state.Skip = true;
                return;
            }

            if (SPECIAL_CHARACTER_WORDS.TryGetValue(word, out char special))
            {
                AppendChar(ctx, special);
                return;
            }

            if (word.StartsWith("ul", StringComparison.Ordinal) && word != "ulnone" && word != "ulc")
            {
                state.Underline = on;
                return;
            }

            switch (word)
            {
                case "par":
                case "sect":
                case "page":
                case "row":
                    if (!state.Skip) EndParagraph(ctx);
                    break;
                case "line":
                    if (!state.Skip && !state.Hidden)
                    {
                        // RichEdit stores a format on the break character itself; keep it so a rewrite toggles exactly where VB did.
                        CurrentParagraph(ctx).Runs.Add(new RtfRun
                        {
                            IsLineBreak = true,
                            Bold = state.Bold,
                            Italic = state.Italic,
                            Underline = state.Underline,
                            FontSizeHalfPoints = state.FontSizeHalfPoints
                        });
                    }
                    break;
                case "tab":
                case "cell":
                    AppendChar(ctx, '\t');
                    break;
                case "pard":
                    state.Alignment = RtfAlignment.Left;
                    state.LeftIndentTwips = 0;
                    state.FirstIndentTwips = 0;
                    break;
                case "plain":
                    state.Bold = false;
                    state.Italic = false;
                    state.Underline = false;
                    state.Hidden = false;
                    state.Caps = false;
                    state.FontSizeHalfPoints = RTF_DEFAULT_FONT_SIZE_HALF_POINTS;
                    break;
                case "b":
                    state.Bold = on;
                    break;
                case "i":
                    state.Italic = on;
                    break;
                case "ulnone":
                    state.Underline = false;
                    break;
                case "v":
                    state.Hidden = on;
                    break;
                case "caps":
                    state.Caps = on;
                    break;
                case "fs":
                    if (hasParameter && parameter > 0) state.FontSizeHalfPoints = parameter;
                    break;
                case "ql":
                    state.Alignment = RtfAlignment.Left;
                    break;
                case "qc":
                    state.Alignment = RtfAlignment.Center;
                    break;
                case "qr":
                    state.Alignment = RtfAlignment.Right;
                    break;
                case "qj":
                case "qd":
                    state.Alignment = RtfAlignment.Justify;
                    break;
                case "li":
                    if (hasParameter) state.LeftIndentTwips = parameter;
                    break;
                case "fi":
                    if (hasParameter) state.FirstIndentTwips = parameter;
                    break;
                case "uc":
                    if (hasParameter && parameter >= 0) state.UnicodeSkipCount = parameter;
                    break;
                case "u":
                    if (hasParameter)
                    {
                        int codeUnit = parameter < 0 ? parameter + 65536 : parameter;
                        AppendChar(ctx, (char)codeUnit);
                        ctx.PendingUnicodeSkip = state.UnicodeSkipCount;
                    }
                    break;
            }
        }

        private static void AppendChar(ParseContext ctx, char c)
        {
            if (ctx.PendingUnicodeSkip > 0)
            {
                ctx.PendingUnicodeSkip--;
                return;
            }

            GroupState state = ctx.State;
            if (state.Skip || state.Hidden) return;

            if (state.Caps) c = char.ToUpperInvariant(c);

            RtfParagraph paragraph = CurrentParagraph(ctx);
            RtfRun last = paragraph.Runs.Count > 0 ? paragraph.Runs[paragraph.Runs.Count - 1] : null;
            if (last != null && !last.IsLineBreak && last.Bold == state.Bold && last.Italic == state.Italic
                && last.Underline == state.Underline && last.FontSizeHalfPoints == state.FontSizeHalfPoints)
            {
                last.Text += c;
                return;
            }

            paragraph.Runs.Add(new RtfRun
            {
                Text = c.ToString(),
                Bold = state.Bold,
                Italic = state.Italic,
                Underline = state.Underline,
                FontSizeHalfPoints = state.FontSizeHalfPoints
            });
        }

        private static RtfParagraph CurrentParagraph(ParseContext ctx)
        {
            if (ctx.Paragraph == null) ctx.Paragraph = new RtfParagraph();
            return ctx.Paragraph;
        }

        private static void EndParagraph(ParseContext ctx)
        {
            RtfParagraph paragraph = CurrentParagraph(ctx);
            paragraph.Alignment = ctx.State.Alignment;
            paragraph.LeftIndentTwips = ctx.State.LeftIndentTwips;
            paragraph.FirstIndentTwips = ctx.State.FirstIndentTwips;
            ctx.Document.Paragraphs.Add(paragraph);
            ctx.Paragraph = null;
        }

        private static bool TryParseHexByte(string rtf, int i, out byte value)
        {
            value = 0;
            if (i + 1 >= rtf.Length) return false;
            int high = HexValue(rtf[i]);
            int low = HexValue(rtf[i + 1]);
            if (high < 0 || low < 0) return false;
            value = (byte)((high << 4) | low);
            return true;
        }

        private static int HexValue(char c)
        {
            if (c >= '0' && c <= '9') return c - '0';
            if (c >= 'a' && c <= 'f') return c - 'a' + 10;
            if (c >= 'A' && c <= 'F') return c - 'A' + 10;
            return -1;
        }

        private static bool IsAsciiLetter(char c)
        {
            return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
        }

        /// <summary>Plain text of a document (paragraphs joined by '\n', soft breaks as '\n'); used for previews and tests.</summary>
        public static string ToPlainText(RtfDocument document)
        {
            StringBuilder sb = new StringBuilder();
            for (int p = 0; p < document.Paragraphs.Count; p++)
            {
                if (p > 0) sb.Append('\n');
                foreach (RtfRun run in document.Paragraphs[p].Runs) sb.Append(run.IsLineBreak ? "\n" : run.Text);
            }
            return sb.ToString();
        }
    }
}
