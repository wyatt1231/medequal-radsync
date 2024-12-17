using System;
using System.ComponentModel.DataAnnotations;

namespace radsync_server.Models
{
    public class PageDto
    {
        [Required]
        [Range(0, int.MaxValue)]
        public int begin { get; set; }
        [Required]
        [Range(0, int.MaxValue)]
        public int limit { get; set; }
    }
}
