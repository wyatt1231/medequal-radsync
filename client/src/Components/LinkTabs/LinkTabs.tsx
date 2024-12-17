import { styled, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import { FC, memo, useEffect, useState } from "react";
import { Route, Switch as RouterSwitch, useHistory } from "react-router";
import { ILinkTab, StyledTabProps } from "./LinkTabsInterface";
import LinkTabsUi from "./LinkTabsUi";

export interface ILinkTabs {
  tabs: Array<ILinkTab>;
  minHeight?: number;
  maxHeight?: number;
  handleSetActiveTab?: (tab: number) => void;
}

const LinkTabs: FC<ILinkTabs> = memo(
  ({ tabs, minHeight, maxHeight, handleSetActiveTab }) => {
    const history = useHistory();
    const theme = useTheme();
    const desktop = useMediaQuery(theme.breakpoints.up("md"));
    // const [click_counter, set_click_counter] = useState(0);
    const [active_tab, set_active_tab] = useState<number>(0);
    const [change_counter, set_change_counter] = useState<number>(
      tabs.findIndex((p) =>
        window.location.pathname.toLowerCase().includes(p.link.toLowerCase())
      )
    );

    useEffect(() => {
      if (change_counter > 0) {
        const value = tabs.findIndex((p) =>
          window.location.pathname.toLowerCase().includes(p.link.toLowerCase())
        );
        set_active_tab(value);
      }
    }, [change_counter]);

    useEffect(() => {
      if (typeof handleSetActiveTab == `function`) {
        handleSetActiveTab(active_tab);
      }
    }, [active_tab, handleSetActiveTab]);

    return (
      <>
        {tabs.length > 0 && (
          <LinkTabsUi>
            <AntTabs
              value={active_tab}
              className="tabs"
              indicatorColor="primary"
              textColor="primary"
              style={{
                borderBottom: !desktop
                  ? `1px solid ${theme.palette.divider}`
                  : "",
                height: "100%",
              }}
              variant="scrollable"
              onChange={(event, value) => {
                set_change_counter((c) => c + 1);
                history.push(tabs[value].link);
              }}
              allowScrollButtonsMobile={true}
              scrollButtons={"auto"}
            >
              {tabs.map((value, index) => (
                <AntTab label={value.label} key={index} />
              ))}
            </AntTabs>

            <div
              className="custom-tab-container"
              style={
                {
                  // minHeight: !!minHeight ? minHeight : 400,
                  // maxHeight: !!maxHeight ? maxHeight : "auto",
                }
              }
            >
              <RouterSwitch>
                {tabs.map((tab, index) => (
                  <Route path={tab.link} exact key={index}>
                    {tab.Component}
                  </Route>
                ))}
              </RouterSwitch>
            </div>
          </LinkTabsUi>
        )}
      </>
    );
  }
);

export default LinkTabs;

export const AntTabs = styled(Tabs)({
  borderBottom: "1px solid #e8e8e8",
  "& .MuiTabs-indicator": {
    backgroundColor: "#1890ff",
  },
});

export const AntTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: "none",
  minWidth: 0,
  [theme.breakpoints.up("sm")]: {
    minWidth: 0,
  },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  color: "rgba(0, 0, 0, 0.85)",
  "&:hover": {
    color: "#40a9ff",
    opacity: 1,
  },
  "&.Mui-selected": {
    color: "#1890ff",
    fontWeight: theme.typography.fontWeightMedium,
  },
  "&.Mui-focusVisible": {
    backgroundColor: "#d1eaff",
  },
}));
