using System;

using static radsync_server.Enums;

namespace Api.DataTransferObjects
{

    public class InpatientDtos
    {

        public string patno { get; set; }
        public string patientname { get; set; }
        public string hospitalno { get; set; }
        public string admprefix { get; set; }
        public string admlastname { get; set; }
        public string admfirstname { get; set; }
        public string admmiddlename { get; set; }
        public string admsuffix { get; set; }
        public string sex { get; set; }
        public DateTime? birthdate { get; set; }
        public int? age { get; set; }
        public string completeaddress { get; set; }
        public string phoneno { get; set; }
        public string mobileno { get; set; }
        public string emailadd { get; set; }
        public string religion { get; set; }
        public string nationality { get; set; }
        public string confinement { get; set; }
        public string admdiagnosis { get; set; }
        public string pasthistory { get; set; }
        public string briefhistory { get; set; }
        public string chiefcomplaint { get; set; }
        public string finaldx { get; set; }
        public DateTime? admissiondate { get; set; }
        public DateTime? dischargedate { get; set; }
        public string howadmit { get; set; }
        public string medtype { get; set; }
        public string gensurvey { get; set; }
        public string doccounter { get; set; }
        public string doccode { get; set; }
        public string docname { get; set; }
        public string address { get; set; }
        public string nsroombed { get; set; }

        public string roomcode { get; set; }
        public string bedno { get; set; }
        public string nsunit { get; set; }
        public string roomin { get; set; }
        public string roomout { get; set; }
        public string statustag { get; set; }
        public string doc_desc { get; set; }

        public string patient_type { get; set; }

        public string prev_study_link { get; set; }


    }





}
