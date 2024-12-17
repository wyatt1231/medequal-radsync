namespace radsync_server.Models.User
{
    public static class UserModel
    {

        public class UserCredentials
        {
            public string username { get; set; }
            public string modid { get; set; }
            public int agreedtos { get; set; }
        }

    }
}
