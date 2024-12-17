import { yupResolver } from "@hookform/resolvers/yup";
import { Grid } from "@mui/material";
import { FC, memo, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import CustomDialog from "../../Components/CustomDialog/CustomDialog";
import TextFieldHookForm from "../../Components/HookForm/TextFieldHookForm";
import InpatientActions from "../../Contexts/Actions/InpatientActions";
import { RootStore } from "../../Contexts/Store";
import { MedicineFormulatoryDto } from "../../Interfaces/IPatientMedicine";
interface InpatientMedicationFormulatoryDialogProps {}

const form_schema = yup.object({
  stockcode: yup.string().nullable().label("Stock Code"),
  stockdesc: yup.string().nullable().label("Stock Description"),
  indication: yup.string().nullable().label("Indication"),
  dosemed: yup.string().nullable().label("Dose"),
  contraindi: yup.string().nullable().label("Contract Indication"),
  doseadj: yup.string().nullable().label("Dose Adjustment"),
  precaution: yup.string().nullable().label("Precautions"),
  reaction: yup.string().nullable().label("Adverse Drug Reaction"),
  interaction: yup.string().nullable().label("Interaction"),
  adminmed: yup.string().nullable().label("Adminmed"),
  mechaction: yup.string().nullable().label("Mechaction"),
  prenancycat: yup.string().nullable().label("Prenancycat"),
  stability: yup.string().nullable().label("Stability"),
});

const InpatientMedicationFormulatoryDialog: FC<InpatientMedicationFormulatoryDialogProps> =
  memo(() => {
    const dispatch = useDispatch();
    const { medicine_formulatory_dialog } = useSelector(
      (store: RootStore) => store.InpatientReducer
    );

    const form_instance = useForm<MedicineFormulatoryDto>({
      resolver: yupResolver(form_schema),
      mode: "onChange",
      defaultValues: {
        stockcode: ``,
        stockdesc: ``,
        indication: ``,
        dosemed: ``,
        contraindi: ``,
        doseadj: ``,
        precaution: ``,
        reaction: ``,
        interaction: ``,
        adminmed: ``,
        mechaction: ``,
        prenancycat: ``,
        stability: ``,
      },
    });

    useEffect(() => {
      const data: MedicineFormulatoryDto =
        medicine_formulatory_dialog?.payload ?? {};

      form_instance.reset({
        stockcode: data.stockcode,
        stockdesc: data.stockdesc,
        indication: data.indication,
        dosemed: data.dosemed,
        contraindi: data.contraindi,
        doseadj: data.doseadj,
        precaution: data.precaution,
        reaction: data.reaction,
        interaction: data.interaction,
        adminmed: data.adminmed,
        mechaction: data.mechaction,
        prenancycat: data.prenancycat,
        stability: data.stability,
      });

      return () => {};
    }, [medicine_formulatory_dialog?.payload, form_instance]);

    console.log(
      `medicine_formulatory_dialog --- `,
      medicine_formulatory_dialog
    );

    return (
      <CustomDialog
        title={`Medicine Formulatory Content (${medicine_formulatory_dialog?.payload?.stockdesc})`}
        open={medicine_formulatory_dialog?.is_open ?? false}
        handleClose={() => {
          dispatch(InpatientActions.SetMedicationFormulatoryDialog());
        }}
        minWidth={`90%`}
        body={
          <FormProvider {...form_instance}>
            <form noValidate id="form_instance">
              <div
                style={{
                  display: `grid`,
                  padding: `1.5em`,
                  backgroundColor: `#fff`,
                  borderRadius: 10,
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextFieldHookForm
                      name="indication"
                      minRows={6}
                      maxRows={6}
                      type="text"
                      multiline={true}
                      label="Indication"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextFieldHookForm
                      name="dosemed"
                      minRows={6}
                      maxRows={6}
                      type="text"
                      multiline={true}
                      label="Dose"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextFieldHookForm
                      name="contraindi"
                      minRows={6}
                      maxRows={6}
                      type="text"
                      multiline={true}
                      label="Contra Indication"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextFieldHookForm
                      name="doseadj"
                      minRows={6}
                      maxRows={6}
                      type="text"
                      multiline={true}
                      label="Dose Adjustment"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextFieldHookForm
                      name="precaution"
                      minRows={6}
                      maxRows={6}
                      type="text"
                      multiline={true}
                      label="Precuations"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextFieldHookForm
                      name="reaction"
                      minRows={6}
                      maxRows={6}
                      type="reaction"
                      multiline={true}
                      label="Adverse Drug Reaction"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextFieldHookForm
                      name="interaction"
                      minRows={6}
                      maxRows={6}
                      type="text"
                      multiline={true}
                      label="Interaction"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextFieldHookForm
                      name="adminmed"
                      minRows={6}
                      maxRows={6}
                      type="text"
                      multiline={true}
                      label="Adminmed"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextFieldHookForm
                      name="mechaction"
                      minRows={6}
                      maxRows={6}
                      type="text"
                      multiline={true}
                      label="Mechaction"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextFieldHookForm
                      name="prenancycat"
                      minRows={6}
                      maxRows={6}
                      type="text"
                      multiline={true}
                      label="Prenancycat"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextFieldHookForm
                      name="stability"
                      minRows={6}
                      maxRows={6}
                      type="text"
                      multiline={true}
                      label="Stability"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              </div>
            </form>
          </FormProvider>
        }
      />
    );
  });

export default InpatientMedicationFormulatoryDialog;
