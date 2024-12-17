using Api.Hooks;
using QRCoder;
using System.Drawing;

namespace radsync_server.Hooks
{
    public class UseQr
    {
        public static string CreateConsultSoaQr(string hash_key, string base_64_image)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(hash_key, QRCodeGenerator.ECCLevel.Q);
            QRCode qrCode = new QRCode(qrCodeData);


            var brand_logo_bitmap = UseFileParser.Base64StringToBitmap(base_64_image);
            Bitmap qrCodeImage = qrCode.GetGraphic(35, Color.Black, Color.White, brand_logo_bitmap, 25);
            string qr_with_brand_logo = UseFileParser.BitmapToBase64(qrCodeImage);

            return qr_with_brand_logo;
        }
    }
}
