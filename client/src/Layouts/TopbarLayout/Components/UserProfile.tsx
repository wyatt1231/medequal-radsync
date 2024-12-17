import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { IconButton, Link, Popover, Typography, useTheme } from "@mui/material";
import React, { FC, memo, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import CustomAvatar from "../../../Components/CustomAvatar/CustomAvatar";
import { removeToken } from "../../../Config/Config";
import { RootStore } from "../../../Contexts/Store";
import StringUtil from "../../../Utils/StringUtil";
import { UserProfilePopOverUi, UserProfileUi } from "../Styles/UserProfileUi";
interface UserProfileProps {}

const UserProfile: FC<UserProfileProps> = memo(() => {
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const theme = useTheme();

  const loggedin_user = useSelector(
    (store: RootStore) => store.UserReducer.loggedin_user
  );

  const handleClick = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback(() => {
    removeToken();
    window.location.href = "/login";
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <UserProfileUi theme={theme}>
      <div className="header" aria-describedby={id} onClick={handleClick}>
        <CustomAvatar
          className="profile-image"
          alt={loggedin_user?.empname?.charAt(0)}
          spacing={4}
        />

        <IconButton className="icon" size="small">
          {open ? (
            <ExpandLessRoundedIcon fontSize="small" color="primary" />
          ) : (
            <ExpandMoreRoundedIcon fontSize="small" color="primary" />
          )}
        </IconButton>

        {/* {variant !== "mobile" && (
          <div className="user">
            <div className="fullname">{user?.empname}</div>
            <div className="designation">
              {StringEmptyToDefault(user?.user_sub, "-")}
            </div>
          </div>
        )} */}
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <UserProfilePopOverUi theme={theme} className="content-container">
          <div className="content-header">
            <CustomAvatar
              className="content-header-image"
              spacing={7}
              alt={loggedin_user?.empname?.charAt(0)}
              // src={}
            />

            <div className="content-header-user">
              <Typography variant="subtitle1" className="name">
                {loggedin_user?.empname}
              </Typography>
              <Typography variant="caption" className="designation">
                {StringUtil.ReplaceNull(
                  loggedin_user?.user_type,
                  "-"
                ).toLowerCase()}
              </Typography>
            </div>
          </div>
          <div className="content-body">
            <div className="content-title">Menus</div>
            <div className="content-items">
              <Link
                className="link"
                onClick={() => {
                  handleClose();
                  // history.push(`/change-password`);
                }}
                underline="none"
              >
                User Manual
              </Link>
            </div>
            <div className="content-items">
              <Link
                className="link"
                onClick={() => {
                  handleClose();
                  history.push(`/change-password`);
                }}
                underline="none"
              >
                Change Password
              </Link>
            </div>
            <div className="content-items">
              <Link className="link" onClick={handleLogout} underline="none">
                Sign Out
              </Link>
            </div>
          </div>
        </UserProfilePopOverUi>
      </Popover>
    </UserProfileUi>
  );
});

export default UserProfile;
