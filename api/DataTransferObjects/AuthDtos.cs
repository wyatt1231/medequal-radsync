using System.ComponentModel.DataAnnotations;

namespace radsync_server.DataTransferObjects
{
    public class AuthDtos
    {
        public class LoginDto
        {
            [Required]
            public string username { get; set; }

            [Required]
            public string password { get; set; }
        }

        public class PasswordDto
        {

            [Required]
            public string old_password { get; set; }

            [Required]
            public string new_password { get; set; }


        }
    }
}
