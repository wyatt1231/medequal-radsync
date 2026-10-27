using System.Collections.Generic;

namespace Api.Utils.Rtf
{
    public enum RtfAlignment
    {
        Left,
        Center,
        Right,
        Justify
    }

    /// <summary>
    /// A span of text sharing one character format, or a soft line break (RTF \line) when <see cref="IsLineBreak"/> is set.
    /// Tabs are kept as '\t' inside <see cref="Text"/>.
    /// </summary>
    public class RtfRun
    {
        public string Text { get; set; } = "";
        public bool IsLineBreak { get; set; }
        public bool Bold { get; set; }
        public bool Italic { get; set; }
        public bool Underline { get; set; }
        public int FontSizeHalfPoints { get; set; } = RtfDocument.DEFAULT_FONT_SIZE_HALF_POINTS;

        public bool HasSameFormat(RtfRun other)
        {
            return Bold == other.Bold && Italic == other.Italic && Underline == other.Underline && FontSizeHalfPoints == other.FontSizeHalfPoints;
        }
    }

    public class RtfParagraph
    {
        public RtfAlignment Alignment { get; set; } = RtfAlignment.Left;
        public int LeftIndentTwips { get; set; }
        public int FirstIndentTwips { get; set; }
        public List<RtfRun> Runs { get; } = new List<RtfRun>();

        public bool HasSameLayout(RtfParagraph other)
        {
            return Alignment == other.Alignment && LeftIndentTwips == other.LeftIndentTwips && FirstIndentTwips == other.FirstIndentTwips;
        }

        /// <summary>
        /// Drops empty text runs and merges neighbouring text runs that share a format, so equal content always has one shape.
        /// </summary>
        public void Normalize()
        {
            List<RtfRun> merged = new List<RtfRun>();
            foreach (RtfRun run in Runs)
            {
                if (!run.IsLineBreak && run.Text.Length == 0) continue;

                RtfRun last = merged.Count > 0 ? merged[merged.Count - 1] : null;
                if (last != null && !last.IsLineBreak && !run.IsLineBreak && last.HasSameFormat(run))
                {
                    last.Text += run.Text;
                    continue;
                }
                merged.Add(run);
            }
            Runs.Clear();
            Runs.AddRange(merged);
        }
    }

    /// <summary>
    /// Format-neutral model of a rich-text report: the subset of RTF the legacy VB.NET RichTextBox and the web editor share
    /// (bold/italic/underline, per-run font size, alignment, left/first-line indent, tabs and soft line breaks).
    /// </summary>
    public class RtfDocument
    {
        /// <summary>11pt — size used for text that carries no explicit size in the editor.</summary>
        public const int DEFAULT_FONT_SIZE_HALF_POINTS = 22;

        public List<RtfParagraph> Paragraphs { get; } = new List<RtfParagraph>();

        public void Normalize()
        {
            foreach (RtfParagraph paragraph in Paragraphs) paragraph.Normalize();
        }
    }
}
