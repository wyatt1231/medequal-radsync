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
import { ICourseWardDto } from "../../Interfaces/CourseWardInterface";
import DateUtils from "../../Utils/DateUtils";
interface CourseWardDialogProps {
  patno: string;
}

// cwkey
// cwdate
// cworder_action

const form_schema = yup.object<any>({
  cwkey: yup.number().nullable().label("Order/Action"),
  cworder_action: yup.string().nullable().required().label("Order/Action"),
  cwdate: yup.date().nullable().required().label("Order Date"),
});

const CourseWardDialog: FC<CourseWardDialogProps> = memo(({ patno }) => {
  // const [is_show, set_is_show] = useState(false);
  const dispatch = useDispatch();

  const { course_ward_dialog } = useSelector(
    (store: RootStore) => store.InpatientReducer
  );

  // const dispatch = useDispatch<Dispatch<PageReducerTypes>>();

  const [is_loading_add_course_ward, set_is_loading_add_course_ward] =
    useState(false);

  const form_instance = useForm<ICourseWardDto>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: {
      cwkey: undefined,
      cworder_action: ``,
      cwdate: ``,
    },
  });

  const handleSubmitForm = useCallback(
    async (data: ICourseWardDto) => {
      dispatch(
        PageActions.SetPageConfirmation({
          open: true,
          // custom_title: `Are you sure that you want to add this order/action?`,
          continueCallback: async () => {
            if (typeof course_ward_dialog?.submitCallback == `function`) {
              set_is_loading_add_course_ward(true);

              data = {
                ...data,
                cwdate: DateUtils.FormatServer(data.cwdate),
              };

              const success = await course_ward_dialog.submitCallback(data);
              set_is_loading_add_course_ward(false);

              if (success) {
                form_instance.reset();
              }
            }
          },
        })
      );
    },
    [course_ward_dialog, dispatch, form_instance]
  );

  useEffect(() => {
    if (course_ward_dialog?.is_open === true) {
      const data: ICourseWardDto = course_ward_dialog?.payload ?? {};

      form_instance.reset({
        cwkey: data?.cwkey,
        cwdate: moment(data?.cwdate).toString(),
        cworder_action: data?.cworder_action ?? ``,
      });
    }

    return () => {};
  }, [course_ward_dialog, form_instance]);

  return (
    <div>
      <CustomDialog
        title={course_ward_dialog?.title ?? ``}
        open={course_ward_dialog?.is_open ?? false}
        handleClose={() => {
          dispatch(InpatientActions.SetCourseWardDialog());
        }}
        minWidth={960}
        body={
          <FormProvider {...form_instance}>
            <form
              onSubmit={form_instance.handleSubmit(handleSubmitForm)}
              noValidate
              id="form_instance_course_ward"
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
                      name="cworder_action"
                      multiline={true}
                      minRows={12}
                      label="Order/Action"
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <DateFieldHookForm
                      name="cwdate"
                      label="Order Date"
                      fullWidth
                      // type="datetime-local"
                      type="date"
                      required
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
              loading={is_loading_add_course_ward}
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
              form="form_instance_course_ward"
              loading={is_loading_add_course_ward}
            >
              {is_loading_add_course_ward ? "Saving" : "Save"}
            </LoadingButton>
          </>
        }
      />
    </div>
  );
});

export default CourseWardDialog;
