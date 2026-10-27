using System;
using System.Globalization;
using System.Text;

namespace Api.Utils.Rtf
{
    /// <summary>
    /// Renders an <see cref="RtfDocument"/> as the HTML the web editor (Quill) loads. Each paragraph carries
    /// white-space: pre-wrap so the editor keeps tabs and repeated spaces instead of collapsing them, and font sizes
    /// are written in points (the unit RTF uses) so they survive the edit/save round trip unchanged.
    /// </summary>
    public static class EditorHtmlWriter
    {
        /// <summary>Serialises the document to editor HTML.</summary>
        public static string Write(RtfDocument document)
        {
            StringBuilder sb = new StringBuilder();
            foreach (RtfParagraph paragraph in document.Paragraphs)
            {
                sb.Append("<p ");
                if (paragraph.Runs.Count == 0 && paragraph.Mark != null)
                {
                    sb.Append(EditorHtmlReader.MARK_ATTRIBUTE).Append("=\"").Append(EditorHtmlReader.FormatMark(paragraph.Mark)).Append("\" ");
                }
                sb.Append("style=\"").Append(BlockStyle(paragraph)).Append("\">");

                if (paragraph.Runs.Count == 0)
                {
                    sb.Append("<br></p>");
                    continue;
                }

                foreach (RtfRun run in paragraph.Runs)
                {
                    sb.Append("<span style=\"font-size: ").Append(FormatPoints(run.FontSizeHalfPoints / 2.0)).Append(";\">");
                    if (run.Bold) sb.Append("<strong>");
                    if (run.Italic) sb.Append("<em>");
                    if (run.Underline) sb.Append("<u>");
                    if (run.IsLineBreak) sb.Append("<span class=\"").Append(EditorHtmlReader.SOFT_BREAK_CLASS).Append("\"></span>");
                    else AppendEscaped(sb, run.Text);
                    if (run.Underline) sb.Append("</u>");
                    if (run.Italic) sb.Append("</em>");
                    if (run.Bold) sb.Append("</strong>");
                    sb.Append("</span>");
                }

                sb.Append("</p>");
            }

            // Quill drops one trailing unformatted line whenever it loads HTML, which would silently delete a blank
            // last line of the report on every open/save. This sacrificial line is the one it drops.
            if (document.Paragraphs.Count > 0) sb.Append("<p ").Append(EditorHtmlReader.TRAILING_LINE_ATTRIBUTE).Append("=\"true\"><br></p>");
            return sb.ToString();
        }

        private static string BlockStyle(RtfParagraph paragraph)
        {
            StringBuilder style = new StringBuilder("white-space: pre-wrap;");
            if (paragraph.Alignment == RtfAlignment.Center) style.Append(" text-align: center;");
            if (paragraph.Alignment == RtfAlignment.Right) style.Append(" text-align: right;");
            if (paragraph.Alignment == RtfAlignment.Justify) style.Append(" text-align: justify;");
            if (paragraph.LeftIndentTwips != 0) style.Append(" margin-left: ").Append(FormatPoints(paragraph.LeftIndentTwips / 20.0)).Append(';');
            // The RichTextBox never draws a first line left of the page margin (e.g. \fi-360 with no \li starts at 0), so
            // a hanging indent is clamped the same way instead of pushing text out of the editor.
            int firstIndentTwips = Math.Max(paragraph.FirstIndentTwips, -paragraph.LeftIndentTwips);
            if (firstIndentTwips != 0) style.Append(" text-indent: ").Append(FormatPoints(firstIndentTwips / 20.0)).Append(';');
            return style.ToString();
        }

        private static string FormatPoints(double points)
        {
            return points.ToString("0.##", CultureInfo.InvariantCulture) + "pt";
        }

        private static void AppendEscaped(StringBuilder sb, string text)
        {
            foreach (char c in text)
            {
                switch (c)
                {
                    case '&': sb.Append("&amp;"); break;
                    case '<': sb.Append("&lt;"); break;
                    case '>': sb.Append("&gt;"); break;
                    case ' ': sb.Append("&nbsp;"); break;
                    default: sb.Append(c); break;
                }
            }
        }
    }
}
