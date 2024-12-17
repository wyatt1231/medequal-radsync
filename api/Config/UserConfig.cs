using System;

namespace radsync_server.Config
{
    public static class UserConfig
    {
        public const string DOCTOR = "DOCTOR";
        public const string ADMIN = "ADMIN";

        public static bool IsDoctor(string user_type)
        {
            return String.Equals(user_type, UserConfig.DOCTOR, StringComparison.OrdinalIgnoreCase);
        }
    }
}
