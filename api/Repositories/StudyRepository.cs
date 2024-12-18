
using Api.Context;
using Api.DataTransferObjects;

using Dapper;

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

using radsync_server.Config;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using static Api.DataTransferObjects.StudyDtos;
using static Api.DataTransferObjects.UserDtos;

namespace radsync_server.Repositories
{
    public interface IStudyRepository
    {
        Task<List<StudyDto>> GetStudys(UserDto user);
        Task<StudyDto> GetStudy(string radresultno, UserDto user);
        Task<StudyDto> GetStudyImpression(string radresultno, UserDto user);
        Task<InpatientDtos> GetStudyPatient(string radresultno, UserDto user);
        Task<StudyDto> UpdateStudyImpression(StudyDto study, UserDto user);
        Task<List<StudyTemplateDto>> GetStudyTemplates(UserDto user);
    }

    public class StudyRepository : IStudyRepository
    {
        private readonly IConfiguration configuration;
        private readonly MySqlDbContext mysql_db_context;
        private readonly IWebHostEnvironment env;


        public StudyRepository(IWebHostEnvironment env, IConfiguration configuration, MySqlDbContext mysql_db_context)
        {
            this.configuration = configuration;
            this.mysql_db_context = mysql_db_context;
            this.env = env;

        }
        public async Task<List<StudyDto>> GetStudys(UserDto user)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();

            string sql_query = $@"SELECT * FROM 
                                        (SELECT 
                                         GetRadResultTag(rd.resulttag) resulttag,rd.hospitalno 
                                         ,rd.patrefno,CONCAT(pat.lastname,', ',pat.firstname,' ',pat.suffix,' ',pat.middlename) AS patientname 
                                         ,DATE(birthdate) AS dob,pat.sex 
                                         ,radresultno radresultno,rd.dateencoded AS studydate 
                                         ,procdesc,urgency,modality,reqdoccode,
                                         CONCAT( COALESCE(dm.`lastname`,''),', ', COALESCE(dm.`firstname`,''),' ',COALESCE(dm.`middlename`,''))  referringdoc 
                                         ,deptname sourcedept 
                                         ,ph.tag,rd.csno,rd.refcode,filmcontrolno
                                         ,rd.deptcode,rd.sectioncode
                                         FROM radresult rd 
                                         LEFT JOIN prochdr ph ON ph.proccode=rd.refcode 
                                         LEFT JOIN `docmaster` dm ON dm.`doccode` = rd.`reqdoccode`
                                         LEFT JOIN inpmaster inp ON inp.patno=rd.patrefno 
                                         LEFT JOIN patmaster pat ON pat.hospitalno=inp.hospitalno 
                                         LEFT JOIN department d ON d.deptcode=chargedept 
                                         WHERE
                                         rd.deptcode='0004'
                                         AND rd.pattype='I'
                                         AND rd.resulttag IN ('D', 'P','F','C')
                                        ) 
                                    AS studies 
                                ";

            List<StudyDto> data = (await con.QueryAsync<StudyDto>(sql_query, new { }, transaction: transaction)).ToList();
            return data;
        }

        public async Task<StudyDto> GetStudy(string radresultno, UserDto user)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();


            StudyDto study = await con.QuerySingleOrDefaultAsync<StudyDto>($@"
                                            SELECT 
                                            rd.`radresultno`,GetRadResultTag(rd.resulttag) resulttag,  rd.`resultdate`, COALESCE(dm.doc_name,'') referringdoc , rd.csno,
                                            rd.`dateperformed`,ph.`proccode`, ph.`procdesc`,accessionno,rd.dateencoded AS studydate,
                                            rd.`urgency`,rd.`modality`
                                            ,deptname sourcedept,rd.filmcontrolno
                                            FROM radresult rd 
                                            LEFT JOIN prochdr ph ON ph.proccode=rd.refcode 
                                            LEFT JOIN vw_requestingdoctor dm ON dm.doccode=rd.reqdoccode 
                                            LEFT JOIN inpmaster inp ON inp.patno=rd.patrefno 
                                            LEFT JOIN patmaster pat ON pat.hospitalno=inp.hospitalno 
                                            LEFT JOIN department d ON d.deptcode=chargedept 
                                            WHERE 
                                            rd.`radresultno` = @radresultno LIMIT 1"
                                            , new { radresultno }, transaction: transaction);



            if (study == null)
            {
                throw new Exception($"The study with result number {radresultno} does not exist!");
            }

