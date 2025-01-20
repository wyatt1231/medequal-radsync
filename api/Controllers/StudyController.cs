using Api.Context;
using Api.DataTransferObjects;

using AutoMapper;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

using radsync_server.Hooks;
using radsync_server.Interfaces;
using radsync_server.Repositories;

using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

using static Api.DataTransferObjects.PagingDtos;
using static Api.DataTransferObjects.StudyDtos;
using static Api.DataTransferObjects.UserDtos;

namespace radsync_server.Controllers
{

    [Route("api/study/")]
    [Authorize]
    public class StudyController : ControllerBase
    {
        private readonly IStudyRepository study_repo;
        private readonly IUserRepository user_repo;

        private readonly IConfiguration configuration;
        private readonly MySqlDbContext mysql_db_context;


        public StudyController(IMapper mapper,
            IStudyRepository study_repo,
            IUserRepository user_repo,
            IConfiguration configuration,
            MySqlDbContext mysql_db_context
            )
        {
            this.configuration = configuration;
            this.mysql_db_context = mysql_db_context;
            this.user_repo = user_repo;
            this.study_repo = study_repo;
        }

        [HttpPost]
        public async Task<ActionResult<List<StudyDto>>> GetStudys([FromBody]  PagingDto paging)
        {
            await mysql_db_context.BeginTransactionAsync();

            UserDto user = new UserDto()
            {
                username = User.Identity.Name,
                user_type = UseClaims.PriorityRole((ClaimsIdentity)User.Identity)
            };

            var data = await study_repo.GetStudys(user, paging);

            await mysql_db_context.CommitTransactionAsync();
            return data;
        }

        [HttpGet("{radresultno}")]
        public async Task<ActionResult<StudyDto>> GetStudy(string radresultno)
        {
            await mysql_db_context.BeginTransactionAsync();

            UserDto user = new()
            {
                username = User.Identity.Name,
                user_type = UseClaims.PriorityRole((ClaimsIdentity)User.Identity)
            };

            var data = await study_repo.GetStudy(radresultno, user);

            await mysql_db_context.CommitTransactionAsync();
            return data;
        }


        [HttpGet("{radresultno}/patient")]
        public async Task<ActionResult<InpatientDtos>> GetStudyPatient(string radresultno)
        {
            await mysql_db_context.BeginTransactionAsync();

            UserDto user = new UserDto()
            {
                username = User.Identity.Name,
                user_type = UseClaims.PriorityRole((ClaimsIdentity)User.Identity)
            };

            var data = await study_repo.GetStudyPatient(radresultno, user);

            await mysql_db_context.CommitTransactionAsync();
            return data;
        }


        [HttpGet("{radresultno}/impression")]
        public async Task<ActionResult<StudyDto>> GetStudyImpression(string radresultno)
        {
            await mysql_db_context.BeginTransactionAsync();

            UserDto user = new UserDto()
            {
                username = User.Identity.Name,
                user_type = UseClaims.PriorityRole((ClaimsIdentity)User.Identity)
            };

            var data = await study_repo.GetStudyImpression(radresultno, user);

            await mysql_db_context.CommitTransactionAsync();
            return data;
        }

        [HttpPut("{radresultno}/impression")]
        public async Task<ActionResult<StudyDto>> UpdateStudyImpression([FromBody] StudyDto study)
        {
            await mysql_db_context.BeginTransactionAsync();

            UserDto user = new UserDto()
            {
                username = User.Identity.Name,
                user_type = UseClaims.PriorityRole((ClaimsIdentity)User.Identity)
            };

            var data = await study_repo.UpdateStudyImpression(study, user);

            await mysql_db_context.CommitTransactionAsync();
            return data;
        }


        [HttpPut("{radresultno}/impression/unverify")]
        public async Task<ActionResult<bool>> UnverifyStudyImpression(string radresultno)
        {
            await mysql_db_context.BeginTransactionAsync();

            UserDto user = new UserDto()
            {
                username = User.Identity.Name,
                user_type = UseClaims.PriorityRole((ClaimsIdentity)User.Identity)
            };

            var data = await study_repo.UnverifyStudyImpression(radresultno, user);

            await mysql_db_context.CommitTransactionAsync();
            return data;
        }


        #region TEMPLATES

        [HttpGet("template")]
        public async Task<ActionResult<List<StudyTemplateDto>>> GetStudyTemplates()
        {
            await mysql_db_context.BeginTransactionAsync();

            UserDto user = new UserDto()
            {
                username = User.Identity.Name,
                user_type = UseClaims.PriorityRole((ClaimsIdentity)User.Identity)
            };

            var data = await study_repo.GetStudyTemplates(user);

            await mysql_db_context.CommitTransactionAsync();
            return data;
        }

        [HttpPost("template")]
        public async Task<ActionResult<StudyTemplateDto>> AddStudyTemplate([FromBody] StudyTemplateDto study_template)
        {
            await mysql_db_context.BeginTransactionAsync();

            UserDto user = new UserDto()
            {
                username = User.Identity.Name,
                user_type = UseClaims.PriorityRole((ClaimsIdentity)User.Identity)
            };

            var data = await study_repo.AddStudyTemplate(study_template, user);

            await mysql_db_context.CommitTransactionAsync();
            return data;
        }

        [HttpPut("template")]
        public async Task<ActionResult<StudyTemplateDto>> UpdateStudyTemplate([FromBody] StudyTemplateDto study_template)
        {
            await mysql_db_context.BeginTransactionAsync();

            UserDto user = new UserDto()
            {
                username = User.Identity.Name,
                user_type = UseClaims.PriorityRole((ClaimsIdentity)User.Identity)
            };

            var data = await study_repo.UpdateStudyTemplate(study_template, user);

            await mysql_db_context.CommitTransactionAsync();
            return data;
        }


        [HttpDelete("template/{templateno}")]
        public async Task<ActionResult<bool>> DeleteStudyTemplate(string templateno)
        {
            await mysql_db_context.BeginTransactionAsync();

            UserDto user = new UserDto()
            {
                username = User.Identity.Name,
                user_type = UseClaims.PriorityRole((ClaimsIdentity)User.Identity)
            };

            var data = await study_repo.DeleteStudyTemplate(templateno, user);

            await mysql_db_context.CommitTransactionAsync();
            return data;
        }


        #endregion

        #region STUDY PREVIOUS


        [HttpPost("prevs")]
        public async Task<ActionResult<List<StudyDto>>> GetStudyPrevs([FromBody] StudyDto study)
        {
            await mysql_db_context.BeginTransactionAsync();

            UserDto user = new UserDto()
            {
                username = User.Identity.Name,
                user_type = UseClaims.PriorityRole((ClaimsIdentity)User.Identity)
            };

            var data = await study_repo.GetStudyPrevs(user, study);

            await mysql_db_context.CommitTransactionAsync();
            return data;
        }


        #endregion

    }
}
