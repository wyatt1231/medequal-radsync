using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace Api.Hooks
{
    public static class UseFileParser
    {
        public static Bitmap Base64StringToBitmap(string base64String)
        {
            Bitmap bmpReturn = null;
            //Convert Base64 string to byte[]
            byte[] byteBuffer = Convert.FromBase64String(base64String);
            MemoryStream memoryStream = new MemoryStream(byteBuffer);

            memoryStream.Position = 0;

            bmpReturn = (Bitmap)Bitmap.FromStream(memoryStream);

            memoryStream.Close();
            memoryStream = null;
            byteBuffer = null;

            return bmpReturn;
        }

        public static string BitmapToBase64(Bitmap bit_map_image)
        {
            System.IO.MemoryStream ms = new MemoryStream();
            bit_map_image.Save(ms, ImageFormat.Jpeg);
            byte[] byteImage = ms.ToArray();
            var SigBase64 = Convert.ToBase64String(byteImage);
            return SigBase64;
        }

        public static string FiletoBase64(string path)
        {


            try
            {
                Byte[] bytes = File.ReadAllBytes(Path.Combine(Directory.GetCurrentDirectory(), path));
                string file = Convert.ToBase64String(bytes);
                return file;
            }
            catch (Exception e)
            {
                return e.Message;
            }

        }

        public static byte[] StreamToByteArray(Stream input)
        {
            byte[] buffer = new byte[16 * 1024];
            using (MemoryStream ms = new MemoryStream())
            {
                int read;
                while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                {
                    ms.Write(buffer, 0, read);
                }
                return ms.ToArray();
            }
        }

    }
}
