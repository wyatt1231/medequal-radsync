import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { Box, IconButton, Slide, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import PageActions from "../../Contexts/Actions/PageActions";
import { RootStore } from "../../Contexts/Store";
import StackSideoutComponentUi from "./StackSideoutComponentUi";

import { TransitionProps } from "@mui/material/transitions";
import React from "react";
type StackSideoutComponentProps = {};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const StackSideoutComponent: React.FC<StackSideoutComponentProps> = (props) => {
  //   const [state, set_state] = React.useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();

  const { page_sideouts } = useSelector((store: RootStore) => store.PageReducer);

  const toggleDrawer = (open) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }
    // console.log(`pop`);
    dispatch(PageActions.PopPageSideout());
    // set_state(open);
  };

  // console.log(`page_sideouts`, page_sideouts.length);

  return (
    <>
      {page_sideouts.map((sideout, index) => {
        return (
          <StackSideoutComponentUi
            key={index}
            open={true}
            onClose={toggleDrawer(false)}
            anchor={`right`}
            variant="temporary"
            SlideProps={{
              appear: true,
              exit: true,
              enter: true,
              mountOnEnter: true,
              unmountOnExit: true,
              in: true,
              timeout: 500,
            }}
          >
            <Box
              width={`calc(${sideout.width} - ${index * 30}px)`}
              display={`grid`}
              gridAutoRows={`60px ${!!sideout.ActionComponent ? "60px" : "0"} 1fr`}
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
                    {sideout.title}
                  </Typography>
                  <Box display={`grid`} gridAutoFlow={`column`} gap={theme.spacing(1)}>
                    <IconButton title="Close" color="error" onClick={toggleDrawer(false)}>
                      <DisabledByDefaultIcon fontSize="small" color="error" />
                    </IconButton>

                    {/* <Button variant="contained" color="error">
                        Close
                      </Button> */}
                  </Box>
                </Box>

                <Box></Box>
              </Box>
              <Box
                padding={theme.spacing(1)}
                height={!!sideout.ActionComponent ? `60px` : `0`}
                maxHeight={!!sideout.ActionComponent ? `60px` : `0`}
                borderBottom={!!sideout.ActionComponent ? `2px solid rgba(0,0,0,0.1)` : `none`}
                display={`grid`}
                gridAutoFlow={`column`}
                gap={theme.spacing(1)}
                justifyContent={`end`}
                justifyItems={`end`}
                alignItems={`center`}
                alignContent={`center`}
              >
                {sideout.ActionComponent}
              </Box>
              <Box padding={theme.spacing(1)} height={`calc(100vh - ${!!sideout.ActionComponent ? "120px" : "60px"})`} overflow={`auto`}>
                {sideout.BodyComponent}
              </Box>
            </Box>
          </StackSideoutComponentUi>
        );
      })}
      {/* </TransitionGroup> */}
    </>
  );
};

export default StackSideoutComponent;
