// import { Backdrop, CircularProgress, Typography, useTheme } from "@mui/core";
import { Box, CircularProgress, Typography } from "@mui/material";
import { FC, memo } from "react";
interface ILoader {}

export const Loader: FC<ILoader> = memo(() => {
  return (
    <Box
      sx={{
        display: "grid",
        justifyContent: "center",
        justifyItems: `center`,
        alignItems: "center",
        padding: `5em`,
        gridGap: `1em`,
      }}
    >
      <Typography variant="subtitle1">Loading, thank you for your patience...</Typography>
      <CircularProgress />
    </Box>
  );
});

export default Loader;
