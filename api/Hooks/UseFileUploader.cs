using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Text.RegularExpressions;
using static radsync_server.DataTransferObjects.ResponseDtos;

namespace radsync_server.Hooks
{
    public static class UseFileUploader
    {
        public static ResponseDto saveImage(byte[] bytes, string url, string fileName, string extention, int maxLen)
        {
            try
            {
                if (bytes.Length > maxLen)
                {
                    return new ResponseDto
                    {
                        success = false,
                        message = "The uploaded image exceeds the maximum accepted limit"
                    };
                }
                else
                {
                    url = Regex.Replace(url, @"\s+", "-");
                    string fileUrl = url + fileName + DateTimeOffset.Now.ToUnixTimeSeconds() + "." + extention;

                    if (!Directory.Exists(Directory.GetCurrentDirectory() + url))
                    {
                        Directory.CreateDirectory(Directory.GetCurrentDirectory() + url);
                    }

                    var baseUrl = Directory.GetCurrentDirectory() + fileUrl;
                    Image image = new Bitmap(720, UInt16.MaxValue - 36);
                    using (MemoryStream ms = new MemoryStream(bytes))
                    {
                        image = Image.FromStream(ms);
                        image.Save(baseUrl, ImageFormat.Jpeg);
                    }
                    return new ResponseDto
                    {
                        success = true,
                        message = "",
                        data = fileUrl
                    };
                }
            }
            catch (Exception e)
            {
                return new ResponseDto
                {
                    success = false,
                    message = "An error occured while uploading a file. " + e.Message
                };
            }


        }


        public static string getImageFromUrl(string url)
        {
            try
            {
                using (Image image = Image.FromFile(Directory.GetCurrentDirectory() + url))
                {

                    using (MemoryStream m = new MemoryStream())
                    {
                        image.Save(m, image.RawFormat);
                        byte[] imageBytes = m.ToArray();
                        return "data:image/jpg;base64," + Convert.ToBase64String(imageBytes);
                    }
                }
            }
            catch (Exception)
            {
                return "";
            }
        }
    }
}
