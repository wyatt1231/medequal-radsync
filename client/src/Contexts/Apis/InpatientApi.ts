import {
  Axios,
  FetchFormDataHeader,
  FetchJsonHeader,
} from "../../Config/ApiConfig";
import { SERVER_URL } from "../../Config/Config";
import { InpatientCareTeamDto } from "../../Interfaces/CareTeamInterfaces";
import {
  IClinSumEntity,
  IUpdateClinSumDto,
} from "../../Interfaces/ClinSumInterfaces";
import { ICourseWardDto } from "../../Interfaces/CourseWardInterface";
import { InpatientDoctorOrderDto } from "../../Interfaces/InpatientDoctorOrderInterfaces";
import { InpatientDto } from "../../Interfaces/InpatientInterfaces";
import { MedicineDto } from "../../Interfaces/IPatientMedicine";

import { InpatientDietOrderDto } from "../../Interfaces/PatientDietOrderInterfaces";
import { LabResultDto } from "../../Interfaces/PatientLabResultInterfaces";
import { PatientProcedureDto } from "../../Interfaces/PatientProcInterfaces";
import { IResponseDto } from "../../Interfaces/ResponseInterfaces";
import { IPatientVitalSign } from "../../Interfaces/VitalSignInterfaces";

const BASE = `api/`;

const GetInpatients = async (filter: InpatientDto): Promise<InpatientDto[]> => {
  const response = await Axios.post(SERVER_URL + BASE + `inpatients`, filter, {
    headers: FetchJsonHeader,
  });
  return response.data;
};

const GetInpatient = async (patno: string): Promise<InpatientDto> => {
  const response = await Axios.get(SERVER_URL + BASE + `inpatient/${patno}`, {
    headers: FetchFormDataHeader,
  });
  return response.data;
};

const GetInpatientClinSum = async (patno: string): Promise<IClinSumEntity> => {
  const response = await Axios.get(
    SERVER_URL + BASE + `inpatient/${patno}/clin-sum`,
    {
      headers: FetchFormDataHeader,
    }
  );
  return response.data;
};

const UpdateClaimForm = async (
  patno: string,
  payload: InpatientDto
): Promise<IResponseDto> => {
  const response = await Axios.post<IResponseDto>(
    SERVER_URL + BASE + `inpatient/${patno}/claim-form`,
    payload,
    {
      headers: FetchJsonHeader,
    }
  );
  return response.data;
};

// const AddInpatientMedication = async (
//   patno: string,
//   payload: IAddPatientMedDto
// ) => {
//   const response = await Axios.post(
//     SERVER_URL + BASE + `inpatient/${patno}/medication`,
//     payload,
//     {
//       headers: FetchJsonHeader,
//     }
//   );
//   return response;
// };

//PATIENT HISTORY

const UpdateInpatientClinSum = async (
  patno: string,
  clin_sum_payload: IUpdateClinSumDto
): Promise<InpatientDto> => {
  const response = await Axios.post(
    SERVER_URL + BASE + `inpatient/${patno}/clin-sum`,
    clin_sum_payload,
    {
      headers: FetchJsonHeader,
    }
  );
  return response.data;
};

//

const GetNurseStations = async (): Promise<IResponseDto> => {
  try {
    const response = await Axios.get(
      SERVER_URL + BASE + `inpatient/nurse-stations`,
      {
        headers: FetchJsonHeader,
      }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      data: error.data,
      message: error.message,
    };
  }
};

const GetMedications = async (patno: string): Promise<MedicineDto[]> => {
  const response = await Axios.get(
    SERVER_URL + BASE + `inpatient/${patno}/medications`,
    {
      headers: FetchJsonHeader,
    }
  );

  return response.data;
};

const GetMedication = async (
  patno: string,
  medcode: string
): Promise<MedicineDto> => {
  const response = await Axios.get(
    SERVER_URL + BASE + `inpatient/${patno}/medication/${medcode}`,
    {
      headers: FetchFormDataHeader,
    }
  );
  return response.data;
};

