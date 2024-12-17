import { ChangeEvent } from "react";

export interface ILinkTab {
  label: string;
  link: string;
  Component?: any;
}
export interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

export interface StyledTabProps {
  label: any;
}
