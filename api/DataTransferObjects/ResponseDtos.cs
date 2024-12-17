using System.ComponentModel.DataAnnotations;

namespace radsync_server.DataTransferObjects
{
    public class ResponseDtos
    {
        public class ResponseDto
        {
            [Required]
            public bool success { get; set; } = false;
            public object data { get; set; }
            public string message { get; set; }
            public string status { get; set; }
        }

        public class ErrorDto
        {
            public int code { get; set; }
            public string type { get; set; }
            public string title { get; set; } //a brief, human-readable message about the error
            public string detail { get; set; }  //a  human-readable explanation of the error
            public string instance { get; set; } // a URI that identifies the specific occurrence of the error
        }
    }
}
