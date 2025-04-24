
using Api.Context;
using Api.DataTransferObjects;
using Api.Utils;

using Dapper;

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

using Newtonsoft.Json;

using radsync_server.Config;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using static Api.DataTransferObjects.PagingDtos;
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
        Task<List<StudyDto>> GetStudys(UserDto user, PagingDto paging);
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

        public string QueryFilter(FilterDto filter)
        {
            string filter_query = "";
            string operatorValue = filter.operatorValue.ToLower();
            string value = filter.value;
            string columnField = $@"TRIM({filter.columnField})";


            if (operatorValue == "" || filter.value == "") return filter_query;

            if (filter.type == "date")
            {
                if ((string.Equals(operatorValue, "is", StringComparison.OrdinalIgnoreCase))) filter_query = $@"{columnField} = '{value}')";
                if ((string.Equals(operatorValue, "not", StringComparison.OrdinalIgnoreCase))) filter_query = $@"{columnField} != '{value}')";
                if ((string.Equals(operatorValue, "after", StringComparison.OrdinalIgnoreCase))) filter_query = $@"{columnField} > '{value}')";
                if ((string.Equals(operatorValue, "onOrAfter", StringComparison.OrdinalIgnoreCase))) filter_query = $@"{columnField} >= '{value}')";
                if ((string.Equals(operatorValue, "before", StringComparison.OrdinalIgnoreCase))) filter_query = $@"{columnField} < '{value}')";
                if ((string.Equals(operatorValue, "onOrBefore", StringComparison.OrdinalIgnoreCase))) filter_query = $@"{columnField} <= '{value}')";
            }
            else
            {
                //string
                if ((string.Equals(operatorValue, "equals", StringComparison.OrdinalIgnoreCase))) filter_query = $@"{columnField} = '{value}'";
                if ((string.Equals(operatorValue, "contains", StringComparison.OrdinalIgnoreCase))) filter_query = $@"{columnField} LIKE '%{value}%'";
                if ((string.Equals(operatorValue, "startsWith", StringComparison.OrdinalIgnoreCase))) filter_query = $@"{columnField} LIKE '{value}%'";
                if ((string.Equals(operatorValue, "endsWith", StringComparison.OrdinalIgnoreCase))) filter_query = $@"{columnField} LIKE '%{value}'";
                if ((string.Equals(operatorValue, "isEmpty", StringComparison.OrdinalIgnoreCase))) filter_query = $@"{columnField} is not null and {columnField}  != '')";
                if ((string.Equals(operatorValue, "isAnyOf", StringComparison.OrdinalIgnoreCase)))
                {
                    List<string> values = value.Split(",").ToList();
                    if (values.Count > 0)
                    {
                        for (int i = 0; i < values.Count; i++) values[i] = $@"'{values[i]}'";

                        filter_query = $@"{columnField} in ({string.Join(",", values)})";
                    }
                }
            }

            if (!string.IsNullOrEmpty(filter_query)) filter_query = $" {filter_query} ";
            //date

            return filter_query;
        }


        public string QuerySort(SortDto sort)
        {
            if (string.IsNullOrEmpty(sort.field) || string.IsNullOrEmpty(sort.sort)) return "";
            string filter_query = $@" ORDER BY {sort.field} {sort.sort} ";
            return filter_query;
        }

        public async Task<List<StudyDto>> GetStudys(UserDto user, PagingDto paging)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();
            StudyFilterDto filter = null;
            string other_filters_join = "";


            if (!string.IsNullOrEmpty(paging.other_filters))
            {

                 filter = JsonConvert.DeserializeObject<StudyFilterDto>(paging.other_filters);

                List<string> other_filters = new List<string>();

                if (filter.days_ago >= 0) other_filters.Add($" (DATEDIFF(date(now()), date(dateencoded))) <= @days_ago");
                if (!string.IsNullOrEmpty(filter.patient_no)) other_filters.Add($" patrefno LIKE  '%{filter.patient_no}%'  ");
                if (!string.IsNullOrEmpty(filter.patient_name)) other_filters.Add($" TRIM(patientname) LIKE '%{filter.patient_name}%'  ");
                if (!string.IsNullOrEmpty(filter.hospital_no)) other_filters.Add($" hospitalno LIKE '%{filter.hospital_no}%'  ");
                if (!string.IsNullOrEmpty(filter.referring_physician)) other_filters.Add($" TRIM(referringdoc) LIKE '%{filter.referring_physician}%'  ");
                if (!string.IsNullOrEmpty(filter.accession_no)) other_filters.Add($" radresultno LIKE '%{filter.accession_no}%' ");
                if (!string.IsNullOrEmpty(filter.study_description)) other_filters.Add($" procdesc LIKE '%{filter.study_description}%'  ");
                if (!string.IsNullOrWhiteSpace(filter.study_date_from) ) other_filters.Add(" date(studydate) >= @study_date_from ");
                if (!string.IsNullOrWhiteSpace(filter.study_date_to)) other_filters.Add(" date(studydate) <= @study_date_to ");
                if (filter.urgency.Count() > 0) other_filters.Add(" urgency in @urgency ");
                if (filter.modality.Count() > 0) other_filters.Add(" modality in @modality ");
                if (filter.status.Count() > 0) other_filters.Add(" resulttag in @status ");
                if (filter.patient_type.Count() > 0) other_filters.Add(" patient_type in @patient_type ");

                other_filters_join = (other_filters.Count > 0 ? $" {string.Join(" AND ", other_filters)}" : $"");

            }

            string query_filter = QueryFilter(paging.filter);

            bool has_adv_filter = !string.IsNullOrWhiteSpace(other_filters_join);
            bool has_column_filter = !string.IsNullOrWhiteSpace(query_filter);



            string filters = has_adv_filter ? $" WHERE {other_filters_join} {(has_column_filter ? $" AND {query_filter}" : "")}" 
                            : has_column_filter ? $" WHERE {query_filter}" : "";


            bool is_doctor = UserConfig.IsDoctor(user.user_type);
            string docCode = await GetDoctorCode(user);


            string sql_query = $@"SELECT * FROM 
                                        (SELECT 
                                        CASE WHEN rd.resulttag='C' THEN 'CHARGE' WHEN rd.resulttag='D' THEN 'DRAFT' 
                                        WHEN rd.resulttag='F' THEN 'FINAL' WHEN rd.resulttag='P' THEN 'PERFORMED' 
                                        WHEN rd.resulttag='R' THEN 'REVOKED' WHEN rd.resulttag='M' THEN 'CREDIT MEMO' 
                                        WHEN rd.resulttag='V' THEN 'RECEIVED' WHEN rd.resulttag='T' THEN 'PRINTED' ELSE 'SCHEDULE' END resulttag
                                        ,rd.hospitalno 
                                        ,rd.patrefno,CONCAT(pat.lastname,', ',pat.firstname,' ',pat.suffix,' ',pat.middlename) AS patientname 
                                        ,DATE_FORMAT(birthdate,'%Y-%m-%d') AS dob,pat.sex 
                                        ,radresultno, DATE_FORMAT(rd.dateencoded, '%Y-%m-%dT%H:%i:%s')  AS studydate 
                                        ,procdesc,urgency,modality,COALESCE(dm.doc_name,'') referringdoc  
                                        ,IF(TRIM(address)='',completeaddress, CONCAT(TRIM(address),', ',completeaddress)) address
                                        ,if(rd.pattype = 'I', 'Admitted OP', if(rd.pattype = 'O', 'OP Current', if(rd.pattype = 'C', 'Cash Current', ''))) patient_type
                                        ,rd.dateencoded
                                        FROM radresult rd 
                                        LEFT JOIN prochdr ph ON ph.proccode=rd.refcode 
                                        LEFT JOIN vw_requestingdoctor dm ON dm.doccode=rd.reqdoccode 
                                        LEFT JOIN patmaster pat ON pat.hospitalno=rd.hospitalno 
                                        LEFT JOIN department d ON d.deptcode=chargedept 
                                        LEFT JOIN PSGCAddress pc ON pc.barangaycode=pat.perbarangay 
                                        where rd.deptcode='0004'  AND rd.resulttag IN ('D', 'P','F','C')  {(is_doctor  ? "" : " AND rd.readerdoc = '" + docCode + "'")}
                                        ) 
                                    AS studies 
                                    {filters}
                                    {QuerySort(paging.sort)} LIMIT {paging.size} OFFSET {((paging.page) * paging.size)}
                                ";


            List<StudyDto> data = (await con.QueryAsync<StudyDto>(sql_query, filter, transaction: transaction)).ToList();
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
                                            LEFT JOIN department d ON d.deptcode=chargedept 
                                            WHERE 
                                            rd.`radresultno` = @radresultno LIMIT 1"
                                            , new { radresultno }, transaction: transaction);



            if (study == null)
            {
                throw new Exception($"The study with result number {radresultno} does not exist!");
            }

            string accession_link = configuration[Constants.ACCESSION_LINK];

            string result_no = study.radresultno;
            if (result_no.Contains("R"))
            {
                result_no = result_no.Replace("R", "");
            }

            study.study_link = accession_link + result_no;


            if (!env.IsProduction())
            {
                study.study_link = accession_link + "250004605";
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
                          ,mobileno,chiefcomplaint,admdiagnosis, rd.radhistory
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
                            ,mobileno,chiefcomplaint,admdiagnosis, rd.radhistory
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
                            ,contactno mobileno,'' chiefcomplaint,'' admdiagnosis, rd.radhistory
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



            string prev_study_link = configuration[Constants.PREV_STUDY_LINK];
            patient.prev_study_link = prev_study_link + patient.hospitalno;

            if (!env.IsProduction())
            {
                patient.prev_study_link = prev_study_link + "00100233";
            }


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


            if (is_save_as_draft && new List<string> { "F", "C" }.Contains(status))
            {
                throw new Exception("You are not allowed to save this result as DRAFT");
            }

            if (is_save_as_final && new List<string> { "F", "C" }.Contains(status))
            {
                throw new Exception("You are not allowed to save this result as FINAL");
            }

            var study_result_entity = await this.GetStudy(study.radresultno, user);

            string docCode = await GetDoctorCode(user);
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
                              new { study_result_entity.radresultno, doccode = docCode }, transaction: transaction);
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

        public async Task<string> GetDoctorCode(UserDto user)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();

            string docCode = "";

            docCode = await con.QuerySingleOrDefaultAsync<string>(
                     $@"select d.doccode from deptdoctor d  where d.useraccount  = @username limit 1;",
                     new { user.username }, transaction: transaction);

            if (!UserConfig.IsDoctor(user.user_type) && string.IsNullOrEmpty(docCode))
            {
                // throw new Exception("You are not allowed to do this action!");
            }

            return docCode;
        }

        public async Task<List<StudyTemplateDto>> GetStudyTemplates(UserDto user)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();

            string docCode = await GetDoctorCode(user);

            List<StudyTemplateDto> templates = (await con.QueryAsync<StudyTemplateDto>($@"
                                                        select r.templateno, r.templatekey , r.templatedesc  from resulttemplate r  
                                                         {(UserConfig.IsDoctor(user.user_type) ? $"WHERE r.tempdoccode = @doccode" : "")}
                                            ", new { doccode = docCode }, transaction: transaction)).ToList();

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

            if (!UserConfig.IsDoctor(user.user_type)) throw new Exception("You are not allowed to do this action!");

            string docCode = await GetDoctorCode(user);
            study.user = docCode;

            int total = await con.QuerySingleOrDefaultAsync<int>("select  coalesce (MAX(CAST(rt.templateno AS UNSIGNED)), 0) from resulttemplate rt", new { }, transaction: transaction);
            total = total + 1;

            study.templateno = total + "";

            await con.ExecuteAsync(
                            $@"insert into resulttemplate set templateno=@templateno, tempdeptcode = '0004', templatekey = @templatekey,templatedesc = @templatedesc, 
                                tempdoccode = '{docCode}', encodedby = '{user.username}', templatedate  = now(), dateencoded  = now();",
                            study, transaction: transaction);

            return study;

        }

        public async Task<StudyTemplateDto> UpdateStudyTemplate(StudyTemplateDto study, UserDto user)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();

            if (!UserConfig.IsDoctor(user.user_type)) throw new Exception("You are not allowed to do this action!");

            string docCode = await GetDoctorCode(user);
            study.user = docCode;

            await con.ExecuteAsync(
                            $@"update resulttemplate set templatekey = @templatekey,templatedesc = @templatedesc where templateno=@templateno;",
                            study, transaction: transaction);

            return study;
        }


        public async Task<bool> DeleteStudyTemplate(string templateno, UserDto user)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();

            if (!UserConfig.IsDoctor(user.user_type)) throw new Exception("You are not allowed to do this action!");

            string docCode = await GetDoctorCode(user);

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
                                 where resulttag='F' and rd.hospitalno=@hospitalno and rd.radresultno not in ('{study.radresultno}')
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
