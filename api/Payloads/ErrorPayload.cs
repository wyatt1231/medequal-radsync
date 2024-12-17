namespace radsync_server.Payloads
{
    public class ErrorPayload
    {
        public string user_message { get; set; }
        public string internal_message { get; set; }
        public int code { get; set; }
        public string more_info { get; set; }
    }
}
