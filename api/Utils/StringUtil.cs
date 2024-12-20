using System;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace Api.Utils
{
    public class StringUtil
    {

        public static string RtfToHtml(string rtf)
        {
            string html = RtfPipe.Rtf.ToHtml(rtf);

            html = html.Replace(" &nbsp;", "&nbsp;&nbsp;");
            html = html.Replace("pt", "px");

            //Console.WriteLine(html);
            Debug.WriteLine("------------------------------------------------");
            Debug.WriteLine(html);
            Debug.WriteLine("------------------------------------------------");

            return html;
        }

        public static string GetRtfFontSize(string rtf)
        {

            // Regular expression pattern to extract the first font size following \fs
            string pattern = @"\\fs(\d+)";

            // Search for the first font size in the RTF string using regex
            Match match = Regex.Match(rtf, pattern);

            // Check if a match is found and display the font size
            if (match.Success)
            {
                int fontSizeInHalfPoints = int.Parse(match.Groups[1].Value);
                double fontSizeInPoints = fontSizeInHalfPoints / 2.0; // Convert from half-points to points
                return Convert.ToInt32(fontSizeInPoints) + "pt";
            }
            else
            {
                return "11pt";
            }
        }

        private static string CleanNonHtmlCharacters(string rtf)
        {
            // Remove RTF header and other non-HTML parts (e.g., \rtf1\ansi, \deff0, font table)
            rtf = Regex.Replace(rtf, @"{\\rtf1[^\}]*}", "");

            // Remove any remaining RTF control characters (e.g., \uc0, \u)
            rtf = Regex.Replace(rtf, @"\\[a-zA-Z0-9]+", "");

            // Remove any unneeded RTF curly braces or other special characters
            rtf = Regex.Replace(rtf, @"[{}]", "");

            // Remove any other stray characters that may have been left
            rtf = Regex.Replace(rtf, @"[\\]", "");

            return rtf;
        }
    }
}
