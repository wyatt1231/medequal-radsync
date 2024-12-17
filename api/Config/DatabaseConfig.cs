namespace radsync_server.Config
{
    public static class DatabaseConfig
    {
        public static string conStr;


        public static string GetConnection()
        {
            return conStr;
        }
    }
}
