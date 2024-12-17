using radsync_server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using static radsync_server.DataTransferObjects.LibraryDtos;
using static radsync_server.DataTransferObjects.ResponseDtos;


namespace radsync_server.Controllers
{

    [Route("api/library/")]
    public class LibraryController : ControllerBase
    {
        private readonly ILibraryRepository _lib_repo;

        public LibraryController(ILibraryRepository lib_repo)
        {
            _lib_repo = lib_repo;
        }

        [HttpGet("medicine")]
        [Authorize]
        public async Task<IActionResult> GetMedLib()
        {
            try
            {
                List<GetLibraryDto> data = await _lib_repo.GetMedLib();
                return Ok(data);
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

        [HttpGet("frequency")]
        [Authorize]
        public async Task<IActionResult> GetFreqLib()
        {
            try
            {
                List<GetLibraryDto> data = await _lib_repo.GetFreqLib();
                return Ok(data);
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