const AddMedication = async (
  patno: string,
  payload: MedicineDto
): Promise<MedicineDto> => {
  const response = await Axios.post(
    SERVER_URL + BASE + `inpatient/${patno}/medication`,
    payload,
    {
      headers: FetchJsonHeader,
    }
  );
  return response.data;
};

const UpdateMedication = async (
  patno: string,
  medcode: string,
  payload: MedicineDto
): Promise<MedicineDto> => {
  const response = await Axios.post(
    SERVER_URL + BASE + `inpatient/${patno}/medication/${medcode}`,
    payload,
    {
      headers: FetchJsonHeader,
    }
  );
  return response.data;
};

const GetMedicineFormulatory = async (
  patno: string,
  stockcode: string
): Promise<MedicineDto> => {
  const response = await Axios.get(
    SERVER_URL +
      BASE +
      `inpatient/${patno}/medication/${stockcode}/formulatory`,
    {
      headers: FetchFormDataHeader,
    }
  );
  return response.data;
};

//

//#region DOCTOR'S ORDER

const GetDoctorOrders = async (
  patno: string
): Promise<InpatientDoctorOrderDto[]> => {
  const response = await Axios.get(
    SERVER_URL + BASE + `inpatient/${patno}/doctor-orders`,
    {
      headers: FetchFormDataHeader,
    }
  );

  return response.data;
};

const GetDoctorOrder = async (
  patno: string,
  orderkey: number
): Promise<InpatientDoctorOrderDto> => {
  const response = await Axios.get(
    SERVER_URL + BASE + `inpatient/${patno}/doctor-order/${orderkey}`,
    {
      headers: FetchFormDataHeader,
    }
  );
  return response.data;
};

const AddDoctorOrder = async (
  patno: string,
  payload: InpatientDoctorOrderDto
): Promise<InpatientDoctorOrderDto> => {
  const response = await Axios.post(
    SERVER_URL + BASE + `inpatient/${patno}/doctor-order`,
    payload,
    {
      headers: FetchJsonHeader,
    }
  );
  return response.data;
};

const UpdateDoctorOrder = async (
  patno: string,
  orderkey: number,
  payload: InpatientDoctorOrderDto
): Promise<InpatientDoctorOrderDto> => {
  const response = await Axios.put(
    SERVER_URL + BASE + `inpatient/${patno}/doctor-order/${orderkey}`,
    payload,
    {
      headers: FetchJsonHeader,
    }
  );
  return response.data;
};

const DeleteDoctorOrder = async (
  patno: string,
  orderkey: number
): Promise<number> => {
  const response = await Axios.delete(
    SERVER_URL + BASE + `inpatient/${patno}/doctor-order/${orderkey}`,
    {
      headers: FetchJsonHeader,
    }
  );
  return response.data;
};

//#endregion

const GetInpatientProcedures = async (patno: string): Promise<any> => {
  const response = await Axios.get(
    SERVER_URL + BASE + `inpatient/${patno}/procedures`,
    {
      headers: FetchJsonHeader,
    }
  );
  return response.data;
};

const GetInpatientProcedure = async (
  patno: string,
  resultno: string
): Promise<PatientProcedureDto> => {
  const response = await Axios.get(
    SERVER_URL + BASE + `inpatient/${patno}/procedure/${resultno}`,
    {
      headers: FetchFormDataHeader,
    }
  );
  return response.data;
};

const GetInpatientProcedureResultLink = async (
  patno: string,
  resultno: string
): Promise<string> => {
  const response = await Axios.get(
    SERVER_URL + BASE + `inpatient/${patno}/procedure/${resultno}/result-link`,
    {
      headers: FetchFormDataHeader,
    }
  );
  return response.data;
};

//

const GetInpatientVitalSign = async (
  patno: string
): Promise<IPatientVitalSign> => {
  const response = await Axios.get(
    SERVER_URL + BASE + `inpatient/${patno}/vital-sign`,
    {
      headers: FetchFormDataHeader,
    }
  );
  return response.data;
};

//

const GetInpatientCareTeams = async (
  patno: string
): Promise<InpatientCareTeamDto[]> => {
  const response = await Axios.get(
    SERVER_URL + BASE + `inpatient/${patno}/care-teams`,
    {
      headers: FetchJsonHeader,
    }
  );
  return response.data;
};