            if (env.IsProduction())
            {
                string config_link = configuration[Constants.PROCEDURE_LINK];

                string result_no = study.radresultno;
                if (result_no.Contains("R"))
                {
                    result_no = result_no.Replace("R", "");
                }

                study.study_link = config_link + result_no;
            }
            else
            {

                study.study_link = "https://universalviewer.io/uv.html?manifest=https://media.library.ohio.edu/iiif/2/lynnjohnson:728/manifest.json";
            }

            return study;
        }

        public async Task<InpatientDtos> GetStudyPatient(string radresultno, UserDto user)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();


            InpatientDtos patient = await con.QuerySingleOrDefaultAsync<InpatientDtos>($@"
                                            SELECT ip.hospitalno, ip.patno, ip.admprefix, ip.admlastname, ip.admfirstname, ip.admmiddlename, ip.admsuffix,
                                            pm.`sex`, pm.`birthdate`, ((YEAR(`ip`.`admissiondate`) - YEAR(`pm`.`birthdate`)) - (SUBSTR(`ip`.`admissiondate`,6,5) < RIGHT(`pm`.`birthdate`,5))) age,
                                            rt.`nsunit`, rt.`roomcode` , rt.`bedno`,
                                            ip.`admissiondate`, ip.`dischargedate`, ip.`admdiagnosis`,cs.`ChiefComplaint` chiefcomplaint
                                            FROM inpmaster ip
                                            LEFT JOIN patmaster pm ON  pm.hospitalno = ip.`hospitalno`  
                                            LEFT JOIN `roomtran` rt ON rt.`patno` = ip.`patno`
                                            LEFT JOIN clinicalsummary cs ON cs.`PatNo` = ip.`patno`
                                            JOIN radresult rr ON rr.`patrefno` = ip.`patno`
                                            WHERE rr.radresultno =@radresultno LIMIT 1                
                                            "
                                       , new { radresultno }, transaction: transaction);

            if (patient == null)
            {
                throw new Exception($"The study with radresultno {radresultno} does not exist!");
            }

            return patient;
        }

        public async Task<StudyDto> GetStudyImpression(string radresultno, UserDto user)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();


            //ALTER TABLE `radresult` ADD COLUMN `radresulthtml` TEXT NULL AFTER `machinecode`;

            StudyDto data = await con.QuerySingleOrDefaultAsync<StudyDto>($@"
                                            select radresultno,resultdesc,radresulthtml, resulttag from `radresult` where radresultno =@radresultno limit 1   
                                            "
                                       , new { radresultno }, transaction: transaction);

            if (data == null)
            {
                throw new Exception($"The study with result number {radresultno} does not exist!");
            }

            return data;
        }

        public async Task<StudyDto> UpdateStudyImpression(StudyDto study, UserDto user)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();

            if (!new List<string> { "D", "F" }.Contains(study.resulttag.ToUpper()))
            {
                throw new Exception("Only study tags 'Draft' or 'Final' are accepted!");
            }

            bool is_draft = study.resulttag.ToUpper() == "D";
            bool is_final = study.resulttag.ToUpper() == "F";

            int is_savable = await con.QuerySingleAsync<int>(
                          $@"SELECT  IF(`resulttag` IN ('D', 'C'), 1, 0)   FROM `radresult` WHERE radresultno = @radresultno",
                          study, transaction: transaction);

            if (is_savable != 1)
            {
                throw new Exception("The study can no longet be updated!");
            }

            study.user = user.username;

            if (is_draft)
            {
                await con.ExecuteAsync(
                            $@"update `radresult` set resulttag=@resulttag, radresulthtml = @radresulthtml,draftuser=@user, resultdate=now() where radresultno = @radresultno",
                            study, transaction: transaction);

            }
            else if (is_final)
            {
                await con.ExecuteAsync(
                               $@"update `radresult` set resulttag=@resulttag, radresulthtml = @radresulthtml,finaluser=@user, resultdate=now() where radresultno = @radresultno",
                               study, transaction: transaction);
            }


            return study;

        }

        public async Task<List<StudyTemplateDto>> GetStudyTemplates(UserDto user)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();

            List<StudyTemplateDto> templates = (await con.QueryAsync<StudyTemplateDto>($@"
                                                        select r.templateno, r.templatekey , r.templatedesc , r.templatedeschtml from resulttemplate r 
                                                         {(UserConfig.IsDoctor(user.user_type) ? $" WHERE r.tempdoccode = @doccode" : "")}
                                            ", new { doccode = user.username }, transaction: transaction)).ToList();

            return templates;
        }

    }
}
