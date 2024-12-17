using radsync_server.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using static radsync_server.DataTransferObjects.ResponseDtos;

namespace radsync_server.Controllers
{

    [Route("/api/config/")]
    public class ConfigController : ControllerBase
    {
        private readonly IConfigRepository _config_repo;
        public ConfigController(IConfigRepository config_repo)
        {
            _config_repo = config_repo;
        }

        [HttpGet("hospital-logo")]
        public async Task<IActionResult> GetHospitalLogo()
        {
            try
            {
                string hospital_name = await _config_repo.GetHospitalLogoAsync();

                return Ok(hospital_name);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ErrorDto()
                {
                    code = 500,
                    title = "Internal server error has occured",
                    type = "",
                    detail = e.Message,
                });
            }
        }

        [HttpGet("hospital-name")]
        public async Task<IActionResult> GetHospitalName()
        {
            try
            {
                string hospital_name = await _config_repo.GetHospitalNameAsync();

                return Ok(hospital_name);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ErrorDto()
                {
                    code = 500,
                    title = "Internal server error has occured",
                    type = "",
                    detail = e.Message,
                });
            }
        }
    }
}
