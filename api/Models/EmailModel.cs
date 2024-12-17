using System;

namespace radsync_server.Models
{
    public class EmailModel
    {
        public string email_to { get; set; }
        public string email_body { get; set; }
        public DateTime? encoded_at { get; set; }
        public string encoded_by { get; set; }
        //ext
        public string consult_req_pk { get; set; }
    }
}
