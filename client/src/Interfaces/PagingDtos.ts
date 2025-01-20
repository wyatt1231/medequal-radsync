import { GridColType } from "@mui/x-data-grid";

export interface PagingDto {
  filter: FilterDto;
  sort: SortDto;
  page: number;
  size: number;
  total: number;
  days_ago: number;
  is_loading: boolean;
}

export interface FilterDto {
  columnField: string;
  operatorValue:
    | ``
    | `contains`
    | `equals`
    | `startsWith`
    | `endsWith`
    | `isEmpty`
    | `isNotEmpty`
    | `isAnyOf`
    //
    | `is`
    | `not`
    | `after`
    | `onOrAfter`
    | `before`
    | `onOrBefore`;
  value: string;
  type: GridColType;
}

export interface SortDto {
  field: string;
  sort: `asc` | `desc`;
}
