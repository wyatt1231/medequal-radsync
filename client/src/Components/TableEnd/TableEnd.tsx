import { TableRow, TableCell, Typography } from "@mui/material";
import React, { memo, FC } from "react";

interface TableEndProps {
  count: number;
  col_len: number;
}

const TableEnd: FC<TableEndProps> = memo(({ count, col_len }) => {
  return count !== -1 ? (
    <>
      <TableRow>
        <TableCell colSpan={col_len} align="center" valign="middle">
          <Typography variant="caption" fontStyle="italic" color="error">
            Nothing else follows!
          </Typography>
        </TableCell>
      </TableRow>
    </>
  ) : null;
});

export default TableEnd;
