using iTextSharp.text;
using iTextSharp.text.pdf;
using System.Drawing;
using System.IO;

namespace radsync_server.Hooks
{
    public class UsePdf
    {
        public static void CreateWatermark(PdfContentByte dc, string text, BaseFont font, float fontSize, float angle, BaseColor color, System.Drawing.Rectangle realPageSize, System.Drawing.Rectangle rect)
        {
            var gstate = new PdfGState { FillOpacity = 0.1f, StrokeOpacity = 0.3f };
            dc.SaveState();
            dc.SetGState(gstate);
            dc.SetColorFill(color);
            dc.BeginText();
            dc.SetFontAndSize(font, fontSize);
            //var ps = rect ?? realPageSize; /*dc.PdfDocument.PageSize is not always correct*/
            var ps = realPageSize; /*dc.PdfDocument.PageSize is not always correct*/
            var x = (ps.Right + ps.Left) / 2;
            var y = (ps.Bottom + ps.Top) / 2;
            dc.ShowTextAligned(Element.ALIGN_CENTER, text, x, y, angle);
            dc.EndText();
            dc.RestoreState();
        }

        public static byte[] AddWatermarkAllPages(byte[] watermarkImagePath, byte[] pdf_bytes)
        {
            Document pdfDoc = new Document(PageSize.LETTER, 10f, 10f, 10f, 0f);
            pdfDoc.SetPageSize(iTextSharp.text.PageSize.LETTER.Rotate());
            var img = iTextSharp.text.Image.GetInstance(watermarkImagePath);
            img.SetAbsolutePosition((PageSize.A4.Width - img.ScaledWidth) / 2, (PageSize.A4.Height - img.ScaledHeight) / 2);
            //img.ScaleAbsoluteHeight(300);
            //img.ScaleAbsoluteWidth(300);

            //img.ScaleToFit(250f, 250f);
            //img.Alignment = iTextSharp.text.Image.TEXTWRAP | iTextSharp.text.Image.ALIGN_RIGHT;
            //img.IndentationLeft = 9f;
            //img.SpacingAfter = 9f;
            //img.BorderWidthTop = 36f;

            PdfContentByte waterMark;

            try
            {
                using (MemoryStream stream = new MemoryStream())
                {
                    PdfReader reader = new PdfReader(pdf_bytes);

                    using (PdfStamper stamper = new PdfStamper(reader, stream))
                    {

                        int pages = reader.NumberOfPages;
                        for (int i = 1; i <= pages; i++)
                        {
                            waterMark = stamper.GetUnderContent(i);
                            waterMark.AddImage(img);
                        }
                    }
                    return stream.ToArray();
                }
            }
            catch (System.Exception)
            {
                return null;
            }
        }
    }
}
