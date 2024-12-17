using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace radsync_server.Hooks
{
    public class UseImage
    {

        public static Bitmap BlurBase64Image(string base64_image, float watermark_opacity)
        {
            byte[] byte_watermark = Convert.FromBase64String(base64_image);

            Image image;
            using (MemoryStream watermark_stream = new MemoryStream(byte_watermark))
            {
                image = Image.FromStream(watermark_stream);
            }

            Bitmap watermark_bitmap = new Bitmap(image.Width, image.Height);
            using Graphics gfx = Graphics.FromImage(watermark_bitmap);
            ColorMatrix matrix = new ColorMatrix();
            matrix.Matrix33 = watermark_opacity;
            ImageAttributes attributes = new ImageAttributes();
            attributes.SetColorMatrix(matrix, ColorMatrixFlag.Default, ColorAdjustType.Bitmap);
            gfx.DrawImage(image, new System.Drawing.Rectangle(0, 0, watermark_bitmap.Width, watermark_bitmap.Height), 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, attributes);

            return watermark_bitmap;
        }

        public static byte[] ToByteArray(Bitmap image)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                image.Save(ms, ImageFormat.Png);
                return ms.ToArray();
            }
        }
    }
}
