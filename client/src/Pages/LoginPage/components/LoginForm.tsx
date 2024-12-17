import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Alert, Avatar, Grid, Skeleton, Typography } from "@mui/material";
import { FC, memo, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";
import TextFieldHookForm from "../../../Components/HookForm/TextFieldHookForm";
import { APP_NAME } from "../../../Config/Config";
import AuthApi from "../../../Contexts/Apis/AuthApi";
import { RootStore } from "../../../Contexts/Store";
import { ILoginDto } from "../../../Interfaces/AuthInterfaces";
import { IResponseDto } from "../../../Interfaces/ResponseInterfaces";

interface LoginFormProps {}

const form_schema = yup.object({
  username: yup.string().required().nullable().label("Username"),
  password: yup.string().required().nullable().label("Password"),
});

const LoginForm: FC<LoginFormProps> = memo(() => {
  const [login_error, set_login_error] = useState("");
  const [login_loading, set_login_loading] = useState(false);

  const { hospital_logo, hospital_name, loading_hospital_logo, loading_hospital_name } = useSelector((store: RootStore) => store.ConfigReducer);

  const form_instance = useForm<ILoginDto>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const HandleSubmitForm = useCallback(
    async (data: ILoginDto) => {
      const fetch_api = await AuthApi.LoginApi(data);

      set_login_loading(true);
      const response_data: IResponseDto = fetch_api.data;
      set_login_loading(false);

      if (response_data.success) {
        localStorage.setItem(
          APP_NAME,
          JSON.stringify({
            access_token: response_data?.data?.access_token,
            refresh_token: response_data?.data?.refresh_token,
            rememberme: response_data?.data?.rememberme,
          })
        );
        window.location.href = "/study";
      } else {
        if (typeof response_data?.message === "string") {
          set_login_error(response_data.message);
        }

        form_instance.reset({});
      }
    },
    [form_instance]
  );

  return (
    <>
      <div className="brand-ctnr">
        {loading_hospital_logo ? (
          <Skeleton variant="circular" className="brand-logo" />
        ) : (
          <Avatar src={`data:image/png;base64,` + hospital_logo} className="brand-logo" />
        )}

        <Typography variant="subtitle1" className="brand-name">
          {loading_hospital_name ? <Skeleton variant="text" /> : hospital_name}
        </Typography>

        <Typography variant="h4" className="app-name">
          {APP_NAME}
        </Typography>
      </div>

      <div className="login-input-group-ctnr">
        <FormProvider {...form_instance}>
          <form onSubmit={form_instance.handleSubmit(HandleSubmitForm)} noValidate id="form_instance">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <div style={{ margin: `1em 0` }}>
                  <Typography variant="subtitle1" className="login-text">
                    Hello! Welcome back.
                  </Typography>
                  <Typography variant="caption">Enter your username and password to sign in to your account.</Typography>
                </div>
              </Grid>

              {!!login_error && (
                <Grid item xs={12}>
                  <Alert
                    severity="error"
                    color="error"
                    variant="standard"
                    onClose={() => {
                      set_login_error("");
                    }}
                  >
                    The username and/or password that you have entered is incorrect!
                  </Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextFieldHookForm
                  label="Username"
                  name="username"
                  fullWidth={true}
                  variant="filled"
                  placeholder="Username"
                  InputProps={{ disableUnderline: true }}
                  type="text"
                />
              </Grid>
              <Grid item xs={12}>
                <TextFieldHookForm
                  label="Password"
                  name="password"
                  fullWidth={true}
                  variant="filled"
                  placeholder="Username"
                  InputProps={{ disableUnderline: true }}
                  type="password"
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12}>
                    <div style={{ margin: `1em 0` }}>
                      {/* <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        type="submit"
                        form="form_instance"
                      >
                        Login Now
                      </Button> */}

                      <LoadingButton
                        loading={login_loading}
                        // startIcon={<SaveIcon />}
                        variant="contained"
                        fullWidth
                        color="primary"
                        size="large"
                        type="submit"
                        form="form_instance"
                      >
                        Login Now
                      </LoadingButton>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </div>

      <div className="form-footer">
        <Typography variant="caption">Developed and maintained by TUO IT Solutions</Typography>
      </div>
    </>
  );
});

export default LoginForm;
