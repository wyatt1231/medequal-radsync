import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { Button, IconButton, Popover } from "@mui/material";
import React, { FC, memo } from "react";
import { NavLink } from "react-router-dom";
import { CollapseIconButtonContent } from "./CollapseButtonUI";

interface CollapseIconBottonProps {
  buttonColor?: "inherit" | "primary" | "secondary" | "default" | undefined;
  iconColor?:
    | "inherit"
    | "disabled"
    | "action"
    | "primary"
    | "secondary"
    | "error"
    | undefined;
  buttons: Array<IButtonItem>;
  size?: "medium" | "small";
}

interface IButtonItem {
  text: string;
  Icon?: any;
  handleClick?: () => void;
  color?: "inherit" | "primary" | "secondary" | "default" | undefined;
  navLinkUrl?: string;
  size?: "medium" | "small";
  disabled?: boolean;
}

const CollapseIconBotton: FC<CollapseIconBottonProps> = memo(
  ({ buttonColor, iconColor, buttons, size }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
      null
    );

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
      <>
        <div>
          <IconButton
            color={buttonColor}
            aria-describedby={id}
            onClick={handleClick}
            size={size}
          >
            <MoreHorizRoundedIcon fontSize="small" color={iconColor} />
          </IconButton>
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
            <CollapseIconButtonContent>
              {buttons.map((btn: IButtonItem, index: number) =>
                !!btn.navLinkUrl ? (
                  <div
                    onClick={() => {
                      handleClose();
                      // if (typeof btn.handleClick !== "undefined") {
                      //   btn.handleClick();
                      // }
                    }}
                    key={index}
                  >
                    <NavLink to={btn.navLinkUrl}>
                      <Button
                        // color={btn.color}
                        className="btn"
                        size="small"
                        disabled={btn.disabled}
                        startIcon={
                          btn.Icon ? <btn.Icon fontSize="small" /> : null
                        }
                        disableElevation
                      >
                        {btn.text}
                      </Button>
                    </NavLink>
                  </div>
                ) : (
                  <Button
                    key={index}
                    // color={btn.color}
                    className="btn"
                    size={size}
                    disabled={btn.disabled}
                    onClick={() => {
                      handleClose();
                      if (typeof btn.handleClick !== "undefined") {
                        btn.handleClick();
                      }
                    }}
                    startIcon={btn.Icon ? <btn.Icon /> : null}
                    disableElevation
                  >
                    {btn.text}
                  </Button>
                )
              )}
            </CollapseIconButtonContent>
          </Popover>
        </div>
      </>
    );
  }
);

export default CollapseIconBotton;
