import { DateTimePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { TextField, TextFieldProps } from "@mui/material";
import "date-fns";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

// interface DateFieldHookFormProps extends Partial<TextFieldProps> {
interface DateFieldHookFormProps {
  // name: string;
  // onChange?: any;
  // type: "date" | "datetime" | "time" | "year" | "month";
  // trigger_fields?: Array<string>;
  // initialFocusedDate?: string;
  name: string;
  disableFuture?: boolean;
  disablePast?: boolean;
  inputFormat?: string;
}

const DateFieldHookForm: React.FC<DateFieldHookFormProps & TextFieldProps> =
  React.memo((props) => {
    const { control } = useFormContext();

    return (
      <Controller
        control={control}
        name={props.name}
        defaultValue={props.defaultValue}
        render={({ field, fieldState, formState }) => {
          return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              {props.type === "date" && (
                <DesktopDatePicker
                  disableFuture={props.disableFuture}
                  disablePast={props.disablePast}
                  label={props.label}
                  inputFormat={
                    !!props.inputFormat ? props.inputFormat : "MM/dd/yyyy"
                  }
                  value={!!field.value ? field.value : null}
                  onChange={field.onChange}
                  disableCloseOnSelect={false}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      fullWidth={true}
                      size={props.size}
                      InputLabelProps={props.InputLabelProps}
                      error={!!fieldState.error?.message}
                      helperText={fieldState.error?.message}
                      variant={props.variant}
                      required={props.required}
                    />
                  )}
                />
              )}

              {props.type === "datetime-local" && (
                <DateTimePicker
                  disableFuture={props.disableFuture}
                  disablePast={props.disablePast}
                  label={props.label}
                  value={!!field.value ? field.value : null}
                  onChange={field.onChange}
                  disableCloseOnSelect={false}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      fullWidth={true}
                      size={props.size}
                      InputLabelProps={props.InputLabelProps}
                      error={!!fieldState.error?.message}
                      helperText={fieldState.error?.message}
                      variant={props.variant}
                      required={props.required}
                    />
                  )}
                />
              )}
            </LocalizationProvider>
          );
        }}
      />
    );
  });

export default DateFieldHookForm;
