import { TextField, MenuItem, Typography, Tooltip } from "@mui/material";
import React, { memo, FC } from "react";
import { ITblInitialSort } from "../../Interfaces/TableInterfaces";
import TableSortUi from "./TableSortUi";

interface ITableSort {
  selectedSortIndex: string | number;
  handleChagenSelectedSortIndex: (e: any) => void;
  initialTableSort: Array<ITblInitialSort>;
}

const TableSort: FC<ITableSort> = memo(
  ({ selectedSortIndex, handleChagenSelectedSortIndex, initialTableSort }) => {
    return (
      <Tooltip
        title="Select an item to sort the records of the table"
        placement="top"
      >
        <TableSortUi>
          <Typography variant="caption" className="label">
            Sort
          </Typography>

          <TextField
            select
            fullWidth
            value={selectedSortIndex}
            variant="standard"
            style={{
              minWidth: 100,
            }}
            onChange={e => {
              handleChagenSelectedSortIndex(e.target.value);
            }}
          >
            {initialTableSort?.map((sort, index) => (
              <MenuItem key={index} value={index}>
                <span className="sort-item">{sort.label}</span>
              </MenuItem>
            ))}
          </TextField>
        </TableSortUi>
      </Tooltip>
    );
  }
);

export default TableSort;
