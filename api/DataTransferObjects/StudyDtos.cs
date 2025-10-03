using iTextSharp.text;

using System;
using System.Collections.Generic;

namespace Api.DataTransferObjects
{
    public class StudyDtos
    {
        public class StudyDto
        {
            public string radresultno { get; set; }
            public string resultdate { get; set; }
            public string resultdesc { get; set; }
            public string radresulthtml { get; set; }
            public string resulttag { get; set; }
            public string hospitalno { get; set; }
            public string patrefno { get; set; }
            public string patientname { get; set; }
            public string dob { get; set; }
            public string sex { get; set; }
            public string accessionno { get; set; }
            public string studydate { get; set; }
            public string procdesc { get; set; }
            public string urgency { get; set; }
            public string modality { get; set; }
            public string reqdoccode { get; set; }
            public string referringdoc { get; set; }
            public string sourcedept { get; set; }
            public string tag { get; set; }
            public string csno { get; set; }
            public string refcode { get; set; }
            public string filmcontrolno { get; set; }
            public string deptcode { get; set; }
            public string sectioncode { get; set; }
            public string dateperformed { get; set; }
            public string proccode { get; set; }
            public string age { get; set; }
            public string birthdate { get; set; }
            public string resultdoc { get; set; }
            public string mobileno { get; set; }
            public string address { get; set; }
            public string study_link { get; set; }
            public string radhistory { get; set; }
            public string dateencoded { get; set; }
            public string readerdoc { get; set; }
            //
            public string user { get; set; }
            public string font_size { get; set; }

        }

        public class StudyTemplateDto
        {
            public string templateno { get; set; }
            public string templatekey { get; set; }
            public string templatedesc { get; set; }
            public string templatedeschtml { get; set; }
            public string tempmodality { get; set; }
            public string user { get; set; }
            public string font_size { get; set; }
        }

        public class StudyFilterDto
        {
            public int days_ago { get; set; }
            public string patient_no { get; set; }
            public string patient_name { get; set; }
            public string hospital_no { get; set; }
            public string referring_physician { get; set; }
            public string study_date_from { get; set; }
            public string study_date_to { get; set; }
            public string accession_no { get; set; }
            public string study_description { get; set; }
            public List<string> urgency { get; set; }
            public List<string> modality { get; set; }
            public List<string> status { get; set; }
            public List<string> patient_type { get; set; }
        }

    }
}
