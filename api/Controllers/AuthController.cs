using radsync_server.Interfaces;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

using static radsync_server.DataTransferObjects.AuthDtos;
using static radsync_server.DataTransferObjects.ResponseDtos;
using Api.DataTransferObjects;
using static Api.DataTransferObjects.UserDtos;

namespace radsync_server.Controllers
{
    [Route("api/auth/")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IJwtAuthManager jwt_auth_manager;
        private readonly IUserRepository user_repository;

        public AuthController(IJwtAuthManager jwt_auth_manager, IUserRepository user_repository)
        {
            this.jwt_auth_manager = jwt_auth_manager;
            this.user_repository = user_repository;
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok("Running");
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync(LoginDto payload)
        {
            try
            {
                List<UserDto> user_roles = await user_repository.AuthAsync(payload);

                if (user_roles?.Count > 0)
                {
                    var claims = new Claim[user_roles.Count + 1];
                    for (int i = 0; i < user_roles.Count; i++)
                    {
                        claims[i] = new Claim(ClaimTypes.Role, user_roles[i].user_type);
                    }

                    claims[user_roles.Count] = new Claim(ClaimTypes.Name, user_roles[user_roles.Count - 1].username);

                    //var jwtResult = jwt_auth_manager.GenerateTokens(user_roles[user_roles.Count - 1].username, claims, DateTime.Now, payload.rememberme);
                    var jwtResult = jwt_auth_manager.GenerateTokens(user_roles[user_roles.Count - 1].username, claims, DateTime.Now, true);

                    return Ok(new ResponseDto
                    {
                        success = true,
                        data = new
                        {
                            access_token = jwtResult.AccessToken,
                            refresh_token = jwtResult.RefreshToken,
                            data = user_roles
                        }
                    });
                }
                else
                {
                    return Ok(new { success = false, message = "The username and/or password that you have entered is not correct. " });
                }
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            var UserId = User.Identity.Name;
            jwt_auth_manager.RemoveRefreshTokenByUserId(UserId);
            return Ok();
        }

        [Authorize]
        [HttpPost("refresh")]
        public IActionResult Refresh([FromBody] string refresh_token)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(refresh_token))
                {
                    string access_token = Request.Headers[HeaderNames.Authorization];

                    string token = access_token.Split(" ")[1];

                    var jwtResult = jwt_auth_manager.Refresh(refresh_token, token, DateTime.Now, true);
                    return Ok(new
                    {
                        access_token = jwtResult.AccessToken,
                        refresh_token = jwtResult.RefreshToken,
                    });
                }

                return Unauthorized();
            }
            catch (Exception)
            {
                return Unauthorized();
            }


        }


    }
}
