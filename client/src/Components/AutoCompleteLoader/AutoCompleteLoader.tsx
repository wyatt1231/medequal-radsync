import { TextField, CircularProgress } from "@mui/material";
import { Autocomplete } from "@mui/lab";
import React, { memo, FC } from "react";

interface IAutoCompleteLoader {
  label?: any;
  className?: any;
  multiline?: any;
  required?: any;
  placeholder?: any;
  size?: any;
  disabled?: any;
  InputLabelProps?: any;
  rows?: any;
  variant?: any;
}

const AutoCompleteLoader: FC<IAutoCompleteLoader> = memo(
  ({
    label,
    rows,
    InputLabelProps,
    multiline,
    required,
    placeholder,
    size,
    disabled,
    variant,
  }) => {
    return (
      <>
        <Autocomplete
          options={[]}
          disabled={disabled}
          loading={true}
          renderInput={params => {
            return (
              <TextField
                {...params}
                disabled={disabled}
                placeholder={placeholder}
                InputLabelProps={InputLabelProps}
                label={label}
                multiline={multiline}
                rows={rows}
                size={size}
                variant={!!variant ? variant : "standard"}
                required={required}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      <CircularProgress color="inherit" size={20} />
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            );
          }}
        />
      </>
    );
  }
);

export default AutoCompleteLoader;
