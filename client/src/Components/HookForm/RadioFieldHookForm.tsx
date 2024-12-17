// import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { memo } from "react";
import {
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
  useFormContext,
} from "react-hook-form";

interface IOptions {
  id: string | number;
  label: string | number;
}

interface RadioFieldHookFormProps {
  options: IOptions[];
  label: string;
  name: string;
  variant?: "standard" | "outlined" | "filled";
  is_row?: boolean;
  is_required?: boolean;
}

const RadioFieldHookForm: React.FC<RadioFieldHookFormProps> = memo((props) => {
  const name: string = !!props?.name ? props.name : "";

  const formContext = useFormContext();

  let error = false;
  let error_message:
    | string
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined = "";

  if (
    formContext.formState.errors &&
    formContext.formState.errors?.hasOwnProperty(props?.name)
  ) {
    error = true;

    error_message = formContext.formState.errors[name]?.message;
  }

  return (
    // <Controller
    //   name="radioOption"
    //   control={formContext.control}
    //   defaultValue=""
    //   render={({ field }) => (
    //     <RadioGroup {...field}>
    //       <FormControlLabel
    //         value="option1"
    //         control={<Radio />}
    //         label="Option 1"
    //       />
    //       <FormControlLabel
    //         value="option2"
    //         control={<Radio />}
    //         label="Option 2"
    //       />
    //       <FormControlLabel
    //         value="option3"
    //         control={<Radio />}
    //         label="Option 3"
    //       />
    //     </RadioGroup>
    //   )}
    // />

    <FormControl
      error={error}
      variant={props.variant}
      component="fieldset"
      {...formContext.register(name)}
      required={props.is_required}
    >
      <FormLabel
        style={{
          transform: "translate(14px, -6px) scale(0.75)",
          transformOrigin: " top left",
        }}
      >
        {props.label}
      </FormLabel>
      <RadioGroup
        aria-label={name}
        style={
          props.is_row
            ? {
                display: "grid",
                gridAutoFlow: "column",
                alignItems: "center",
                alignContent: "center",
                marginTop: `-5px`,
              }
            : undefined
        }
      >
        {props.options?.map((option, index) => (
          <FormControlLabel
            key={index}
            label={option.label}
            value={option.id}
            control={
              <Controller
                name={name}
                control={formContext.control}
                render={({ field, fieldState, formState }) => {
                  const value = formContext.getValues(name);

                  let checked = false;

                  if (value === option.id) {
                    checked = true;
                  }

                  return (
                    <Radio
                      checked={checked}
                      size="small"
                      color="primary"
                      value={!!field.value ? field.value : ""}
                      onChange={(e) => {
                        field.onChange(e.target.checked ? option.id : false);
                        // formContext.trigger(name);
                      }}
                    />
                  );
                }}
              />
            }
          />
        ))}
      </RadioGroup>
      <FormHelperText>{error_message}</FormHelperText>
    </FormControl>
  );
});

export default RadioFieldHookForm;
