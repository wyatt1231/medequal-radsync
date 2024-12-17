import CachedRoundedIcon from "@mui/icons-material/CachedRounded";
import { IconButton, Tooltip } from "@mui/material";
import React, { FC, memo } from "react";

interface TableRefreshProps {
  handleRefresh: () => void;
}

const TableRefresh: FC<TableRefreshProps> = memo(({ handleRefresh }) => {
  return (
    <>
      <Tooltip title="Refresh the records of the table">
        <IconButton color="primary" onClick={handleRefresh}>
          <CachedRoundedIcon color="primary" />
        </IconButton>
      </Tooltip>
    </>
  );
});

export default TableRefresh;
