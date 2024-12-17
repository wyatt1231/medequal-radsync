import { Avatar, Skeleton, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import clsx from "clsx";
import { FC, memo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { APP_NAME } from "../../Config/Config";
import LayoutActions from "../../Contexts/Actions/LayoutActions";
import { RootStore } from "../../Contexts/Store";
import SidebarLayoutUi from "./Styles/SidebarLayoutUi";

interface SidebarLayoutProps {}

const PageNavLinks = [
  {
    hasSubLinks: false,
    text: "Study",
    to: "/study",
  },
];

const SidebarLayout: FC<SidebarLayoutProps> = memo(() => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const { show_sidebar } = useSelector((store: RootStore) => store.LayoutReducer);

  const HandleToggleSidebar = useCallback(() => {
    dispatch(LayoutActions.ToggleShowSidebar(!show_sidebar));
  }, [dispatch, show_sidebar]);

  useEffect(() => {
    if (desktop) {
      dispatch(LayoutActions.ToggleShowSidebar(true));
    }
  }, [desktop, dispatch]);

  const { hospital_logo, hospital_name, loading_hospital_logo, loading_hospital_name } = useSelector((store: RootStore) => store.ConfigReducer);

  return (
    <SidebarLayoutUi
      theme={theme}
      open={show_sidebar}
      variant={desktop ? "permanent" : "temporary"}
      PaperProps={{
        className: clsx("sidebar-ctnr", {
          "show-desktop-sidebar": (desktop && show_sidebar) || !desktop,
        }),
      }}
      onClose={HandleToggleSidebar}
    >
      <div className="brand">
        {loading_hospital_logo ? (
          <Skeleton variant="circular" className="brand-logo" />
        ) : (
          <Avatar src={`data:image/png;base64,` + hospital_logo} className="brand-logo" />
        )}
        <Typography variant="caption" className="brand-name">
          {loading_hospital_name ? <Skeleton variant="text" /> : hospital_name}
        </Typography>
      </div>

      <Typography variant="h6" className="app-name">
        {APP_NAME}
      </Typography>

      <nav className="nav">
        {PageNavLinks.map((nav, index) => (
          <NavLink
            key={index}
            activeClassName="dropdown-link-item-active"
            to={nav.to}
            className="nav-item"
            onClick={() => {
              if (!desktop) {
                HandleToggleSidebar();
              }
            }}
            style={{
              borderBottom: PageNavLinks.length - 1 === index ? `1px solid rgba(0, 0, 0, 0.1)` : "",
            }}
          >
            <Typography variant="subtitle2" className="nav-item-label">
              {nav.text}
            </Typography>
          </NavLink>
        ))}
      </nav>
    </SidebarLayoutUi>
  );
});

export default SidebarLayout;
