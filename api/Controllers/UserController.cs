using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using radsync_server.Config;
using radsync_server.Hooks;
using radsync_server.Interfaces;

using System;
using System.Security.Claims;
using System.Threading.Tasks;

using static Api.DataTransferObjects.UserDtos;
using static radsync_server.DataTransferObjects.AuthDtos;
using static radsync_server.DataTransferObjects.ResponseDtos;

namespace radsync_server.Controllers
{
    [Route("api/user/")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository user_repo;

        public UserController(IUserRepository user_repo)
        {
            this.user_repo = user_repo;
        }


        [Authorize]
        [HttpGet]
        public async Task<IActionResult> LoggedInUser()
        {
            try
            {
                string username = User.Identity.Name;
                string user_type = UseClaims.PriorityRole((ClaimsIdentity)User.Identity);

                if (username == null || user_type == null)
                {
                    return Unauthorized();
                }

                UserDto payload = new UserDto
                {
                    username = username,
                    user_type = user_type
                };

                UserDto user = await user_repo.UserAsync(payload);
                user.user_type = user_type;
                return Ok(user);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }


        [Authorize]
        [HttpPost("password")]
        public async Task<IActionResult> Password(PasswordDto payload)
        {
            try
            {
                string username = User.Identity.Name;
                string user_type = UseClaims.PriorityRole((ClaimsIdentity)User.Identity);

                if (username == null || user_type == null)
                {
                    return Unauthorized();
                }

                UserDto user_payload = new UserDto
                {
                    username = username,
                    user_type = user_type
                };

                if (String.Equals(user_type, UserConfig.ADMIN, StringComparison.OrdinalIgnoreCase))
                {
                    return StatusCode(
                        StatusCodes.Status201Created,
                        new ResponseDto
                        {
                            success = false,
                            message = "Only doctors are allowed to change their password in this web application"
                        });
                }

                ResponseDto response = await user_repo.ChangePasswordAsync(payload, user_payload);
                return StatusCode(StatusCodes.Status201Created, response);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ErrorDto()
                {
                    code = 500,
                    type = "InternalServerError",
                    title = "Internal server error has occured",
                    detail = e.Message,
                });
            }
        }


    }
}
