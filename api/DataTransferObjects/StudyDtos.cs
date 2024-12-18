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
            public string study_link { get;set;}
            public string user { get;set;}

        }

        public class StudyTemplateDto
        {
            public string templateno { get; set; }
            public string templatekey { get; set; }
            public string templatedesc { get; set; }
            public string templatedeschtml { get; set; }
        }

    }
}
