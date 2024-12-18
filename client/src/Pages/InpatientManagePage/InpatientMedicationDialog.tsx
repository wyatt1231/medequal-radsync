import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Grid } from "@mui/material";
import moment from "moment";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import CustomDialog from "../../Components/CustomDialog/CustomDialog";
import AutocompleteHookForm from "../../Components/HookForm/AutoCompleteHookForm";
import DateFieldHookForm from "../../Components/HookForm/DateFieldHookForm";
import InpatientActions from "../../Contexts/Actions/InpatientActions";
import PageActions from "../../Contexts/Actions/PageActions";
import LibraryApi from "../../Contexts/Apis/LibraryApi";
import { RootStore } from "../../Contexts/Store";
import { MedicineDto } from "../../Interfaces/IPatientMedicine";
import DateUtils from "../../Utils/DateUtils";

interface MedicationDialogProps {
  patno: string;
}

const form_schema = yup.object<any>({
  stockcode: yup.string().nullable().required().label("Medicine"),
  dosecode: yup.string().nullable().required().label("Frequency/Dosage"),
  datestarted: yup.date().nullable().required().label("Start At"),
  datestopped: yup.date().nullable().label("Stop At"),
});

const MedicationDialog: FC<MedicationDialogProps> = memo(({ patno }) => {
  const dispatch = useDispatch();

  const { medication_dialog } = useSelector((store: RootStore) => store.InpatientReducer);

  const [is_loading_add_medication, set_is_loading_add_medication] = useState(false);

  const { med_lib, freq_lib } = useSelector((store: RootStore) => store.LibraryReducer);

  const form_instance = useForm<MedicineDto>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: {
      stockcode: "",
      dosecode: "",
      datestarted: new Date(),
      datestopped: null,
    },
  });

  const handleSubmitForm = useCallback(
    async (data: MedicineDto) => {
      dispatch(
        PageActions.SetPageConfirmation({
          open: true,
          continueCallback: async () => {
            if (typeof medication_dialog?.submitCallback == `function`) {
              set_is_loading_add_medication(true);

              data = {
                ...data,
                datestarted: DateUtils.FormatServer(data.datestarted),
                datestopped: DateUtils.FormatServer(data.datestopped),
              };

              const success = await medication_dialog.submitCallback(data);
              set_is_loading_add_medication(false);

              if (success) {
                form_instance.reset();
              }
            }
          },
        })
      );
    },
    [medication_dialog, dispatch, form_instance]
  );

  useEffect(() => {
    let mounted = true;

    const fetch = async () => {
      dispatch(PageActions.SetLoading(true));

      const med = await LibraryApi.GetMedLibApi();
      const freq = await LibraryApi.GetFreqLibApi();

      dispatch({
        type: "set_med_lib",
        med_lib: med,
      });
      dispatch({
        type: "set_freq_lib",
        freq_lib: freq,
      });

      dispatch(PageActions.SetLoading(false));
    };

    mounted && medication_dialog?.is_open === true && fetch();

    return () => {
      mounted = false;
    };
  }, [dispatch, medication_dialog]);

  useEffect(() => {
    const data: MedicineDto = medication_dialog?.payload ?? {};

    form_instance.reset({
      stockcode: data.stockcode ?? ``,
      dosecode: data.dosecode ?? ``,
      datestarted: !!data.datestarted ? moment(data.datestarted).toString() : null,
      datestopped: !!data.datestopped ? moment(data.datestopped).toString() : null,
    });
    return () => {};
  }, [medication_dialog?.payload, form_instance]);

  return (
    <div>
      <CustomDialog
        title={medication_dialog?.title ?? ``}
        open={medication_dialog?.is_open ?? false}
        handleClose={() => {
          dispatch(InpatientActions.SetMedicationDialog());
        }}
        minWidth={600}
        body={
          <FormProvider {...form_instance}>
            <form onSubmit={form_instance.handleSubmit(handleSubmitForm)} noValidate id="form_instance_medication">
              <div
                style={{
                  display: `grid`,
                  padding: `1.5em`,
                  backgroundColor: `#fff`,
                  borderRadius: 10,
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <AutocompleteHookForm
                      label="Medicine"
                      name="stockcode"
                      options={med_lib}
                      // loading={loading_medicine_library}
                      defaultValue=""
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <AutocompleteHookForm
                      label="Frequency/Dosage"
                      name="dosecode"
                      options={freq_lib}
                      // loading={loading_frequency_library}
                      defaultValue=""
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <DateFieldHookForm
                      name="datestarted"
                      label="Start At"
                      fullWidth
                      type="datetime-local"
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DateFieldHookForm name="datestopped" label="Stop At" fullWidth type="datetime-local" InputLabelProps={{ shrink: true }} />
                  </Grid>
                </Grid>
              </div>
            </form>
          </FormProvider>
        }
        actions={
          <>
            <LoadingButton
              color="primary"
              loading={is_loading_add_medication}
              onClick={async () => {
                form_instance.reset();
              }}
            >
              Reset
            </LoadingButton>

            <LoadingButton variant="contained" color="primary" type="submit" form="form_instance_medication" loading={is_loading_add_medication}>
              Save
            </LoadingButton>
          </>
        }
      />
    </div>
  );
});

export default MedicationDialog;
