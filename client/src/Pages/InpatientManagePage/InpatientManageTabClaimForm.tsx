import { yupResolver } from "@hookform/resolvers/yup";
import HelpIcon from "@mui/icons-material/Help";
import { Box, Checkbox, Grid, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";

import { LoadingButton } from "@mui/lab";
import moment from "moment";
import { FC, memo, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import CollapseIconBotton from "../../Components/CollapseIconButton/CollapseIconButtonUi";
import CheckboxField from "../../Components/HookForm/CheckboxField";
import FractionField, {
  FractionSchema,
} from "../../Components/HookForm/FractionField";
import RadioFieldHookForm from "../../Components/HookForm/RadioFieldHookForm";
import TextFieldHookForm from "../../Components/HookForm/TextFieldHookForm";
import InpatientActions from "../../Contexts/Actions/InpatientActions";
import PageActions from "../../Contexts/Actions/PageActions";
import InpatientApi from "../../Contexts/Apis/InpatientApi";
import { RootStore } from "../../Contexts/Store";
import { calculateBmi } from "../../Helpers/EssentialHelpers";
import { ICourseWardDto } from "../../Interfaces/CourseWardInterface";
import { InpatientDto } from "../../Interfaces/InpatientInterfaces";
import { MedicineDto } from "../../Interfaces/IPatientMedicine";
import { IPatientPertinentSigns } from "../../Interfaces/IPertinentSigns";
import { IPatientPhysicalExam } from "../../Interfaces/IPhysicalExam";
import DateUtils from "../../Utils/DateUtils";
import StringUtil from "../../Utils/StringUtil";
interface InpatientManageTabClaimFormProps {
  patno: string;
}

const form_schema = yup.object({
  gensurvey: yup.string().nullable().required().label("General Survey"),
  chiefcomplaint: yup.string().nullable().required().label("Chief Complaint"),
  pasthistory: yup.string().nullable().required().label("Past History"),
  briefhistory: yup.string().nullable().required().label("Brief History"),
  admdiagnosis: yup.string().nullable().required().label("Admission Diagnosis"),
  vital_signs: yup.object({
    bloodpresure: FractionSchema(`Blood Pressure`),
    heartrate: yup.string().required().label(`Heart Rate`),
    resrate: yup.string().required().label(`Respiratory Rate`),
    temperature: yup.string().required().label(`Temperate`),
    height: yup.string().required().label(`Height`),
    weight: yup.string().required().label(`Weight`),
    bmi: yup.string().required().label(`BMI`),
  }),
  ob: yup.object({
    isapplicable: yup.boolean().required().label(`Is Applicable`),
    lmp: yup
      .string()
      .required()
      .test(`required`, `Last Menstrual Period is required`, function (value) {
        const { isapplicable } = this.parent;
        if (isapplicable === false) return true;
        return isapplicable === true && !!value ? true : false;
      }),
    gravidity: yup
      .string()
      .required()
      .test(`required`, `Gravidity is required`, function (value) {
        let { isapplicable } = this.parent;

        if (isapplicable === false) return true;
        return isapplicable === true && !!value ? true : false;
      }),
    parity: yup
      .string()
      .required()
      .test(`required`, `Parity is required`, function (value) {
        const { isapplicable } = this.parent;
        if (isapplicable === false) return true;
        return isapplicable === true && !!value ? true : false;
      }),
    fullterm: yup
      .string()
      .required()
      .test(`required`, `Full Term is required`, function (value) {
        const { isapplicable } = this.parent;
        if (isapplicable === false) return true;
        return isapplicable === true && !!value ? true : false;
      }),
    premature: yup
      .string()
      .required()
      .test(`required`, `Premature is required`, function (value) {
        const { isapplicable } = this.parent;
        if (isapplicable === false) return true;
        return isapplicable === true && !!value ? true : false;
      }),
    abortion: yup
      .string()
      .test(`required`, `Abortion is required`, function (value) {
        const { isapplicable } = this.parent;
        if (isapplicable === false) return true;
        return isapplicable === true && !!value ? true : false;
      }),
    livingchildren: yup
      .string()
      .test(`required`, `Living Children is required`, function (value) {
        const { isapplicable } = this.parent;
        if (isapplicable === false) return true;
        return isapplicable === true && !!value ? true : false;
      }),
  }),
});

const InpatientManageTabClaimForm: FC<InpatientManageTabClaimFormProps> = memo(
  ({ patno }) => {
    const dispatch = useDispatch();
    // Dispatch<InpatientReducerTypes>

    const { inpatient_info, course_wards, medications } = useSelector(
      (store: RootStore) => store.InpatientReducer
    );

    const [inpatient, set_inpatient] = useState<InpatientDto>();

    const [is_loading_course_wards, set_is_loading_course_wards] =
      useState<boolean>(false);
    const [is_loading_medications, set_is_loading_medications] =
      useState<boolean>(false);

    const course_ward_columns: GridColDef<ICourseWardDto>[] = [
      {
        field: "",
        headerName: "Actions",
        editable: false,
        // flex: ,
        width: 120,
        align: `center`,
        headerAlign: `center`,
        sortable: false,
        filterable: false,
        hideSortIcons: true,
        renderCell: (params) => {
          const row = params.row;
          return (
            <CollapseIconBotton
              iconColor="primary"
              buttonColor="primary"
              buttons={[
                {
                  text: `Update`,
                  handleClick: async () => {
                    dispatch(PageActions.SetLoading(true));
                    const course_ward = await InpatientApi.GetCourseWard(
                      patno,
                      row.cwkey ?? 0
                    );
                    dispatch(PageActions.SetLoading(false));

                    dispatch(
                      InpatientActions.SetCourseWardDialog({
                        is_open: true,
                        title: `Update Course in the Ward Order/Action`,
                        payload: course_ward,
                        submitCallback: async (data: ICourseWardDto) => {
                          let success = false;
                          dispatch(PageActions.SetLoading(true));

                          try {
                            await InpatientApi.UpdateCourseWard(patno, data);

                            dispatch(
                              PageActions.SetPrompt(
                                `The Course in the Ward has been updated successfully.`,
                                `success`
                              )
                            );

                            dispatch(InpatientActions.SetCourseWardDialog());
                            dispatch(InpatientActions.SetCourseWards(patno));
                          } catch (error: any) {
                            dispatch(PageActions.SetHttpErrorPrompt(error));
                          }

                          dispatch(PageActions.SetLoading(false));

                          return success;
                        },
                      })
                    );
                  },
                },
                {
                  text: "Delete",
                  handleClick: async () => {
                    dispatch(
                      PageActions.SetPageConfirmation({
                        open: true,
                        custom_title: `Are you sure that you want to delete this order/action?`,
                        continueCallback: async () => {
                          dispatch(PageActions.SetLoading(true));

                          try {
                            await InpatientApi.DeleteCourseWard(
                              patno,
                              row.cwkey ?? 0
                            );

                            dispatch(
                              PageActions.SetPrompt(
                                `The Course in the Ward has been deleted successfully.`,
                                `success`
                              )
                            );
                            dispatch(InpatientActions.SetCourseWardDialog());
                            dispatch(InpatientActions.SetCourseWards(patno));
                          } catch (error: any) {
                            dispatch(PageActions.SetHttpErrorPrompt(error));
                          }

                          dispatch(PageActions.SetLoading(false));
                        },
                      })
                    );
                  },
                },
              ]}
            />
          );
        },
      },
      {
        field: "cwkey",
        headerName: "Counter",
        editable: false,
        flex: 1,
      },
      {
        field: "cworder_action",
        headerName: "Course/Action",
        editable: false,
        flex: 5,
        renderCell: ({ row }) => {
          return StringUtil.Ellipses(row.cworder_action, 230, "Not specified");
        },
      },
      {
        field: "cwdate",
        headerName: "Date",
        editable: false,
        flex: 2,
        // type: `asdas`,
        renderCell: ({ row }) => {
          return (
            <Typography variant="caption">
              {DateUtils.ReplaceDateUtil(row.cwdate, "-")}
            </Typography>
          );
        },
      },
    ];

    const medication_columns: GridColDef<MedicineDto>[] = [
      {
        field: "",
        headerName: "Actions",
        editable: false,
        // flex: ,
        width: 120,
        align: `center`,
        headerAlign: `center`,
        sortable: false,
        filterable: false,
        hideSortIcons: true,
        disableColumnMenu: true,
        disableReorder: true,
        renderCell: (params) => {
          const row = params.row;
          return (
            <CollapseIconBotton
              iconColor="primary"
              buttonColor="primary"
              buttons={[
                {
                  text: `Update`,
                  handleClick: async () => {
                    dispatch(PageActions.SetLoading(true));
                    const medication = await InpatientApi.GetMedication(
                      patno,
                      row.medcode
                    );
                    dispatch(PageActions.SetLoading(false));

                    dispatch(
                      InpatientActions.SetMedicationDialog({
                        is_open: true,
                        title: `Update Medication`,
                        payload: medication,
                        submitCallback: async (data: MedicineDto) => {
                          let success = false;
                          dispatch(PageActions.SetLoading(true));

                          try {
                            await InpatientApi.UpdateMedication(
                              patno,
                              row.medcode,
                              data
                            );

                            dispatch(
                              PageActions.SetPrompt(
                                `The medication has been updated successfully!`,
                                `success`
                              )
                            );

                            dispatch(InpatientActions.SetMedicationDialog());
                            dispatch(InpatientActions.SetMedications(patno));
                          } catch (error: any) {
                            dispatch(PageActions.SetHttpErrorPrompt(error));
                          }

                          dispatch(PageActions.SetLoading(false));

                          return success;
                        },
                      })
                    );
                  },
                },
                {
                  text: "Medicine Formulatory Content",
                  handleClick: async () => {
                    dispatch(PageActions.SetLoading(true));
                    try {
                      const medicine_formulatory =
                        await InpatientApi.GetMedicineFormulatory(
                          patno,
                          row.stockcode
                        );

                      dispatch(
                        InpatientActions.SetMedicationFormulatoryDialog({
                          is_open: true,
                          title: ``,
                          payload: medicine_formulatory,
                        })
                      );
                    } catch (error) {
                      dispatch(PageActions.SetHttpErrorPrompt(error));
                    }
                    dispatch(PageActions.SetLoading(false));
                  },
                },
              ]}
            />
          );
        },
      },
      {
        field: "genericname",
        headerName: "Generic Name",
        editable: false,
        minWidth: 300,
      },
      {
        field: "stockdesc",
        headerName: "Medicine",
        editable: false,
        flex: 1,
        minWidth: 300,
      },
      {
        field: "unitdesc",
        headerName: "Unit",
        editable: false,
        minWidth: 70,
        maxWidth: 70,
      },
      {
        field: "freqdesc",
        headerName: "Frequency",
        editable: false,
        minWidth: 150,
        maxWidth: 150,
      },
      {
        field: "meddosage",
        headerName: "Dosage",
        editable: false,
        minWidth: 100,
        maxWidth: 100,
      },
      {
        field: "medroute",
        headerName: "Route",
        editable: false,
        minWidth: 70,
        maxWidth: 70,
      },
      {
        field: "datestarted",
        headerName: "Started",
        editable: false,
        type: `dateTime`,
        minWidth: 170,
        maxWidth: 170,
        renderCell: ({ row }) => {
          return DateUtils.ReplaceDateTimeUtil(row.datestarted, "");
        },
      },
      {
        field: "datestopped",
        headerName: "Stopped",
        editable: false,
        minWidth: 170,
        maxWidth: 170,
        renderCell: ({ row }) => {
          return DateUtils.ReplaceDateTimeUtil(row.datestopped, "");
        },
      },
      {
        field: "qtyonhand",
        headerName: "QtyOH",
        editable: false,
        minWidth: 70,
        maxWidth: 70,
        type: `number`,
        align: `right`,
        headerAlign: `right`,
      },
      {
        field: "qtyonreq",
        headerName: "QtyOR",
        editable: false,
        minWidth: 70,
        maxWidth: 70,
        type: `number`,
        align: `right`,
        headerAlign: `right`,
      },
      {
        field: "doctor",
        headerName: "Doctor",
        editable: false,
        minWidth: 150,
        maxWidth: 150,
      },
      {
        field: "rxremarks",
        headerName: "Remarks",
        editable: false,
        minWidth: 150,
        maxWidth: 150,
      },
      {
        field: "dangerous",
        headerName: "Dangerous",
        editable: false,
        minWidth: 90,
        maxWidth: 90,
        align: `center`,
        headerAlign: `center`,
        renderCell: ({ row }) => {
          return (
            <Checkbox checked={row.dangerous === 1} readOnly size="small" />
          );
        },
      },
      {
        field: "ams",
        headerName: "AMS",
        editable: false,
        minWidth: 90,
        maxWidth: 90,
        align: `center`,
        headerAlign: `center`,
        renderCell: ({ row }) => {
          return <Checkbox checked={row.ams === 1} readOnly size="small" />;
        },
      },
      {
        field: "highalert",
        headerName: "High Alert",
        editable: false,
        minWidth: 90,
        maxWidth: 90,
        align: `center`,
        headerAlign: `center`,
        renderCell: ({ row }) => {
          return (
            <Checkbox checked={row.highalert === 1} readOnly size="small" />
          );
        },
      },
    ];

    const [patient_pertinent_signs, set_patient_pertinent_signs] = useState<
      IPatientPertinentSigns[]
    >([]);

    const [
      selected_patient_pertinent_signs,
      set_selected_patient_pertinent_signs,
    ] = useState<GridRowId[]>([]);

    const patient_pertinent_signs_columns: GridColDef<IPatientPertinentSigns>[] =
      [
        {
          field: "pedesc",
          headerName: "Description",
          editable: false,
          flex: 2,
        },
        {
          field: "peothersremarks",
          headerName: "Other Remarks",
          minWidth: 400,
          editable: true,
          flex: 5,
          renderCell: (params) => {
            const error =
              selected_patient_pertinent_signs.includes(params.row.perkey) &&
              params.field === `peothersremarks` &&
              !params.value &&
              (params.row.pedesc?.toUpperCase() === `OTHERS` ||
                params.row.pedesc?.toUpperCase() === `PAIN`);

            return (
              <Box
                gridAutoFlow={`column`}
                gap={1}
                display={`grid`}
                alignItems={`center`}
                alignContent={`center`}
                justifyItems={`start`}
                justifyContent={`start`}
              >
                <div>
                  {error && (
                    <Tooltip title={`This field is required`}>
                      <HelpIcon
                        color="error"
                        fontSize="small"
                        style={{
                          marginTop: `5px`,
                        }}
                      />
                    </Tooltip>
                  )}
                </div>
                <div>{params.value}</div>
              </Box>
            );
          },
        },
      ];

    const [patient_physical_exam, set_patient_physical_exam] = useState<
      IPatientPhysicalExam[]
    >([]);

    const [selected_patient_physical_exam, set_selected_patient_physical_exam] =
      useState<GridRowId[]>([]);

    const patient_physical_exam_columns: GridColDef<IPatientPhysicalExam>[] = [
      {
        field: "pedesc",
        headerName: "Description",
        editable: false,
        flex: 2,
      },
      {
        field: "peothersremarks",
        headerName: "Other Remarks",
        minWidth: 400,
        editable: true,
        flex: 5,
        renderCell: (params) => {
          const error =
            selected_patient_physical_exam.includes(params.row.pekey) &&
            params.field === `peothersremarks` &&
            !params.value &&
            (params.row.pedesc?.toUpperCase() === `OTHERS` ||
              params.row.pedesc?.toUpperCase() === `PAIN`);

          return (
            <Box
              gridAutoFlow={`column`}
              gap={1}
              display={`grid`}
              alignItems={`center`}
              alignContent={`center`}
              justifyItems={`start`}
              justifyContent={`start`}
            >
              <div>
                {error && (
                  <Tooltip title={`This field is required`}>
                    <HelpIcon
                      color="error"
                      fontSize="small"
                      style={{
                        marginTop: `5px`,
                      }}
                    />
                  </Tooltip>
                )}
              </div>
              <div>{params.value}</div>
            </Box>
          );
        },
      },
    ];

    let form_instance = useForm<InpatientDto>({
      resolver: yupResolver(form_schema),
      // mode: "onBlur",
      mode: "onSubmit",
      defaultValues: {
        gensurvey: ``,
        chiefcomplaint: ``,
        pasthistory: ``,
        briefhistory: ``,
        admdiagnosis: ``,
        vital_signs: {
          bloodpresure: `/`,
          heartrate: ``,
          resrate: ``,
          temperature: ``,
          height: ``,
          weight: ``,
          bmi: ``,
        },
        ob: {
          isapplicable: false,
          gravidity: ``,
          parity: ``,
          fullterm: ``,
          premature: ``,
          abortion: ``,
          livingchildren: ``,
        },
        pertinent_signs: [],
        physical_exam: [],
      },
    });

    useEffect(() => {
      form_instance.reset({
        gensurvey: inpatient?.gensurvey,
        chiefcomplaint: inpatient?.chiefcomplaint,
        pasthistory: inpatient?.pasthistory,
        briefhistory: inpatient?.briefhistory,
        admdiagnosis: inpatient?.admdiagnosis,
        vital_signs: {
          bloodpresure: inpatient?.vital_signs?.bloodpresure ?? `/`,
          heartrate: inpatient?.vital_signs?.heartrate ?? ``,
          resrate: inpatient?.vital_signs?.resrate ?? ``,
          temperature: inpatient?.vital_signs?.temperature ?? ``,
          height: inpatient?.vital_signs?.height ?? ``,
          weight: inpatient?.vital_signs?.weight ?? ``,
          bmi: inpatient?.vital_signs?.bmi ?? ``,
        },
        ob: {
          isapplicable: inpatient?.ob?.isapplicable ?? false,
          lmp: !!inpatient?.ob?.lmp
            ? moment(inpatient?.ob?.lmp).format(`YYYY-MM-DD`)
            : ``,
          gravidity: inpatient?.ob?.gravidity ?? ``,
          parity: inpatient?.ob?.parity ?? ``,
          fullterm: inpatient?.ob?.fullterm ?? ``,
          premature: inpatient?.ob?.premature ?? ``,
          abortion: inpatient?.ob?.abortion ?? ``,
          livingchildren: inpatient?.ob?.livingchildren ?? ``,
        },
      });

      set_patient_pertinent_signs(inpatient?.pertinent_signs ?? []);
      set_patient_physical_exam(inpatient?.physical_exam ?? []);

      const temp_ps: number[] = [];
      (inpatient?.pertinent_signs ?? []).forEach((p, i) => {
        p.perkey = i;
        if (!!p?.pecodefound) temp_ps.push(p.perkey);
      });
      set_selected_patient_pertinent_signs(temp_ps);

      const temp_pe: number[] = [];
      (inpatient?.physical_exam ?? []).forEach((p, i) => {
        p.pekey = i;
        if (!!p?.pecodefound) temp_pe.push(p.pekey);
      });
      set_selected_patient_physical_exam(temp_pe);
    }, [form_instance, inpatient]);

    useEffect(() => {
      set_inpatient(inpatient_info);

      return () => {};
    }, [inpatient_info]);

    const handleSubmitForm = async (payload: InpatientDto) => {
      let error = ``;

      patient_pertinent_signs.forEach((p) => {
        if (selected_patient_pertinent_signs.includes(p.perkey)) {
          p.pecodefound = p.pecode;
        }

        if (
          selected_patient_pertinent_signs.includes(p.perkey) &&
          !p.peothersremarks &&
          (p.pedesc?.toUpperCase() === `OTHERS` ||
            p.pedesc?.toUpperCase() === `PAIN`)
        ) {
          error += `The Other Remarks of the selected Pertinent Signs ${p.pedesc} is required! <br/>`;
        }
      });

      patient_physical_exam.forEach((p) => {
        if (selected_patient_physical_exam.includes(p.pekey)) {
          p.pecodefound = p.pecode;
        }

        if (
          selected_patient_physical_exam.includes(p.pekey) &&
          !p.peothersremarks &&
          (p.pedesc?.toUpperCase() === `OTHERS` ||
            p.pedesc?.toUpperCase() === `PAIN`)
        ) {
          error += `The Other Remarks of the selected Physical Exam ${p.pedesc} is required! <br/>`;
        }
      });

      if (!!error) {
        dispatch({
          type: "SET_PAGE_SNACKBAR",
          page_snackbar: {
            message: error,
            options: {
              variant: "error",
            },
          },
        });
        return;
      }

      dispatch(
        PageActions.SetPageConfirmation({
          open: true,
          custom_title: `Are you sure that you want to save the claim form?`,
          continueCallback: async () => {
            payload.pertinent_signs = patient_pertinent_signs;
            payload.physical_exam = patient_physical_exam;

            if (inpatient_info?.patno === undefined) return;

            dispatch(PageActions.SetLoading(true));

            try {
              await InpatientApi.UpdateClaimForm(patno, payload);

              dispatch(
                InpatientActions.SetInpatient(patno, (is_loading) => {
                  dispatch(PageActions.SetLoading(is_loading));
                })
              );

              dispatch(
                PageActions.SetPrompt(
                  `The Claim Form has been saved successfully!`,
                  `success`
                )
              );
            } catch (error) {
              dispatch(PageActions.SetHttpErrorPrompt(error));
            }

            dispatch(PageActions.SetLoading(false));
          },
        })
      );
    };

    const vs_height = form_instance.watch("vital_signs.height");
    const vs_weight = form_instance.watch("vital_signs.weight");
    const ob_isapplicable = form_instance.watch("ob.isapplicable");

    useEffect(() => {
      const height = parseFloat(vs_height + ``);
      const weight = parseFloat(vs_weight + ``);
      if (height > 0 && weight > 0) {
        form_instance.setValue(`vital_signs.bmi`, calculateBmi(height, weight));
      } else {
        form_instance.setValue(`vital_signs.bmi`, ``);
      }

      return () => {};
    }, [form_instance, vs_height, vs_weight]);

    useEffect(() => {
      dispatch(
        InpatientActions.SetCourseWards(patno, (is_loading: boolean) => {
          set_is_loading_course_wards(is_loading);
        })
      );

      return () => {};
    }, [dispatch, patno]);

    useEffect(() => {
      dispatch(
        InpatientActions.SetMedications(patno, (is_loading: boolean) => {
          set_is_loading_medications(is_loading);
        })
      );

      return () => {};
    }, [dispatch, patno]);

    return (
      <>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormProvider {...form_instance}>
              <form
                onSubmit={form_instance.handleSubmit(handleSubmitForm)}
                onReset={() => {
                  dispatch(
                    PageActions.SetPageConfirmation({
                      open: true,
                      custom_subtitle: `If you proceed, all the changes made to the Claim Form will not be saved.`,
                      continueCallback: async () => {
                        dispatch(
                          InpatientActions.SetInpatient(
                            patno,
                            (is_loading: boolean) => {
                              dispatch(PageActions.SetLoading(is_loading));
                            },
                            () => {}
                          )
                        );
                      },
                    })
                  );
                }}
                noValidate
                id="form_instance_claim_form"
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography component={"div"} className="info-title">
                      Clinical Summary/Admission Details
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <RadioFieldHookForm
                      label="General Survey"
                      variant="outlined"
                      name="gensurvey"
                      options={[
                        {
                          id: `AWAKE`,
                          label: `Awake/Alert`,
                        },
                        {
                          id: `ALTERED`,
                          label: `Altered Sensorium`,
                        },
                      ]}
                      is_required={true}
                      is_row={true}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextFieldHookForm
                      name="chiefcomplaint"
                      minRows={3}
                      type="text"
                      multiline={true}
                      label="Chief Complaint"
                      fullWidth
                      required
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextFieldHookForm
                      name="admdiagnosis"
                      minRows={3}
                      type="text"
                      multiline={true}
                      label="Admission Diagnosis"
                      fullWidth
                      required
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextFieldHookForm
                      name="pasthistory"
                      minRows={3}
                      type="text"
                      multiline={true}
                      label="Pertinent/Past Medical History"
                      fullWidth
                      required
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextFieldHookForm
                      name="briefhistory"
                      minRows={3}
                      type="text"
                      multiline={true}
                      label="History of Patient Illness "
                      fullWidth
                      required
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  {/* <Grid item xs={12} md={6}> */}
                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item container xs={12}>
                        <Box
                          justifyItems={"start"}
                          justifyContent={"start"}
                          alignContent={`center`}
                          alignItems={`center`}
                          gap={3}
                          className="info-title"
                          gridAutoFlow={`column`}
                          display={`grid`}
                        >
                          <Typography
                            component={"div"}
                            style={{
                              paddingBottom: 5,
                            }}
                          >
                            OB-GYNE HISTORY
                          </Typography>

                          <CheckboxField
                            label="Is Applicable?"
                            name="ob.isapplicable"
                            variant="outlined"
                            onChange={async () => {
                              form_instance.trigger([
                                `ob.lmp`,
                                `ob.gravidity`,
                                `ob.parity`,
                                `ob.abortion`,
                                `ob.fullterm`,
                                `ob.premature`,
                                `ob.livingchildren`,
                              ]);
                            }}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                        <TextFieldHookForm
                          name="ob.lmp"
                          type="date"
                          label="Last Menstrual Period"
                          required={ob_isapplicable}
                          variant="outlined"
                          size="small"
                          fullWidth={true}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            readOnly: !ob_isapplicable,
                            disabled: !ob_isapplicable,
                          }}
                          disabled={!ob_isapplicable}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                        <TextFieldHookForm
                          name="ob.gravidity"
                          type="number"
                          label="Gravidity"
                          required={ob_isapplicable}
                          variant="outlined"
                          size="small"
                          fullWidth={true}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            readOnly: !ob_isapplicable,
                            disabled: !ob_isapplicable,
                          }}
                          disabled={!ob_isapplicable}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                        <TextFieldHookForm
                          name="ob.parity"
                          type="number"
                          label="Parity"
                          required={ob_isapplicable}
                          variant="outlined"
                          size="small"
                          fullWidth={true}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            readOnly: !ob_isapplicable,
                            disabled: !ob_isapplicable,
                          }}
                          disabled={!ob_isapplicable}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                        <TextFieldHookForm
                          name="ob.abortion"
                          type="number"
                          label="# of Abortion"
                          required={ob_isapplicable}
                          variant="outlined"
                          size="small"
                          fullWidth={true}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            readOnly: !ob_isapplicable,
                            disabled: !ob_isapplicable,
                          }}
                          disabled={!ob_isapplicable}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                        <TextFieldHookForm
                          name="ob.fullterm"
                          type="number"
                          label="No. of Full Term"
                          required={ob_isapplicable}
                          variant="outlined"
                          size="small"
                          fullWidth={true}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            readOnly: !ob_isapplicable,
                            disabled: !ob_isapplicable,
                          }}
                          disabled={!ob_isapplicable}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                        <TextFieldHookForm
                          name="ob.premature"
                          type="number"
                          label="No. of Premature"
                          required={ob_isapplicable}
                          variant="outlined"
                          size="small"
                          fullWidth={true}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            readOnly: !ob_isapplicable,
                            disabled: !ob_isapplicable,
                          }}
                          disabled={!ob_isapplicable}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                        <TextFieldHookForm
                          name="ob.livingchildren"
                          type="number"
                          label="No. of Living Children"
                          required={ob_isapplicable}
                          variant="outlined"
                          size="small"
                          fullWidth={true}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            readOnly: !ob_isapplicable,
                            disabled: !ob_isapplicable,
                          }}
                          disabled={!ob_isapplicable}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Box className="info-title">
                          <Typography component={"div"}>VITAL SIGNS</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                        <FractionField
                          name="vital_signs.bloodpresure"
                          label="Blood Pressure"
                          required={true}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                        <TextFieldHookForm
                          name="vital_signs.resrate"
                          type="number"
                          label="Respiratory Rate"
                          required={true}
                          variant="outlined"
                          size="small"
                          fullWidth={true}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                        <TextFieldHookForm
                          name="vital_signs.heartrate"
                          type="number"
                          label="Heart Rate (/min)"
                          required={true}
                          variant="outlined"
                          size="small"
                          fullWidth={true}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                        <TextFieldHookForm
                          name="vital_signs.temperature"
                          type="number"
                          label="Temperature"
                          required={true}
                          variant="outlined"
                          size="small"
                          fullWidth={true}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                        <TextFieldHookForm
                          name="vital_signs.height"
                          type="number"
                          label="Height (cm)"
                          required={true}
                          variant="outlined"
                          size="small"
                          fullWidth={true}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                        <TextFieldHookForm
                          name="vital_signs.weight"
                          type="number"
                          label="Weight (kg)"
                          required={true}
                          variant="outlined"
                          size="small"
                          fullWidth={true}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                        <TextFieldHookForm
                          name="vital_signs.bmi"
                          type="number"
                          label="BMI"
                          required={true}
                          variant="outlined"
                          size="small"
                          fullWidth={true}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            readOnly: true,
                            disabled: true,
                          }}
                          disabled={true}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography component={"div"} className="info-title">
                      PERTINENT SIGNS AND SYMPTOMS
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Box height={350} width={`100%`}>
                      <DataGrid
                        getRowId={(e) => e.perkey}
                        density="compact"
                        rows={patient_pertinent_signs}
                        columns={patient_pertinent_signs_columns}
                        onCellEditCommit={(params: any) => {
                          patient_pertinent_signs[params.id].peothersremarks =
                            params.value ?? ``;

                          set_patient_pertinent_signs([
                            ...patient_pertinent_signs,
                          ]);
                        }}
                        onCellEditStart={(e) => {
                          if (
                            selected_patient_pertinent_signs.includes(e.id) &&
                            e.field === `peothersremarks`
                          ) {
                            e.isEditable = true;
                          } else {
                            e.isEditable = false;
                          }
                        }}
                        // rowsPerPageOptions={[10]}
                        checkboxSelection
                        disableSelectionOnClick
                        selectionModel={selected_patient_pertinent_signs}
                        onSelectionModelChange={(selected) => {
                          set_selected_patient_pertinent_signs(selected);
                        }}
                        getCellClassName={(params) => {
                          if (
                            selected_patient_pertinent_signs.includes(
                              params.row.perkey
                            ) &&
                            params.field === `peothersremarks` &&
                            params.value?.trim() === `` &&
                            (params.row?.pedesc?.toUpperCase() === `OTHERS` ||
                              params.row?.pedesc?.toUpperCase() === `PAIN`)
                          ) {
                            return `border-red`;
                          } else {
                            return ``;
                          }
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box className="info-title">
                      <Typography component={"div"}>PHYSICAL EXAM</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box height={350} width={`100%`}>
                      <DataGrid
                        getRowId={(e) => e.pekey}
                        density="compact"
                        rows={patient_physical_exam}
                        columns={patient_physical_exam_columns}
                        onCellEditCommit={(params: any) => {
                          patient_physical_exam[params.id].peothersremarks =
                            params.value ?? ``;

                          set_patient_physical_exam([...patient_physical_exam]);
                        }}
                        onCellEditStart={(e) => {
                          if (
                            selected_patient_physical_exam.includes(e.id) &&
                            e.field === `peothersremarks`
                          ) {
                            e.isEditable = true;
                          } else {
                            e.isEditable = false;
                          }
                        }}
                        checkboxSelection
                        disableSelectionOnClick
                        selectionModel={selected_patient_physical_exam}
                        onSelectionModelChange={(selected) => {
                          set_selected_patient_physical_exam(selected);
                        }}
                        getCellClassName={(params) => {
                          if (
                            selected_patient_physical_exam.includes(
                              params.row.pekey
                            ) &&
                            params.field === `peothersremarks` &&
                            params.value?.trim() === `` &&
                            (params.row?.pedesc?.toUpperCase() === `OTHERS` ||
                              params.row?.pedesc?.toUpperCase() === `PAIN`)
                          ) {
                            return `border-red`;
                          } else {
                            return ``;
                          }
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Box
                          className="info-title"
                          display={`grid`}
                          gridAutoFlow={`column`}
                          alignItems={`center`}
                          alignContent={`center`}
                        >
                          <Typography component={"div"}>
                            COURSE IN THE WARD
                          </Typography>

                          <Box justifySelf={`end`}>
                            <LoadingButton
                              color="primary"
                              variant="contained"
                              size="small"
                              onClick={() => {
                                dispatch(
                                  InpatientActions.SetCourseWardDialog({
                                    is_open: true,
                                    title: `Add Course in the Ward Order/Action`,
                                    submitCallback: async (
                                      data: ICourseWardDto
                                    ) => {
                                      let success = false;
                                      dispatch(PageActions.SetLoading(true));

                                      try {
                                        await InpatientApi.AddCourseWard(
                                          patno,
                                          data
                                        );

                                        dispatch(
                                          PageActions.SetPrompt(
                                            `The Course in the Ward has been added successfully.`,
                                            `success`
                                          )
                                        );
                                        dispatch(
                                          InpatientActions.SetCourseWardDialog()
                                        );
                                        dispatch(
                                          InpatientActions.SetCourseWards(patno)
                                        );
                                      } catch (error: any) {
                                        dispatch(
                                          PageActions.SetHttpErrorPrompt(error)
                                        );
                                      }

                                      dispatch(PageActions.SetLoading(false));

                                      return success;
                                    },
                                  })
                                );
                              }}
                            >
                              Add Course in the Ward
                            </LoadingButton>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box height={350} width={`100%`}>
                          <DataGrid
                            getRowId={(e) => e.cwkey ?? -1}
                            density="compact"
                            rows={course_wards ?? []}
                            columns={course_ward_columns}
                            loading={is_loading_course_wards}
                            disableSelectionOnClick
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Box
                          className="info-title"
                          display={`grid`}
                          gridAutoFlow={`column`}
                          alignItems={`center`}
                          alignContent={`center`}
                        >
                          <Typography component={"div"}>MEDICATIONS</Typography>

                          <Box justifySelf={`end`}>
                            <LoadingButton
                              color="primary"
                              variant="contained"
                              size="small"
                              onClick={() => {
                                dispatch(
                                  InpatientActions.SetMedicationDialog({
                                    is_open: true,
                                    title: `Add Medication`,
                                    submitCallback: async (
                                      data: ICourseWardDto
                                    ) => {
                                      let success = false;
                                      dispatch(PageActions.SetLoading(true));

                                      try {
                                        await InpatientApi.AddMedication(
                                          patno,
                                          data
                                        );

                                        dispatch(
                                          PageActions.SetPrompt(
                                            `The patient medication has been added successfully!`,
                                            `success`
                                          )
                                        );

                                        dispatch(
                                          InpatientActions.SetMedicationDialog()
                                        );
                                        dispatch(
                                          InpatientActions.SetMedications(patno)
                                        );
                                      } catch (error: any) {
                                        dispatch(
                                          PageActions.SetHttpErrorPrompt(error)
                                        );
                                      }

                                      dispatch(PageActions.SetLoading(false));

                                      return success;
                                    },
                                  })
                                );
                              }}
                            >
                              Add Medication
                            </LoadingButton>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box height={350} width={`100%`}>
                          <DataGrid
                            getRowId={(e) => e.medcode ?? -1}
                            density="compact"
                            rows={medications ?? []}
                            columns={medication_columns}
                            loading={is_loading_medications}
                            disableSelectionOnClick
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          </Grid>
        </Grid>
      </>
    );
  }
);

export default InpatientManageTabClaimForm;
