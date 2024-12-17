import { Autocomplete } from "@mui/lab";
import { TextField, TextFieldProps } from "@mui/material";
import clsx from "clsx";
import { FC, memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import AutoCompleteLoader from "../AutoCompleteLoader/AutoCompleteLoader";
interface IAutocompleteHookForm {
  label?: string;
  name: string;
  className?: string;
  rows?: number;
  multiline?: boolean;
  required?: boolean;
  placeholder?: string;
  size?: "small" | "medium";
  optKeyIdType?: "string" | "number";
  disabled?: boolean;
  endpoint?: string;
  defaultValue?: string;
  options?: any;
  onChangeCallback?: (val: any) => void;
  //to be removed
  defaultInputValue?: any;
  loading?: boolean;
}

const AutocompleteHookForm: FC<TextFieldProps & IAutocompleteHookForm> = memo(
  ({
    label,
    rows,
    multiline,
    variant,
    required,
    placeholder,
    disabled,
    name,
    defaultValue,
    size,
    options,
    InputLabelProps,
    onChangeCallback,
    loading,
  }) => {
    const inputVariant: any = variant;
    const { control, formState } = useFormContext();

    let error = false;
    let error_message: any = "";

    if (formState.errors && formState.errors?.hasOwnProperty(name)) {
      error = true;
      error_message = formState.errors[name]?.message;
    }

    const getOpObj = (option: any) => {
      if (!option.id) option = options.find((op: any) => op.id === option);
      return option;
    };

    // const filterOptions = (options: any, { inputValue }) =>
    //   matchSorter(options, inputValue, {
    //     keys: [(item) => item?.label?.replace(/ /g, " ")],
    //   });

    // useEffect(() => {

    //   return () => {

    //   }
    // }, [watch_field])

    if (!options) {
      return (
        <Autocomplete
          options={[]}
          disabled={true}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                disabled={true}
                placeholder={placeholder}
                InputLabelProps={InputLabelProps}
                label={label}
                multiline={multiline}
                rows={rows}
                size={size}
                variant={!!inputVariant ? inputVariant : "standard"}
                required={required}
              />
            );
          }}
        />
      );
    }

    return (
      <AutocompleteFieldUi>
        <div
          className={clsx("loader", {
            hide: !loading,
          })}
        >
          <AutoCompleteLoader
            disabled={disabled}
            label={label}
            InputLabelProps={{
              shrink: true,
            }}
            required={required}
            variant={inputVariant}
          />
        </div>
        <div
          className={clsx("field", {
            hide: loading,
          })}
        >
          <Controller
            name={name}
            control={control}
            // onChange={([_, data]) => data}
            defaultValue={!!defaultValue ? defaultValue : ""}
            render={({ field, fieldState, formState }) => {
              return (
                <Autocomplete
                  options={options}
                  getOptionLabel={(option) => {
                    const opt = getOpObj(option);
                    return !!opt?.label ? opt?.label : "";
                  }}
                  // getOptionSelected={(option, value) => {
                  //   const opt = getOpObj(value);
                  //   if (!!opt?.id) {
                  //     return option.id == opt?.id;
                  //   } else {
                  //     return false;
                  //   }
                  // }}
                  value={!!field.value ? field.value : ""}
                  disabled={disabled}
                  onChange={(e, data) => {
                    const val = !!data?.id ? data.id : "";
                    if (typeof onChangeCallback === "function") {
                      onChangeCallback(!!val ? val : "");
                    }
                    if (!!val) {
                      return field.onChange(!!val ? val : "");
                    } else {
                      return field.onChange("");
                    }
                  }}
                  // {...props}
                  renderInput={(params) => {
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
                        variant={!!inputVariant ? inputVariant : "standard"}
                        error={error}
                        helperText={error_message}
                        required={required}
                        autoComplete="off"
                      />
                    );
                  }}
                />
              );
            }}
          />
        </div>
      </AutocompleteFieldUi>
    );
  }
);

export default AutocompleteHookForm;

const AutocompleteFieldUi = styled.div`
  display: grid;
  grid-template-areas: "f";

  .loader {
    max-width: 100%;
    grid-area: f;
  }
  .field {
    max-width: 100%;
    grid-area: f;
  }

  .hide {
    opacity: 0;
  }
`;
