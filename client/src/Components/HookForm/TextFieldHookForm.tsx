import { TextField, TextFieldProps } from "@mui/material";
import { FC, memo } from "react";
import { Controller, useFormContext } from "react-hook-form";

// const TextFieldHookForm: FC<TextFieldProps> = memo((props) => {
const TextFieldHookForm: FC<TextFieldProps> = memo((props) => {
  const name: string = !!props?.name ? props.name : "";

  const formContext = useFormContext();

  return (
    <Controller
      name={name}
      control={formContext.control}
      defaultValue={props.defaultValue}
      render={({ field, fieldState, formState }) => {
        // fieldState.error

        return (
          <TextField
            {...props}
            {...field}
            // value={
            //   !!field.value
            //     ? field.value
            //     : !!props?.defaultValue
            //     ? props.defaultValue
            //     : ""
            // }
            onChange={(e) => {
              formContext.setValue(name, e.target.value, {
                shouldDirty: true,
                shouldValidate: true,
                shouldTouch: true,
              });
            }}
            error={!!fieldState?.error?.message}
            helperText={fieldState?.error?.message}
            autoComplete="off"
          />
        );
      }}
    />
  );
});
// });

export default TextFieldHookForm;
