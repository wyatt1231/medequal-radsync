import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { IconButton } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import StackSideoutComponent from "./Components/StackSideoutComponent/StackSideoutComponent";
import Store from "./Contexts/Store";
import Routes from "./Routes/Routes";
import "./Styles/App.css";
import theme from "./Styles/MuiTheme";

function App() {
  const notistackRef = React.createRef<SnackbarProvider>();
  const onClickDismiss = (key: React.ReactText) => () => {
    if (notistackRef.current) {
      notistackRef.current.closeSnackbar(key);
    }
  };

  console.log(`notistackRef.current?`, notistackRef.current);

  return (
    <ReduxProvider store={Store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={5}
          ref={notistackRef}
          hideIconVariant
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          action={(event: React.ReactText) => (
            <IconButton style={{ backgroundColor: "rgba(255,255,255,.8)" }} size="small" onClick={onClickDismiss(event)}>
              <CloseRoundedIcon color="error" />
            </IconButton>
          )}
        >
          <Routes />
          <StackSideoutComponent></StackSideoutComponent>
        </SnackbarProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default App;
