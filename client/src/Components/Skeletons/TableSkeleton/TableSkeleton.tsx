import { TableRow, TableCell, Skeleton } from "@mui/material";
import React, { memo, FC } from "react";

interface TableSkeletonProps {
  numOfRows: number;
}

const TableSkeleton: FC<TableSkeletonProps> = memo(
  ({ children, numOfRows }) => {
    return (
      <>
        {[...Array(numOfRows)].map((r, i) => (
          <TableRow key={i}>{children}</TableRow>
        ))}
      </>
    );
  }
);

export default TableSkeleton;
