using System.Text;

namespace Api.Utils.Rtf
{
    /// <summary>
    /// Writes an <see cref="RtfDocument"/> in the layout the legacy VB.NET RichTextBox saves (verified against the live ndch data):
    /// cp1252 header with an Arial font table, one paragraph per CRLF-terminated line ending in \par, toggle-style
    /// \b/\b0, \i/\i0, \ul/\ulnone, and non-ASCII text escaped as \'hh (or \uN? outside cp1252) so the output is pure ASCII.
    /// </summary>
    public static class RtfWriter
    {
        private const string HEADER = "{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1033{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}}\r\n\\viewkind4\\uc1";

        private class WriterState
        {
            public readonly StringBuilder Output = new StringBuilder();
            public bool NeedsDelimiter;
            public bool Bold;
            public bool Italic;
            public bool Underline;
            public int FontSizeHalfPoints = -1;
            public RtfParagraph PreviousParagraph;
        }

        /// <summary>Serialises the document to RTF compatible with the legacy VB.NET app.</summary>
        public static string Write(RtfDocument document)
        {
            WriterState state = new WriterState();
            state.Output.Append(HEADER);

            if (document.Paragraphs.Count == 0)
            {
                WriteParagraphLayout(state, new RtfParagraph());
                WriteControl(state, "\\f0");
                WriteControl(state, "\\fs" + RtfDocument.DEFAULT_FONT_SIZE_HALF_POINTS);
                WriteParagraphEnd(state);
            }

            foreach (RtfParagraph paragraph in document.Paragraphs)
            {
                if (state.PreviousParagraph == null || !paragraph.HasSameLayout(state.PreviousParagraph))
                {
                    WriteParagraphLayout(state, paragraph);
                }
                if (state.PreviousParagraph == null) WriteControl(state, "\\f0");

                foreach (RtfRun run in paragraph.Runs)
                {
                    WriteCharacterFormat(state, run);
                    if (run.IsLineBreak)
                    {
                        WriteControl(state, "\\line");
                        continue;
                    }
                    WriteText(state, run.Text);
                }

                WriteParagraphEnd(state);
                state.PreviousParagraph = paragraph;
            }

            state.Output.Append("}\r\n");
            return state.Output.ToString();
        }

        private static void WriteParagraphLayout(WriterState state, RtfParagraph paragraph)
        {
            WriteControl(state, "\\pard");
            if (paragraph.Alignment == RtfAlignment.Center) WriteControl(state, "\\qc");
            if (paragraph.Alignment == RtfAlignment.Right) WriteControl(state, "\\qr");
            if (paragraph.Alignment == RtfAlignment.Justify) WriteControl(state, "\\qj");
            if (paragraph.FirstIndentTwips != 0) WriteControl(state, "\\fi" + paragraph.FirstIndentTwips);
            if (paragraph.LeftIndentTwips != 0) WriteControl(state, "\\li" + paragraph.LeftIndentTwips);
        }

        private static void WriteCharacterFormat(WriterState state, RtfRun run)
        {
            if (run.Bold != state.Bold) WriteControl(state, run.Bold ? "\\b" : "\\b0");
            if (run.Italic != state.Italic) WriteControl(state, run.Italic ? "\\i" : "\\i0");
            if (run.Underline != state.Underline) WriteControl(state, run.Underline ? "\\ul" : "\\ulnone");
            if (run.FontSizeHalfPoints != state.FontSizeHalfPoints) WriteControl(state, "\\fs" + run.FontSizeHalfPoints);

            state.Bold = run.Bold;
            state.Italic = run.Italic;
            state.Underline = run.Underline;
            state.FontSizeHalfPoints = run.FontSizeHalfPoints;
        }

        private static void WriteControl(WriterState state, string controlWord)
        {
            state.Output.Append(controlWord);
            state.NeedsDelimiter = true;
        }

        private static void WriteParagraphEnd(WriterState state)
        {
            state.Output.Append("\\par\r\n");
            state.NeedsDelimiter = false;
        }

        private static void WriteText(WriterState state, string text)
        {
            foreach (char c in text)
            {
                if (c == '\t')
                {
                    WriteControl(state, "\\tab");
                    continue;
                }
                if (c < ' ' || c == '\uFEFF' || c == '\u200B') continue;

                string encoded = EncodeChar(c);
                if (state.NeedsDelimiter)
                {
                    state.Output.Append(' ');
                    state.NeedsDelimiter = false;
                }
                state.Output.Append(encoded);
            }
        }

        private static string EncodeChar(char c)
        {
            if (c == '\\' || c == '{' || c == '}') return "\\" + c;
            if (c == '\u00A0') return " ";
            if (c < 0x80) return c.ToString();
            if (Cp1252.TryEncode(c, out byte value)) return "\\'" + value.ToString("x2");

            int signed = c > short.MaxValue ? c - 65536 : c;
            return "\\u" + signed + "?";
        }
    }
}
