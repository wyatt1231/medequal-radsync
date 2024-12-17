using System;

namespace radsync_server.Hooks
{
    public static class UseOtpGenerator
    {
        public static string create()
        {
            string num = "0123456789";
            int len = num.Length;
            string otp = "";
            int otpSize = 6;
            string finalDigit;
            int getIndex;

            for (int i = 0; i < otpSize; i++)
            {
                do
                {
                    getIndex = new Random().Next(0, len);
                    finalDigit = num.ToCharArray()[getIndex].ToString();
                } while (otp.IndexOf(finalDigit) != -1);
                otp += finalDigit;
            }
            return otp;
        }
    }
}
