import { ISortDto } from "./SortDto";

export interface ITblInitialSort {
  label: string;
  value: ISortDto;
}

export interface ITblColumn {
  label: string;
  width: number | string;
  align?: "inherit" | "left" | "center" | "right" | "justify";
  fixedWidth?: boolean;
}

export interface ITblColumn {
  label: string;
  width: number | string;
  align?: "inherit" | "left" | "center" | "right" | "justify";
  valign?: "top" | "middle" | "bottom" | "baseline" | undefined;
  fixedWidth?: boolean;
}
