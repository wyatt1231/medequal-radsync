using System;

namespace radsync_server.Models
{
    public class ChatModel
    {
        public string connection_id { get; set; }
        public string consult_req_pk { get; set; }
        public string user { get; set; }
        public string user_type { get; set; }
        public string message { get; set; }
        public DateTime? send_at { get; set; }
    }
}
