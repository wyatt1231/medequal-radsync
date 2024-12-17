// import { Backdrop, CircularProgress, Typography, useTheme } from "@mui/core";
import {
  Backdrop,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { FC, memo } from "react";
import { useSelector } from "react-redux";
import { RootStore } from "../Contexts/Store";
interface IPageLoader {}

export const PageLoader: FC<IPageLoader> = memo(() => {
  const theme = useTheme();

  const { show, message } = useSelector(
    (state: RootStore) => state.PageReducer.page_loading
  );

  return (
    <Backdrop
      style={{
        zIndex: theme.zIndex.modal + 200,
        color: "#fff",
        display: "grid",
        gridAutoFlow: "column",
        gridGap: "1em",
      }}
      open={show}
    >
      <CircularProgress color="inherit" />
      <Typography variant="subtitle1">
        {message ?? `Loading, please wait...`}
      </Typography>
    </Backdrop>
  );
});

export default PageLoader;
