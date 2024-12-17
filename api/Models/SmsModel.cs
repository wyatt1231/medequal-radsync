using System;

namespace radsync_server.Models
{
    public class SmsModel
    {
        public string message_to { get; set; }
        public string message_from { get; set; }
        public string message_text { get; set; }
        public DateTime? encoded_at { get; set; }
        public string encoded_by { get; set; }

        //ext
        public string consult_req_pk { get; set; }
    }
}
