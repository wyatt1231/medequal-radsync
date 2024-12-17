import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import {
  IconButton,
  Paper,
  Popover,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { FC, memo, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
interface TableFilterProps {
  width?: number;
  toggle_popover?: number;
  Body: JSX.Element;
  Actions: JSX.Element;
}

const TableFilter: FC<TableFilterProps> = memo(
  ({ children, width, toggle_popover, Body, Actions }) => {
    const theme = useTheme();
    const btn_ref = useRef<HTMLButtonElement | null>(null);
    const screen_sm = useMediaQuery(theme.breakpoints.down("sm"));
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
      null
    );

    const handleOpen = useCallback(() => {
      setAnchorEl(btn_ref.current);
    }, []);

    const handleClose = useCallback(() => {
      setAnchorEl(null);
    }, []);

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    useEffect(() => {
      handleClose();
    }, [handleClose, toggle_popover]);

    return (
      <div>
        <Tooltip title="Filter the records of the table">
          <IconButton
            type="button"
            color="primary"
            aria-describedby={id}
            onClick={handleOpen}
            ref={btn_ref}
          >
            <FilterListRoundedIcon color="primary" />
          </IconButton>
        </Tooltip>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <PopperContent
            style={{
              minWidth: screen_sm ? `100%` : !!width ? width : 650,
              maxWidth: screen_sm ? `100%` : !!width ? width : 650,
            }}
          >
            <div className="popper-content">
              <Typography
                fontWeight="900"
                className="title-text-secondary filter-title"
              >
                Filter Table Results
              </Typography>
              <div className="content">{Body}</div>

              <div className="actions">{Actions}</div>
            </div>
          </PopperContent>
        </Popover>
      </div>
    );
  }
);

export default TableFilter;

const PopperContent = styled(Paper)`
  .popper-content {
    display: grid;
    grid-gap: 0.5em;
    grid-auto-rows: auto 1fr auto;
    .filter-title {
      padding: 1em 2em;
      font-weight: 600;
      padding-bottom: 0;
    }

    .content {
      /* margin-top: 1em; */
      padding: 1em 2em;
    }

    .actions {
      background-color: #fafafa;
      padding: 0.5em 2em;
      align-self: end;
    }
  }
`;
