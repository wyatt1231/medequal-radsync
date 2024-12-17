import React from "react";

export type ConfigReducerTypes =
  | {
      type: "set_hospital_logo";
      hospital_logo: string;
    }
  | {
      type: "set_loading_hospital_logo";
      loading_hospital_logo: boolean;
    }
  //
  | {
      type: "set_hospital_name";
      hospital_name: string;
    }
  | {
      type: "set_loading_hospital_name";
      loading_hospital_name: boolean;
    };

export interface ConfigReducerModel {
  hospital_logo?: string;
  loading_hospital_logo: boolean;
  //
  hospital_name?: string;
  loading_hospital_name: boolean;
}

export interface DialogConfig {
  is_open: boolean;
  title: string;
  payload?: any;
  submitCallback?: (payload: any) => Promise<any>;
  Body?: React.ReactElement;
  Action?: React.ReactElement;
}
