using System.ComponentModel.DataAnnotations;

namespace radsync_server.Payloads
{
    public class SortPayload
    {
        [Required]
        public string column { get; set; }

        [Required]
        public string direction { get; set; }
    }
}
