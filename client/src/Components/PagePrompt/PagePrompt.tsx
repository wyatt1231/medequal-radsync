import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grow,
} from "@mui/material";
import { FC, memo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "styled-components";
import PageActions from "../../Contexts/Actions/PageActions";
import { RootStore } from "../../Contexts/Store";
import PagePromptUi from "./PagePromptUi";
interface IPagePrompt {}

const PagePrompt: FC<IPagePrompt> = memo(() => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const {
    open,
    custom_title,
    custom_subtitle,
    continueCallback: continue_callback,
    close_callback,
  } = useSelector((state: RootStore) => state.PageReducer.page_confirmation);

  const handleContinue = useCallback(() => {
    if (continue_callback) {
      dispatch(PageActions.ResetPageConfirmation());
      if (typeof continue_callback === "function") {
        continue_callback();
        dispatch(PageActions.ResetPageConfirmation());
      }
    }
  }, [continue_callback, dispatch]);
  const handleCancel = useCallback(() => {
    dispatch(PageActions.ResetPageConfirmation());
    if (close_callback) {
      if (typeof close_callback === "function") {
        close_callback();
      }
    }
  }, [close_callback, dispatch]);

  useEffect(() => {
    const doc: any = document;

    doc?.activeElement?.blur();
    const handleEsc = (event: any) => {
      if (event.keyCode === 13) {
        handleContinue();
      }
    };
    open && window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [handleContinue, open]);

  return (
    <PagePromptUi
      theme={theme}
      open={open}
      scroll="body"
      TransitionComponent={Grow}
      PaperProps={{
        style: {
          margin: 0,
          padding: 0,
          width: 400,
          overflowY: "visible",
        },
      }}
    >
      <DialogTitle>
        <div
          style={{
            display: "grid",
            justifyItems: "center",
            justifyContent: "center",
            marginTop: "-50px",
          }}
        >
          <Avatar
            style={{
              height: "3.5em",
              width: "3.5em",
              backgroundColor: "#ff9800",
            }}
          >
            <HelpRoundedIcon fontSize="large" />
          </Avatar>
        </div>
      </DialogTitle>

      <DialogContent className="dialog-content">
        <div className="prompt-title">
          {custom_title
            ? custom_title
            : "Are you sure that you want to continue?"}
        </div>
        <div className="prompt-sub">
          {custom_subtitle
            ? custom_subtitle
            : "If you proceed, you won't be able to revert this process."}
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleCancel}>
          No, Cancel
        </Button>

        <Button color="primary" variant="contained" onClick={handleContinue}>
          Yes, Continue
        </Button>
      </DialogActions>
    </PagePromptUi>
  );
});

export default PagePrompt;
