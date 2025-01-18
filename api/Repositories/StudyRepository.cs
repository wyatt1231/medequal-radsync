
using Api.Context;
using Api.DataTransferObjects;
using Api.Utils;

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
        Task<StudyTemplateDto> AddStudyTemplate(StudyTemplateDto study, UserDto user);
        Task<bool> DeleteStudyTemplate(string templateno, UserDto user);
        Task<StudyDto> GetStudy(string radresultno, UserDto user);
        Task<StudyDto> GetStudyImpression(string radresultno, UserDto user);
        Task<InpatientDtos> GetStudyPatient(string radresultno, UserDto user);
        Task<List<StudyDto>> GetStudys(UserDto user, StudyFilterDto filter);
        Task<List<StudyTemplateDto>> GetStudyTemplates(UserDto user);
        Task<StudyDto> UpdateStudyImpression(StudyDto study, UserDto user);
        Task<StudyTemplateDto> UpdateStudyTemplate(StudyTemplateDto study, UserDto user);
        Task<bool> UnverifyStudyImpression(string radresultno, UserDto user);
        Task<List<StudyDto>> GetStudyPrevs(UserDto user, StudyDto study);
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
        public async Task<List<StudyDto>> GetStudys(UserDto user, StudyFilterDto filter)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();

            string sql_query = $@"SELECT * FROM 
                                        (SELECT 
                                         GetRadResultTag(rd.resulttag) resulttag,rd.hospitalno 
                                         ,rd.patrefno,CONCAT(pat.lastname,', ',pat.firstname,' ',pat.suffix,' ',pat.middlename) AS patientname 
                                         ,DATE_FORMAT(birthdate, '%Y-%m-%d') AS dob,pat.sex 
                                         ,radresultno radresultno,DATE_FORMAT(rd.dateencoded, '%Y-%m-%dT%H:%i:%s') AS studydate
                                         ,procdesc,urgency,modality
                                         ,CONCAT( COALESCE(dm.`lastname`,''),', ', COALESCE(dm.`firstname`,''),' ',COALESCE(dm.`middlename`,''))  referringdoc 
                                         ,inp.mobileno 
                                         ,concat(b.barangaydesc,', ', c.citymundesc,', ', p.provincedesc,', ', r.regiondesc,', ' ,inp.admperzipcode) address
                                         #,DATEDIFF(date(now()), date(rd.dateencoded))  a_order
                                         FROM radresult rd 
                                         LEFT JOIN prochdr ph ON ph.proccode=rd.refcode 
                                         LEFT JOIN docmaster dm ON dm.doccode = rd.reqdoccode
                                         LEFT JOIN inpmaster inp ON inp.patno=rd.patrefno 
                                         LEFT JOIN patmaster pat ON pat.hospitalno=inp.hospitalno 
                                         LEFT JOIN department d ON d.deptcode=chargedept 
                                         left join region r on r.regioncode  = inp.admperregion 
                                         left join province p  on p.provincecode  = inp.admperprovince  
                                         left join citymunicipality c on c.citymuncode  = inp.admpercitymun  
                                         left join barangay b  on b.barangaycode  = inp.admperbarangay  
                                         WHERE
                                         rd.deptcode='0004'
                                         AND rd.resulttag IN ('D', 'P','F','C')
                                         and (DATEDIFF(date(now()), date(rd.dateencoded))) <= @days_ago
                                        ) 
                                    AS studies 
                                ";

            List<StudyDto> data = (await con.QueryAsync<StudyDto>(sql_query, new { filter.days_ago }, transaction: transaction)).ToList();
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
                //study.study_link = "https://universalviewer.io/uv.html?manifest=https://media.library.ohio.edu/iiif/2/lynnjohnson:728/manifest.json";
                study.study_link = "https://192.168.1.55/ZFP?mode=Proxy#amp;un=zfpopenapi&amp;pw=YRLj8mqXPmkT7fTy44cjzIaoEca9rquhTY%2fkkl%2fOVdCZp4bWSQdw2bcRq7RujyjUrth7SPJP5ftYW3eQNUfd1g%3d%3d&amp;san=250001354";
            }

            return study;
        }

        public async Task<InpatientDtos> GetStudyPatient(string radresultno, UserDto user)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();

            var pat_type = await con.QuerySingleAsync<string>("select r.pattype from radresult r where r.radresultno =@radresultno", new { radresultno }, transaction);

            if (string.IsNullOrEmpty(pat_type)) throw new Exception($"The study with result number {radresultno} does not exist!");


            string query = "";
            if (pat_type == "I")
            {
                query = $@"select 
                          rd.hospitalno 
                          ,rd.patrefno patno,CONCAT(pat.lastname,', ',pat.firstname,' ',pat.suffix,' ',pat.middlename) AS patientname 
                          ,DATE_FORMAT(birthdate,'%m/%d/%Y') AS birthdate,pat.sex 
                          ,((YEAR(inp.admissiondate) - year(pat.birthdate)) - (SUBSTR(inp.admissiondate ,6,5) < RIGHT(pat.birthdate,5))) age
                          ,IF(TRIM(address)='',completeaddress, CONCAT(TRIM(address),', ',completeaddress)) address
                          ,radresultno resultno,accessionno,DATE_FORMAT(rd.dateencoded,'%m/%d/%Y %h:%m:%s %p') AS studydate 
                          ,procdesc,urgency,modality,reqdoccode,COALESCE(dm.doc_name,'') referringdoc 
                          ,COALESCE(CONCAT(roomcode,'|',bedno,'|',nsunit),'Discharged')  nsroombed
                          ,deptname sourcedept 
                          ,unitremarks,transport,pregnant,ph.tag,rd.csno,rd.refcode
                          ,rd.deptcode,rd.sectioncode
                          ,DATE_FORMAT(rd.dateperformed,'%m/%d/%Y %h:%m:%s %p') dateperformed
                          ,DATE_FORMAT(inp.admissiondate,'%m/%d/%Y %h:%m:%s %p') admissiondate
                          ,DATE_FORMAT(inp.dischargedate,'%m/%d/%Y %h:%m:%s %p') dischargedate
                          ,mobileno,chiefcomplaint,admdiagnosis
                          FROM radresult rd 
                          LEFT JOIN prochdr ph ON ph.proccode=rd.refcode 
                          LEFT JOIN vw_requestingdoctor dm ON dm.doccode=rd.reqdoccode 
                          left join inpmaster inp on inp.patno=rd.patrefno 
                          LEFT JOIN patmaster pat ON pat.hospitalno=rd.hospitalno 
                          LEFT JOIN department d ON d.deptcode=chargedept
                          left join clinicalsummary cs on cs.patno=rd.patrefno
                          LEFT JOIN PSGCAddress pc ON pc.barangaycode=pat.perbarangay 
                          LEFT JOIN vw_currentadmittedroom rm ON rm.patno=rd.patrefno 
                          WHERE rd.radresultno=@radresultno";
            }
            else if (pat_type == "O")
            {
                query = $@"SELECT rd.hospitalno 
                            ,rd.patrefno patno,CONCAT(pat.lastname,', ',pat.firstname,' ',pat.suffix,' ',pat.middlename) AS patientname 
                            ,DATE_FORMAT(birthdate,'%m/%d/%Y') AS birthdate,pat.sex 
                            ,((YEAR(inp.trandate) - year(birthdate)) - (SUBSTR(inp.trandate ,6,5) < RIGHT(birthdate,5))) age
                            ,IF(TRIM(address)='',completeaddress, CONCAT(TRIM(address),', ',completeaddress)) address
                            ,radresultno resultno,accessionno,DATE_FORMAT(rd.dateencoded,'%m/%d/%Y %h:%m:%s %p') AS studydate 
                            ,procdesc,urgency,modality,reqdoccode,COALESCE(dm.doc_name,'') referringdoc 
                            ,'OPD|1|OP'  nsroombed
                            ,deptname sourcedept 
                            ,unitremarks,transport,pregnant,ph.tag,rd.csno,rd.refcode 
                            ,rd.deptcode,rd.sectioncode
                            ,DATE_FORMAT(rd.dateperformed,'%m/%d/%Y %h:%m:%s %p') dateperformed
                            ,DATE_FORMAT(inp.trandate,'%m/%d/%Y %h:%m:%s %p') admissiondate
                            ,DATE_FORMAT(inp.expired,'%m/%d/%Y %h:%m:%s %p') dischargedate
                            ,mobileno,chiefcomplaint,admdiagnosis
                            FROM radresult rd 
                            LEFT JOIN prochdr ph ON ph.proccode=rd.refcode 
                            LEFT JOIN vw_requestingdoctor dm ON dm.doccode=rd.reqdoccode 
                            LEFT JOIN opmaster inp ON inp.patno=rd.patrefno 
                            LEFT JOIN patmaster pat ON pat.hospitalno=rd.hospitalno 
                            LEFT JOIN department d ON d.deptcode=chargedept
                            LEFT JOIN clinicalsummary cs ON cs.patno=rd.patrefno
                            LEFT JOIN PSGCAddress pc ON pc.barangaycode=pat.perbarangay 
                            WHERE rd.radresultno=@radresultno
                            ";
            }
            else if (pat_type == "C")
            {
                query = $@"SELECT rd.hospitalno 
                            ,rd.patrefno patno,CONCAT(pat.lastname,', ',pat.firstname,' ',pat.suffix,' ',pat.middlename) AS patientname 
                            ,DATE_FORMAT(birthdate,'%m/%d/%Y') AS birthdate,pat.sex 
                            ,((YEAR(rd.dateencoded) - year(birthdate)) - (SUBSTR(rd.dateencoded ,6,5) < RIGHT(birthdate,5))) age
                            ,IF(TRIM(address)='',completeaddress, CONCAT(TRIM(address),', ',completeaddress)) address
                            ,radresultno resultno,accessionno,DATE_FORMAT(rd.dateencoded,'%m/%d/%Y %h:%m:%s %p') AS studydate 
                            ,procdesc,urgency,modality,reqdoccode,COALESCE(dm.doc_name,'') referringdoc 
                            ,'OPD|1|CASH'  nsroombed
                            ,deptname sourcedept 
                            ,unitremarks,transport,pregnant,ph.tag,rd.csno,rd.refcode
                            ,rd.deptcode,rd.sectioncode
                            ,DATE_FORMAT(rd.dateperformed,'%m/%d/%Y %h:%m:%s %p') dateperformed
                            ,DATE_FORMAT(rd.dateencoded,'%m/%d/%Y %h:%m:%s %p') admissiondate
                            ,DATE_FORMAT(rd.dateencoded,'%m/%d/%Y %h:%m:%s %p') dischargedate
                            ,contactno mobileno,'' chiefcomplaint,'' admdiagnosis
                            FROM radresult rd 
                            LEFT JOIN prochdr ph ON ph.proccode=rd.refcode 
                            LEFT JOIN vw_requestingdoctor dm ON dm.doccode=rd.reqdoccode 
                            LEFT JOIN opdiagnosticsum inp ON inp.cashpatref=rd.patrefno 
                            LEFT JOIN patmaster pat ON pat.hospitalno=rd.hospitalno 
                            LEFT JOIN department d ON d.deptcode=chargedept
                            LEFT JOIN clinicalsummary cs ON cs.patno=rd.patrefno
                            LEFT JOIN PSGCAddress pc ON pc.barangaycode=pat.perbarangay 
                            WHERE rd.radresultno=@radresultno
                            ";
            }

            InpatientDtos patient = await con.QuerySingleOrDefaultAsync<InpatientDtos>(query, new { radresultno }, transaction: transaction);

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



            StudyDto data = await con.QuerySingleOrDefaultAsync<StudyDto>($@"
                                            select radresultno,resultdesc, resulttag from `radresult` where radresultno =@radresultno limit 1   
                                            "
                                       , new { radresultno }, transaction: transaction);

            if (data == null)
            {
                throw new Exception($"The study with result number {radresultno} does not exist!");
            }

            data.font_size = StringUtil.GetRtfFontSize(data.resultdesc ?? "");
            data.radresulthtml = StringUtil.RtfToHtml(data.resultdesc ?? "");

            return data;
        }

        public async Task<StudyDto> UpdateStudyImpression(StudyDto study, UserDto user)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();

            if (!UserConfig.IsDoctor(user.user_type)) throw new Exception("You are not allowed to do this action!");

            //{ (UserConfig.IsDoctor(user.user_type) ? $"r.tempdoccode = @doccode" : "r.encodedby=@doccode")}

            if (!new List<string> { "D", "F" }.Contains(study.resulttag.ToUpper()))
            {
                throw new Exception("Only study tags  'Draft' or 'Final' are accepted!");
            }

            bool is_save_as_draft = study.resulttag.ToUpper() == "D";
            bool is_save_as_final = study.resulttag.ToUpper() == "F";

            string status = await con.QuerySingleAsync<string>(
                        $@"SELECT  resulttag   FROM `radresult` WHERE radresultno = @radresultno",
                        study, transaction: transaction);

            //if (status == "P")
            //{
            //    throw new Exception("You are not allowed to update this result because it is already set as PERFORMED");
            //}


            if (is_save_as_draft && new List<string> { "F", "C" }.Contains(status))
            {
                throw new Exception("You are not allowed to save this result as DRAFT");
            }

            if (is_save_as_final && new List<string> { "F", "C" }.Contains(status))
            {
                throw new Exception("You are not allowed to save this result as FINAL");
            }

            var study_result_entity = await this.GetStudy(study.radresultno, user);

            study.user = user.username;

            if (is_save_as_draft)
            {
                await con.ExecuteAsync(
                            $@"update `radresult` set resulttag=@resulttag, resultdesc = @resultdesc,draftuser=@user, resultdate=now() where radresultno = @radresultno",
                            study, transaction: transaction);

            }
            else if (is_save_as_final)
            {
                int is_success_update_result = await con.ExecuteAsync(
                               $@"update `radresult` set resulttag=@resulttag, resultdesc = @resultdesc,finaluser=@user, resultdate=now() where radresultno = @radresultno",
                               study, transaction: transaction);

                await con.ExecuteAsync(
                               $@"update trandtls  set done = 'Y' where resultno = @radresultno and csno = @csno;",
                               new { study_result_entity.radresultno, study_result_entity.csno }, transaction: transaction);

                await con.ExecuteAsync(
                              $@"insert  into radresultdoc  set radresultno = @radresultno, doccode  = @doccode;",
                              new { study_result_entity.radresultno, doccode = user.username }, transaction: transaction);
            }

            return study;

        }

        public async Task<bool> UnverifyStudyImpression(string radresultno, UserDto user)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();

            if (!UserConfig.IsDoctor(user.user_type)) throw new Exception("You are not allowed to do this action!");

            int is_allow_verify = await con.QuerySingleAsync<int>(
                          $@"SELECT IF(resulttag IN ('F'), 1, 0)   FROM `radresult` WHERE radresultno = @radresultno",
                          new { radresultno }, transaction: transaction);

            if (is_allow_verify != 1)
            {
                throw new Exception("You are not allowed to unverify this impression!");
            }

            int unverify_success = await con.ExecuteAsync(
                           $@"update `radresult` set resulttag='D' where radresultno = @radresultno",
                           new { radresultno, user.username }, transaction: transaction);

            if (unverify_success < 1)
            {
                throw new Exception("The result has not been set to UNVERIED!");
            }

            int is_success_log = await con.ExecuteAsync(
                                $@"insert into radresult_log select *, now() addendum_date , @username addendum_by , @host, @ip from radresult where radresultno  = @radresultno",
                                new { radresultno, username = user.username, host = "", ip = "" }, transaction: transaction);

            return is_success_log > 0;
        }


        public async Task<List<StudyTemplateDto>> GetStudyTemplates(UserDto user)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();

            List<StudyTemplateDto> templates = (await con.QueryAsync<StudyTemplateDto>($@"
                                                        select r.templateno, r.templatekey , r.templatedesc  from resulttemplate r  
                                                        WHERE {(UserConfig.IsDoctor(user.user_type) ? $"r.tempdoccode = @doccode" : "r.encodedby=@doccode")}
                                            ", new { doccode = user.username }, transaction: transaction)).ToList();

            foreach (var item in templates)
            {
                item.font_size = StringUtil.GetRtfFontSize(item.templatedesc ?? "");
                item.templatedeschtml = StringUtil.RtfToHtml(item.templatedesc ?? "");
            }

            return templates;
        }

        public async Task<StudyTemplateDto> AddStudyTemplate(StudyTemplateDto study, UserDto user)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();

            study.user = user.username;

            int total = await con.QuerySingleOrDefaultAsync<int>("select  coalesce (MAX(CAST(rt.templateno AS UNSIGNED)), 0) from resulttemplate rt", new { }, transaction: transaction);
            total = total + 1;

            study.templateno = total + "";

            await con.ExecuteAsync(
                            $@"insert into resulttemplate set templateno=@templateno, tempdeptcode = '0004', templatekey = @templatekey,templatedesc = @templatedesc, 
                               {(UserConfig.IsDoctor(user.user_type) ? "tempdoccode = @user," : "")} 
                                encodedby = @user, templatedate  = now(), dateencoded  = now();",
                            study, transaction: transaction);

            return study;

        }

        public async Task<StudyTemplateDto> UpdateStudyTemplate(StudyTemplateDto study, UserDto user)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();

            study.user = user.username;

            await con.ExecuteAsync(
                            $@"update resulttemplate set templatekey = @templatekey,templatedesc = @templatedesc where templateno=@templateno;",
                            study, transaction: transaction);

            return study;
        }


        public async Task<bool> DeleteStudyTemplate(string templateno, UserDto user)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();


            int success = await con.ExecuteAsync(
                             $@"delete from resulttemplate where templateno=@templateno;",
                             new { templateno }, transaction: transaction);

            return success > 0;
        }


        #region PREVIOUS STUDY

        public async Task<List<StudyDto>> GetStudyPrevs(UserDto user, StudyDto study)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();

            string sql_query = $@"select radresultno,modality, date_format(rd.dateencoded,'%m/%d/%Y') as studydate,procdesc  
                                 ,'' age  
                                 ,resultdesc  
                                 ,birthdate,rd.hospitalno,rd.dateencoded  
                                 ,COALESCE((select group_concat(GetDoctorsName(doccode) separator '; ') raddoc from radresultdoc rx where rx.radresultno=rd.radresultno),'') resultdoc  
                                 from radresult rd  
                                 left join prochdr ph on ph.proccode=rd.refcode  
                                 left join patmaster pat on pat.hospitalno=rd.hospitalno  
                                 where resulttag='F' and rd.hospitalno=@hospitalno and rd.radresultno not in (@radresultno)
                                 order by rd.dateencoded
                                ";
            //study.radresultno

            List<StudyDto> data = (await con.QueryAsync<StudyDto>(sql_query, study, transaction: transaction)).ToList();

            foreach (var item in data)
            {
                item.font_size = StringUtil.GetRtfFontSize(item.resultdesc ?? "");
                item.radresulthtml = StringUtil.RtfToHtml(item.resultdesc ?? "");
            }


            return data;
        }

        #endregion

    }
}
