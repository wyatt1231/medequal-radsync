import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import * as React from "react";
import SideoutComponentUi from "./SideoutComponentUi";
type SideoutComponentProps = {
  open: boolean;
  set_open: (open: boolean) => void;
  title?: string;
  Body?: ReactJSXElement;
  Action?: ReactJSXElement;
  width: string | number;
};

const SideoutComponent: React.FC<SideoutComponentProps> = (props) => {
  //   const [state, set_state] = React.useState(false);
  const theme = useTheme();

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }

    props.set_open(open);

    // set_state(open);
  };

  return (
    <div>
      <>
        <SideoutComponentUi anchor={`right`} open={props.open} onClose={toggleDrawer(false)}>
          <Box
            width={props.width}
            display={`grid`}
            gridAutoRows={`60px ${!!props.Action == null ? "60px" : "0"} 1fr`}
            alignItems={`center`}
            alignContent={`center`}
          >
            <Box padding={theme.spacing(1)} bgcolor={`#f5f5f5`} height={`60px`}>
              <Box
                height={`100%`}
                display={`grid`}
                gridAutoFlow={`column`}
                gridAutoColumns={`1fr auto`}
                alignItems={`center`}
                alignContent={`center`}
              >
                <Typography variant="subtitle1" fontWeight={500}>
                  {props.title}
                </Typography>
                <Box display={`grid`} gridAutoFlow={`column`} gap={theme.spacing(1)}>
                  <IconButton title="Close" onClick={toggleDrawer(false)} size={"small"}>
                    <CloseIcon fontSize="small" color="warning" />
                  </IconButton>
                </Box>
              </Box>

              <Box></Box>
            </Box>
            <Box
              padding={theme.spacing(1)}
              height={!!props.Action ? `60px` : `0`}
              maxHeight={!!props.Action ? `60px` : `0`}
              borderBottom={!!props.Action ? `2px solid rgba(0,0,0,0.1)` : `none`}
              display={`grid`}
              gridAutoFlow={`column`}
              gap={theme.spacing(1)}
              justifyContent={`end`}
              justifyItems={`end`}
              alignItems={`center`}
              alignContent={`center`}
            >
              {props.Action}
            </Box>
            <Box padding={theme.spacing(1)} height={`calc(100vh - ${!!props.Action ? "120px" : "60px"})`} overflow={`auto`}>
              {props.Body}
            </Box>
          </Box>
        </SideoutComponentUi>
      </>
    </div>
  );
};

export default SideoutComponent;
