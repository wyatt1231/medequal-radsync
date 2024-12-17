namespace radsync_server.Models
{
    public class RefreshTokenPayload
    {
        public string RefreshToken { get; set; }
        public bool rememberme { get; set; }
    }
}
