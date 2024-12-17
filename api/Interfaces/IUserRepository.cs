using System.Collections.Generic;
using System.Threading.Tasks;

using static Api.DataTransferObjects.UserDtos;
using static radsync_server.DataTransferObjects.AuthDtos;
using static radsync_server.DataTransferObjects.ResponseDtos;

namespace radsync_server.Interfaces
{
    public interface IUserRepository
    {
        Task<List<UserDto>> AuthAsync(LoginDto payload);
        Task<UserDto> UserAsync(UserDto payload);
        Task<ResponseDto> ChangePasswordAsync(PasswordDto payload, UserDto user_payload);
        Task VerifyDoctorAccess(string patno, UserDto user);
    }
}
