import { useTheme } from "@mui/material";
import clsx from "clsx";

import { FC, memo } from "react";
import { useFormContext } from "react-hook-form";
import MaskedInput from "react-text-mask";
import styled from "styled-components";
import * as yup from "yup";

interface FractionFieldInterface {
  label?: string;
  error?: boolean;
  helperText?: string;
  name: string;
  required?: boolean;
}

/*

*/

// yup.addMethod(yup.string, 'fraction', function (word, message) {
//     return this.test('contains-word', message, function (value) {
//       const { path, createError } = this;
//       if (value && !value.includes(word)) {
//         return createError({ path, message });
//       }
//       return true;
//     });
//   });

export const FractionSchema = (label: string) => {
  return yup
    .string()
    .nullable()
    .test(`is_invalid`, `${label} invalid format`, (value) => {
      if (!value?.includes("/")) {
        return false;
      } else {
        return true;
      }
    })
    .test(`is_required`, `${label}  required`, (value) => {
      return value !== `/` || value?.includes("/");
    })
    .test(`first_required`, `${label} first field is required`, (value) => {
      const arr = value?.split(`/`);

      if (!!arr) {
        if (arr?.length >= 1) {
          return arr[0].length > 0;
        }
      }
      return false;
    })
    .test(`second_required`, `${label} second field is required`, (value) => {
      const arr = value?.split(`/`);

      if (!!arr) {
        if (arr?.length >= 2) {
          return arr[1].length > 0;
        }
      }
      return false;
    });
};

export const FractionField: FC<FractionFieldInterface> = memo((props) => {
  const theme = useTheme();
  const name: string = !!props?.name ? props.name : "";
  const formContext = useFormContext();

  const value: string = formContext.getValues(name);

  const from_value = value.split(`/`)[0];
  const to_value = value.split(`/`)[1];

  const fieldState = formContext.getFieldState(name);

  return (
    <StyledFractionField theme={theme}>
      <div
        style={{
          borderColor: !!fieldState.error?.message ? `red` : "",
        }}
        className={clsx("field-group", {
          error: !!fieldState.error?.message,
        })}
      >
        <label>
          {props.label}

          {props.required && <span> *</span>}
        </label>
        <div className="input-group">
          <MaskedInput
            mask={[/\d/, /\d/, /\d/]}
            style={{ textAlign: "right" }}
            className="input1"
            showMask={false}
            guide={false}
            defaultValue={from_value}
            onChange={(e) => {
              formContext.setValue(name, `${e.target.value}/${to_value}`, {
                shouldValidate: true,
              });
            }}
          />
          <span className="separator">/</span>
          <MaskedInput
            mask={[/\d/, /\d/, /\d/]}
            className="input1"
            showMask={false}
            guide={false}
            defaultValue={to_value}
            onChange={(e) => {
              formContext.setValue(name, `${from_value}/${e.target.value}`, {
                shouldValidate: true,
              });
            }}
          />
        </div>
      </div>
      {!!fieldState.error?.message && (
        <small
          style={{
            color: !!fieldState.error?.message ? `#d32f2f` : "inherit",
          }}
          className="helper-text"
        >
          {fieldState.error?.message}
        </small>
      )}
    </StyledFractionField>
  );
});

export default FractionField;

export const StyledFractionField = styled.div`
  .field-group {
    border: 0.03em solid rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    display: grid;
    align-items: center;

    /* height: 55px; */
    height: 40px;
    grid-auto-rows: 15px 1fr;
    &:hover {
      border: 2px solid ${(props) => props.theme.palette.primary.main};
    }
    label {
      margin-top: -5px;
      /* margin-left: -10px; */
      font-weight: 400;
      padding: 0 0.5em;
      color: rgba(0, 0, 0, 0.65);
      z-index: 1;
      background-color: #fff;
      justify-self: start;
      transform: translate(-6px, -6px) scale(0.75);

      max-width: calc(133% - 24px);
      font-size: 1rem;
      white-space: nowrap;

      color: rgba(0, 0, 0, 0.6);
    }

    &.error {
      border-color: #d32f2f;
      label {
        border-color: #d32f2f;
      }
    }

    .input-group {
      margin-top: -13px;
      display: grid;
      /* margin-bottom: 25px !important; */
      margin-left: 10px;
      margin-right: 10px;
      grid-gap: 2px;
      grid-auto-flow: column;

      input {
        width: auto;
        border: none;
        height: 100%;
        font-size: 1em;
        width: 100%;

        :focus {
          outline: none !important;
        }
      }

      .separator {
        background-color: #e0dede;
        border-radius: 3px;
        padding: 0 0.3em;
        font-size: 1.1em;
        font-weight: 600;
      }
    }
  }

  .helper-text {
    margin-left: 1em;
    font-size: 0.75em;
    font-weight: 500;
    transform: translate(-6px, -6px) scale(0.75);
  }
`;
