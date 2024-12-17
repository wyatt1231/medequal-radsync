import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { FC, memo } from "react";
import { Controller, useFormContext } from "react-hook-form";

export interface CheckItemsProps {
  label: string;
  id: string | number;
  disabled?: boolean;
  defaultCheck?: boolean;
}

interface CheckboxFieldProps {
  name: string;
  label: string;
  variant?: "standard" | "outlined" | "filled";
  is_required?: boolean;
  onChange: () => void;
}

const CheckboxField: FC<CheckboxFieldProps> = memo((props) => {
  const name: string = !!props?.name ? props.name : "";

  const formContext = useFormContext();

  return (
    <Controller
      name={name}
      control={formContext.control}
      render={({ field, fieldState, formState }) => {
        let is_checked = field.value ?? false;

        return (
          <FormControl
            error={!!fieldState.error?.message}
            variant={props.variant}
            required={props.is_required}
          >
            <FormControlLabel
              key={name}
              label={props.label}
              control={
                <Checkbox
                  checked={is_checked}
                  size="small"
                  onChange={(e) => {
                    const value = !is_checked;
                    formContext.setValue(name, value, { shouldValidate: true });

                    props.onChange();
                  }}
                />
              }
            />

            <FormHelperText>{fieldState.error?.message}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
});

export default CheckboxField;
