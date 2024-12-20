import { yupResolver } from "@hookform/resolvers/yup";
import { Grid } from "@mui/material";
import { FC, memo, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import RtfHookForm from "../../Components/HookForm/RtfHookForm";
import TextFieldHookForm from "../../Components/HookForm/TextFieldHookForm";
import { FormType } from "../../Contexts/Types/FormTypes";
import { StudyTemplateDto } from "../../Interfaces/StudyInterfaces";
import StringUtil from "../../Utils/StringUtil";

interface StudyManageTemplateFormProps {
  form_type: FormType;
  study_template?: StudyTemplateDto;
  onSubmit: (form_type: FormType, study_template: StudyTemplateDto) => Promise<void>;
}

const form_schema = yup.object<any>({
  templatekey: yup.string().nullable().required().label("Title"),
  templatedeschtml: yup.string().nullable().required().label("Template"),
});

const StudyManageTemplateForm: FC<StudyManageTemplateFormProps> = memo((props) => {
  const dispatch = useDispatch();

  const form = useForm<StudyTemplateDto>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: {
      templateno: ``,
      templatekey: "",
      templatedeschtml: "",
    },
  });

  const handleSubmitForm = async (data: StudyTemplateDto) => {
    console.log(`data`, data);

    data = {
      ...data,
      templatedesc: StringUtil.HtmlToRtf(data.templatedeschtml),
    };

    await props.onSubmit(props.form_type, data);
  };

  useEffect(() => {
    if (props.form_type === `ADD`) {
      form.reset();
    } else if (props.form_type === `EDIT`) {
      form.reset({
        templatekey: props.study_template?.templatekey ?? ``,
        templatedeschtml: props.study_template?.templatedeschtml ?? ``,
        templateno: props.study_template?.templateno ?? ``,
      });
    }

    return () => {};
  }, [form, props.form_type, props.study_template]);

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitForm)} noValidate id="form_study_template">
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
                <TextFieldHookForm name="templatekey" label="Title" variant="outlined" fullWidth required InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12}>
                <RtfHookForm name="templatedeschtml" label="Template" required height="500px" font_size={props.study_template?.font_size ?? `11pt`} />
              </Grid>
            </Grid>
          </div>
        </form>
      </FormProvider>
    </>
  );
});

export default StudyManageTemplateForm;
