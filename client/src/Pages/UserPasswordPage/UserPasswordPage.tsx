import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Alert, Container, Divider, Grid, Typography } from "@mui/material";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import TextFieldHookForm from "../../Components/HookForm/TextFieldHookForm";
import PageActions from "../../Contexts/Actions/PageActions";
import UserApi from "../../Contexts/Apis/UserApi";
import { IPasswordDto } from "../../Interfaces/AuthInterfaces";
import { IResponseDto } from "../../Interfaces/ResponseInterfaces";
import YupUtil from "../../Utils/YupUtil";
interface UserPasswordPageProps {}

const form_schema = yup.object<any>({
  old_password: yup.string().required().nullable().label("Old Password"),
  new_password: YupUtil.ValidatePassword("New Password"),
  confirm_new_password: yup
    .string()
    .nullable()
    .required()
    .label("Confirm New Password")
    .test(
      "Validate password confimration",
      "The confirm password does not match",
      function (value) {
        const { new_password } = this.parent;
        return value === new_password;
      }
    ),
});

const UserPasswordPage: FC<UserPasswordPageProps> = memo(() => {
  const dispatch = useDispatch();

  const [change_pass_loading, set_change_pass_loading] = useState(false);
  const [change_pass_response, set_change_pass_response] =
    useState<IResponseDto | null>(null);

  const form_instance = useForm<IPasswordDto>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  const handleSubmitForm = useCallback(
    async (data: IPasswordDto) => {
      dispatch(
        PageActions.SetPageConfirmation({
          open: true,
          custom_title: `Are you sure that you want to update your password?`,
          continueCallback: async () => {
            const fetch_api = await UserApi.ChangePassword({
              old_password: data.old_password,
              new_password: data.new_password,
            });

            set_change_pass_loading(true);
            const response_data: IResponseDto = fetch_api.data;
            set_change_pass_loading(false);

            if (
              response_data.success &&
              typeof response_data?.message === "string"
            ) {
              set_change_pass_response({
                success: true,
                message: response_data.message,
              });

              form_instance.reset();
            } else {
              set_change_pass_response({
                success: false,
                message: response_data.message,
              });
            }
          },
        })
      );
    },
    [dispatch, form_instance]
  );

  useEffect(() => {
    dispatch(
      PageActions.SetPageLinks([
        {
          label: "Change Password",
          to: "/change-password",
        },
      ])
    );
  }, [dispatch]);

  return (
    <>
      <Container
        maxWidth={"xs"}
        style={{
          backgroundColor: `#fff`,
          borderRadius: 10,
          padding: `1em 2em`,
        }}
      >
        <FormProvider {...form_instance}>
          <form
            onSubmit={form_instance.handleSubmit(handleSubmitForm)}
            noValidate
            id="form_instance"
          >
            <Grid container spacing={3}>
              <Grid item>
                <Typography variant="subtitle1">
                  Password Changing Form
                </Typography>
                <Typography variant="caption">
                  Fill up all the required (*) fields
                </Typography>
              </Grid>

              {change_pass_response !== null && (
                <>
                  {change_pass_response?.success === true ? (
                    <Grid item xs={12}>
                      <Alert
                        severity="success"
                        color="success"
                        variant="standard"
                        onClose={() => {
                          set_change_pass_response(null);
                        }}
                      >
                        {change_pass_response?.message}
                      </Alert>
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <Alert
                        severity="error"
                        color="error"
                        variant="standard"
                        onClose={() => {
                          set_change_pass_response(null);
                        }}
                      >
                        {change_pass_response?.message}
                      </Alert>
                    </Grid>
                  )}
                </>
              )}

              <Grid item xs={12}>
                <TextFieldHookForm
                  name="old_password"
                  label="Old Password"
                  fullWidth
                  InputProps={{ disableUnderline: true }}
                  required
                  type="password"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <TextFieldHookForm
                  name="new_password"
                  label="New Password"
                  InputProps={{ disableUnderline: true }}
                  fullWidth
                  required
                  type="password"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextFieldHookForm
                  name="confirm_new_password"
                  label="Confirm New Password"
                  InputProps={{ disableUnderline: true }}
                  fullWidth
                  required
                  type="password"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <LoadingButton
                      loading={change_pass_loading}
                      variant="contained"
                      fullWidth
                      color="primary"
                      type="submit"
                      form="form_instance"
                      // disabled={!form_instance.formState.isValid}
                    >
                      Save Password Changes
                    </LoadingButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Container>
    </>
  );
});

export default UserPasswordPage;
