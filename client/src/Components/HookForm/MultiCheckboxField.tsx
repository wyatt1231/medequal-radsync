import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
} from "@mui/material";
import { FC, memo } from "react";
import {
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
  useFormContext,
} from "react-hook-form";

export interface CheckItemsProps {
  label: string;
  id: string | number;
  disabled?: boolean;
  defaultCheck?: boolean;
}

interface MultiCheckboxFieldProps {
  name: string;
  label: string;
  variant?: "standard" | "outlined" | "filled";
  options: CheckItemsProps[];
  is_row?: boolean;
  is_required?: boolean;
}

const MultiCheckboxField: FC<MultiCheckboxFieldProps> = memo((props) => {
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
    <FormControl
      error={error}
      variant={props.variant}
      component="fieldset"
      {...formContext.register(name)}
      required={props.is_required}
    >
      <FormLabel
        component="legend"
        style={{
          transform: `translate(-10px, -6px) scale(0.75)`,
        }}
      >
        {props.label}
      </FormLabel>
      <FormGroup row={props.is_row}>
        {props.options.map((field, index) => {
          return (
            <FormControlLabel
              key={props.name + `.${index}`}
              label={field.label}
              control={
                <Controller
                  name={props.name + `.${index}`}
                  control={formContext.control}
                  render={(props) => {
                    const checkbox_values = formContext.getValues(name);

                    let checked = false;

                    if (!!checkbox_values) {
                      const find_field = checkbox_values.find(
                        (f: any) => f === field.id
                      );

                      if (!!find_field) {
                        checked = true;
                      }
                    }

                    return (
                      <Checkbox
                        {...props}
                        checked={checked}
                        size="small"
                        value={field?.id}
                        onChange={(e) => {
                          if (!!checkbox_values) {
                            if (checkbox_values instanceof Array) {
                              const found_def = checkbox_values.findIndex(
                                (cv) => cv === field.id
                              );

                              formContext.setValue(name + `.${found_def}`, "", {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                            }
                          }

                          formContext.trigger(name);
                        }}
                      />
                    );
                  }}
                />
              }
            />
          );
        })}
      </FormGroup>
      <FormHelperText>{error_message}</FormHelperText>
    </FormControl>
  );
});

export default MultiCheckboxField;
