using Newtonsoft.Json.Converters;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using static radsync_server.Enums;

namespace radsync_server.Models
{

    public class SortDto
    {


        [Required]
        public string column { get; set; }

        [Required]
        //[EnumDataType(typeof(SortEnum))]
        //[JsonConverter(typeof(StringEnumConverter))]
        public string direction { get; set; }
    }
}
