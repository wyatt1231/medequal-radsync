import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Grid } from "@mui/material";
import moment from "moment";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import CustomDialog from "../../Components/CustomDialog/CustomDialog";
import DateFieldHookForm from "../../Components/HookForm/DateFieldHookForm";
import TextFieldHookForm from "../../Components/HookForm/TextFieldHookForm";
import InpatientActions from "../../Contexts/Actions/InpatientActions";
import PageActions from "../../Contexts/Actions/PageActions";
import { RootStore } from "../../Contexts/Store";
import { InpatientDoctorOrderDto } from "../../Interfaces/InpatientDoctorOrderInterfaces";
import DateUtils from "../../Utils/DateUtils";
interface DoctorOrderDialogProps {
  patno: string;
}

const form_schema = yup.object<any>({
  orderkey: yup.number().nullable().label("Order Key"),
  progressnotes: yup.string().nullable().required().label("Progress Notes"),
  ap_order: yup.string().nullable().required().label("AP Order"),
  notedate: yup.date().nullable().required().label("Note Date"),
});

const DoctorOrderDialog: FC<DoctorOrderDialogProps> = memo(({ patno }) => {
  const dispatch = useDispatch();
  const { doctor_order_dialog } = useSelector(
    (store: RootStore) => store.InpatientReducer
  );

  const [is_loading_submit, set_is_loading_submit] = useState(false);

  const form_instance = useForm<InpatientDoctorOrderDto>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: {
      progressnotes: ``,
      ap_order: ``,
      notedate: new Date(),
    },
  });

  const handleSubmitForm = useCallback(
    async (data: InpatientDoctorOrderDto) => {
      dispatch(
        PageActions.SetPageConfirmation({
          open: true,
          continueCallback: async () => {
            if (typeof doctor_order_dialog?.submitCallback == `function`) {
              set_is_loading_submit(true);

              data = {
                ...data,
                notedate: DateUtils.FormatServer(data.notedate),
              };

              const success = await doctor_order_dialog.submitCallback(data);
              set_is_loading_submit(false);

              if (success) {
                form_instance.reset();
              }
            }
          },
        })
      );
    },
    [doctor_order_dialog, dispatch, form_instance]
  );

  useEffect(() => {
    const data: InpatientDoctorOrderDto = doctor_order_dialog?.payload ?? {};

    form_instance.reset({
      orderkey: data?.orderkey,
      ap_order: data?.ap_order ?? "",
      progressnotes: data?.progressnotes ?? "",
      notedate: moment(data?.notedate).toString(),
    });

    return () => {};
  }, [doctor_order_dialog?.payload, form_instance]);

  return (
    <CustomDialog
      title={doctor_order_dialog?.title ?? ``}
      open={doctor_order_dialog?.is_open ?? false}
      handleClose={() => {
        dispatch(InpatientActions.SetDoctorOrderDialog());
      }}
      minWidth={960}
      body={
        <FormProvider {...form_instance}>
          <form
            onSubmit={form_instance.handleSubmit(handleSubmitForm)}
            noValidate
            id="form_instance"
          >
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
                  <TextFieldHookForm
                    name="ap_order"
                    minRows={6}
                    type="text"
                    multiline={true}
                    label="AP Order"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextFieldHookForm
                    name="progressnotes"
                    multiline={true}
                    minRows={12}
                    label="Progress Notes"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <DateFieldHookForm
                    name="notedate"
                    label="Note Date"
                    fullWidth
                    type="datetime-local"
                    required
                    InputLabelProps={{ shrink: true }}
                  />
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
            loading={is_loading_submit}
            onClick={async () => {
              form_instance.reset();
            }}
          >
            Reset
          </LoadingButton>

          <LoadingButton
            variant="contained"
            color="primary"
            type="submit"
            form="form_instance"
            loading={is_loading_submit}
          >
            Save
          </LoadingButton>
        </>
      }
    />
  );
});

export default DoctorOrderDialog;
