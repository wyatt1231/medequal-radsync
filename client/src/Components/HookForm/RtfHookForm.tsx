import { FormLabel, useTheme } from "@mui/material";
import { FC, memo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import RtfComponent from "../RtfComponent/RtfComponent";

export type RtfHookFormType = {
  name: string;
  label?: string;
  defaultValue?: string;
  height?: string;
  font_size?: string;
  //
  read_only?: boolean;
  required?: boolean;
};

const RtfHookForm: FC<RtfHookFormType> = memo((props) => {
  const theme = useTheme();
  const name: string = !!props?.name ? props.name : "";

  const formContext = useFormContext();
  const [font_size, set_font_size] = useState(props.font_size ?? `11pt`);

  return (
    <Controller
      name={name}
      control={formContext.control}
      defaultValue={props.defaultValue}
      render={({ field, fieldState, formState }) => {
        return (
          <RtfHookFormUi>
            <div className="form-label">
              <FormLabel>{props.label}</FormLabel>
            </div>
            <RtfComponent
              value={field.value}
              label={props.label}
              onChange={(body) => {
                field.onChange(body);
              }}
              read_only={props.read_only}
              height={props.height}
              font_size={font_size}
              set_font_size={set_font_size}
            ></RtfComponent>
          </RtfHookFormUi>
        );
      }}
    />
  );
});

const RtfHookFormUi = styled(`div`)`
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 3px;

  &:hover {
    border: 1px solid #1976d2;
  }

  .form-label {
    margin-top: -10px !important;
    display: grid;
    justify-items: start;
    justify-content: start;
    margin-left: 0.5em;

    label {
      z-index: 1;
      background-color: #fff;
      padding: 0 0.3em;
      font-size: 0.83em;
    }
  }

  .ql-toolbar {
    background-color: #fff !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3) !important;
    padding: 0 !important;
    padding-bottom: 7px !important;
  }
  .editor-container {
    border: none !important;
  }
`;

export default RtfHookForm;
