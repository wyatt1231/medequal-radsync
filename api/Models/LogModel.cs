using System;

namespace Api.Models
{
    public class LogModel
    {
        public int? log_pk { get; set; }
        public string ref_pk { get; set; }
        public string ref_table { get; set; }
        public string activity { get; set; }
        public string user_reason { get; set; }
        public string sts_pk { get; set; }
        public DateTime? encoded_at { get; set; }
        public string encoded_by { get; set; }
    }
}
