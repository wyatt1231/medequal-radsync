import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grow,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { memo, useEffect, useRef } from "react";
import styled from "styled-components";

interface ICustomDialog {
  open: boolean;
  title: string;
  handleClose?: () => void;
  body?: any;
  actions?: any;
  minWidth?: number | string;
  fullScreen?: boolean;
  scroll?: "body" | "paper";
}

const CustomDialog: React.FC<ICustomDialog> = memo(
  ({
    open,
    title,
    handleClose,
    body,
    actions,
    minWidth,
    fullScreen,
    scroll,
  }) => {
    const theme = useTheme();
    const descriptionElementRef = useRef<any>(null);
    const mobile = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

    useEffect(() => {
      let mounted = true;

      if (open && mounted) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
          descriptionElement.focus();
        }
      }

      return () => {
        mounted = false;
      };
    }, [open]);

    return (
      <Dialog
        open={open}
        scroll={!!scroll ? scroll : "paper"}
        //   disableBackdropClick={true}
        //   disableEscapeKeyDown={true}
        fullScreen={fullScreen}
        PaperProps={{
          style: {
            margin: 0,
            padding: 0,
            minWidth: mobile
              ? "95%"
              : typeof minWidth === "undefined"
              ? 750
              : minWidth,
            maxWidth: mobile
              ? "95%"
              : typeof minWidth === "undefined"
              ? 750
              : minWidth,
          },
        }}
        TransitionComponent={Grow}
      >
        <DialogTitleStyle theme={theme}>
          <Typography className="dialog-title">{title}</Typography>
          <div className="toolbar">
            {typeof handleClose === "function" && (
              <Tooltip title="">
                <IconButton size="small" onClick={handleClose}>
                  <CancelRoundedIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </DialogTitleStyle>

        <DialogContentStyle theme={theme}>{body}</DialogContentStyle>

        {!!actions && (
          <DialogActionsStyle className="form-footer">
            {actions}
          </DialogActionsStyle>
        )}
      </Dialog>
    );
  }
);

export default CustomDialog;

const DialogTitleStyle = styled(DialogTitle)`
  background-color: ${(p) => p.theme.palette.primary.dark} !important;

  display: grid;
  grid-auto-flow: column;
  align-items: center;
  align-content: center;
  font-weight: 500 !important;
  grid-gap: 1em;
  box-shadow: 0 4px 3px -2px rgba(0, 0, 0, 0.1) !important;
  margin-bottom: 3px;

  .dialog-title {
    color: ${(p) => p.theme.palette.primary.contrastText} !important;
    font-weight: 500 !important;
  }

  .toolbar {
    justify-self: end;
    display: grid;
    grid-auto-flow: column;
    grid-gap: 0.5em;
    color: ${(p) => p.theme.palette.primary.contrastText};
    align-items: center;
    align-content: center;

    .MuiSvgIcon-root {
      color: ${(p) => p.theme.palette.primary.contrastText};
    }
  }
`;

const DialogContentStyle = styled(DialogContent)``;
const DialogActionsStyle = styled(DialogActions)`
  padding: 1em 2.5em !important;
  background-color: #f5f5f5 !important;
`;