//

const GetInpatientDietOrders = async (
  patno: string
): Promise<InpatientDietOrderDto[]> => {
  const response = await Axios.get(
    SERVER_URL + BASE + `inpatient/${patno}/diet-orders`,
    {
      headers: FetchJsonHeader,
    }
  );
  return response.data;
};

//

const GetCourseWards = async (patno: string): Promise<ICourseWardDto[]> => {
  const response = await Axios.get(
    SERVER_URL + BASE + `inpatient/${patno}/course-wards`,
    {
      headers: FetchJsonHeader,
    }
  );
  return response.data;
};

const GetCourseWard = async (
  patno: string,
  cw_key: number
): Promise<ICourseWardDto> => {
  const response = await Axios.get(
    SERVER_URL + BASE + `inpatient/${patno}/course-ward/${cw_key}`,
    {
      headers: FetchFormDataHeader,
    }
  );
  return response.data;
};

const AddCourseWard = async (patno: string, payload: ICourseWardDto) => {
  const response = await Axios.post(
    SERVER_URL + BASE + `inpatient/${patno}/course-ward`,
    payload,
    {
      headers: FetchJsonHeader,
    }
  );
  return response;
};

const UpdateCourseWard = async (patno: string, payload: ICourseWardDto) => {
  const response = await Axios.put(
    SERVER_URL + BASE + `inpatient/${patno}/course-ward`,
    payload,
    {
      headers: FetchJsonHeader,
    }
  );
  return response;
};

const DeleteCourseWard = async (patno: string, cwkey: number) => {
  const response = await Axios.delete(
    SERVER_URL + BASE + `inpatient/${patno}/course-ward/${cwkey}`,
    {
      headers: FetchJsonHeader,
    }
  );
  return response;
};

//LAB RESULTS

const GetInpatientLabResults = async (
  patno: string
): Promise<LabResultDto[]> => {
  const response = await Axios.get(
    SERVER_URL + BASE + `inpatient/${patno}/lab-results`,
    {
      headers: FetchJsonHeader,
    }
  );
  return response.data;
};

const GetInpatientLabResultPdf = async (
  patno: string,
  ftpuploadkey: number
): Promise<LabResultDto> => {
  const response = await Axios.get(
    SERVER_URL + BASE + `inpatient/${patno}/lab-result/${ftpuploadkey}/pdf`,
    {
      headers: FetchJsonHeader,
    }
  );
  return response.data;
};

const GetInpatientHistory = async (patno: string): Promise<InpatientDto[]> => {
  const response = await Axios.get(
    SERVER_URL + BASE + `inpatient/${patno}/history`,
    {
      headers: FetchJsonHeader,
    }
  );

  return response.data;
};

const GetInpatientChart = async (patno: string): Promise<LabResultDto> => {
  const response = await Axios.get(
    SERVER_URL + BASE + `inpatient/${patno}/chart`,
    {
      headers: FetchFormDataHeader,
    }
  );

  return response.data;
};

const InpatientApi = {
  GetInpatients,
  GetInpatient,
  GetInpatientHistory,
  GetInpatientClinSum,
  UpdateClaimForm,
  UpdateInpatientClinSum,
  GetMedications,
  GetMedication,
  AddMedication,
  UpdateMedication,
  GetMedicineFormulatory,
  GetDoctorOrders,
  GetDoctorOrder,
  AddDoctorOrder,
  UpdateDoctorOrder,
  DeleteDoctorOrder,
  GetInpatientProcedures,
  GetInpatientProcedure,
  GetInpatientProcedureResultLink,
  GetInpatientVitalSign,
  GetInpatientCareTeams,
  GetInpatientDietOrders,
  GetCourseWards,
  GetCourseWard,
  AddCourseWard,
  UpdateCourseWard,
  DeleteCourseWard,
  GetNurseStations,
  GetInpatientLabResults,
  GetInpatientLabResultPdf,
  GetInpatientChart,
};

export default InpatientApi;
