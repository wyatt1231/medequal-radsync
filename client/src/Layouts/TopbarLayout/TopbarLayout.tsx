import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { IconButton, useMediaQuery, useTheme } from "@mui/material";
import clsx from "clsx";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LayoutActions from "../../Contexts/Actions/LayoutActions";
import { RootStore } from "../../Contexts/Store";
import UserProfile from "./Components/UserProfile";
import TopbarLayoutUi from "./Styles/TopbarLayoutUi";
interface TopbarLayoutProps {}

const TopbarLayout: FC<TopbarLayoutProps> = memo(() => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const { show_sidebar } = useSelector(
    (store: RootStore) => store.LayoutReducer
  );

  const [show_toggle_btn, set_show_toggle_btn] = useState(false);

  // const [show_drawer, set_show_drawer] = useState(false);

  const HandleToggleSidebar = useCallback(() => {
    dispatch(LayoutActions.ToggleShowSidebar(!show_sidebar));
  }, [dispatch, show_sidebar]);

  useEffect(() => {
    if (desktop) {
      dispatch(LayoutActions.ToggleShowSidebar(true));
    } else {
      dispatch(LayoutActions.ToggleShowSidebar(false));
    }
  }, [desktop, dispatch]);

  useEffect(() => {
    if (desktop) {
      set_show_toggle_btn(true);
    } else {
      if (show_sidebar) {
        set_show_toggle_btn(false);
      } else {
        set_show_toggle_btn(true);
      }
    }
  }, [desktop, show_sidebar]);

  return (
    <TopbarLayoutUi
      theme={theme}
      position="fixed"
      className={clsx("", {
        show: show_sidebar,
        "show-mobile-sidebar": show_sidebar && !desktop,
      })}
    >
      <div className="start-ctnr">
        {show_toggle_btn && (
          <div className="topbar-item">
            <IconButton color="primary" onClick={HandleToggleSidebar}>
              <MenuRoundedIcon />
            </IconButton>
          </div>
        )}
      </div>
      <div className="end-ctnr">
        <div className="topbar-item">
          {/* <IconButton color="primary">
            <FullscreenRoundedIcon />
          </IconButton> */}
        </div>
        <div className="topbar-item">
          {/* <Avatar /> */}
          <UserProfile />
        </div>
      </div>
    </TopbarLayoutUi>
  );
});

export default TopbarLayout;
