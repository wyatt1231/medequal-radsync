using System.Diagnostics;
using System.Text.RegularExpressions;

namespace Api.Utils
{
    public class StringUtil
    {

        public static string RtfToHtml(string rtf_format)
        {
            string html = RtfPipe.Rtf.ToHtml(rtf_format);

            html = html.Replace(" &nbsp;", "&nbsp;&nbsp;");
            html = html.Replace("pt", "px");

            //Console.WriteLine(html);
            Debug.WriteLine("------------------------------------------------");
            Debug.WriteLine(html);
            Debug.WriteLine("------------------------------------------------");

            return html;
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
