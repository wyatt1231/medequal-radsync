import { Breadcrumbs, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/system";
import clsx from "clsx";
import { FC, memo } from "react";
import { useSelector } from "react-redux";
import { Link as ReactLink } from "react-router-dom";
import { RootStore } from "../../Contexts/Store";
import BodyLayoutUi from "./Styles/BodyLayoutUi";

interface BodyLayoutProps {}

const BodyLayout: FC<BodyLayoutProps> = memo(({ children }) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const { show_sidebar } = useSelector((store: RootStore) => store.LayoutReducer);

  const { page_links } = useSelector((store: RootStore) => store.PageReducer);
  return (
    <BodyLayoutUi
      theme={theme}
      className={clsx("", {
        show: show_sidebar,
        "show-mobile-sidebar": show_sidebar && !desktop,
      })}
    >
      <Breadcrumbs className="body-breadcrumb">
        {page_links.map((p, i) => (
          <ReactLink key={i} to={p.to} color="text.primary">
            {p.label}

            {/* <Link
              color="text.primary"
              to={p.to}
            >
              {p.label}
            </Link> */}
          </ReactLink>
        ))}
      </Breadcrumbs>

      {children}
    </BodyLayoutUi>
  );
});

export default BodyLayout;
