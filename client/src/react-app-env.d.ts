/// <reference types="react-scripts" />
import "@material-ui/core/styles/overrides";
import { MuiPickersOverrides } from "@material-ui/pickers/typings/overrides";
import "styled-components";

declare module "*.pdf";
declare module "match-sorter";

type CustomType = {
  MuiPickersStaticWrapper: {
    statisWrapperRoot: {
      maxWidth?: string;
      minWidth?: string;
    };
  };
  MuiPickersYearSelection: {
    container: any;
  };
  MuiPickersBasePicker: {
    pickerView: {
      maxWidth?: string;
      minWidth?: string;
    };
  };
};

type overridesNameToClassKey = {
  [P in keyof MuiPickersOverrides]: keyof MuiPickersOverrides[P];
};

declare module "@material-ui/core/styles/overrides" {
  export interface ComponentNameToClassKey
    extends overridesNameToClassKey,
      CustomType {}
}
