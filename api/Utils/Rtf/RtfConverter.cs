using System;
using System.Net;
using System.Text;

namespace Api.Utils.Rtf
{
    /// <summary>
    /// Entry point for converting report text between the database (RTF, shared with the legacy VB.NET app) and the web editor (HTML).
    /// </summary>
    public static class RtfConverter
    {
        /// <summary>
        /// Converts a stored RTF value to editor HTML. Blank input yields "". A value that is not RTF, or RTF that
        /// cannot be parsed, is shown as plain text so the report still opens instead of failing the request.
        /// </summary>
        public static string RtfToHtml(string rtf)
        {
            if (string.IsNullOrWhiteSpace(rtf)) return "";

            try
            {
                return EditorHtmlWriter.Write(RtfReader.Read(rtf));
            }
            catch (Exception)
            {
                return PlainTextToHtml(rtf);
            }
        }

        /// <summary>Converts editor HTML to the RTF layout the VB.NET RichTextBox writes; this is what gets stored.</summary>
        public static string HtmlToRtf(string html)
        {
            return RtfWriter.Write(EditorHtmlReader.Read(html));
        }

        private static string PlainTextToHtml(string text)
        {
            StringBuilder sb = new StringBuilder();
            foreach (string line in text.Replace("\r\n", "\n").Split('\n'))
            {
                sb.Append("<p style=\"white-space: pre-wrap;\">");
                sb.Append(line.Length == 0 ? "<br>" : WebUtility.HtmlEncode(line));
                sb.Append("</p>");
            }
            return sb.ToString();
        }
    }
}
