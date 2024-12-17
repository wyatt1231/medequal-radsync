using System;

namespace Api.Models
{
    public class FtpModel
    {
        public string pk { get; set; }
        public string file_name { get; set; }
        public string file_path { get; set; }
        public DateTime? modified_time { get; set; }
        public string file_base64 { get; set; }
        public byte[] file_byte { get; set; }
    }
}
