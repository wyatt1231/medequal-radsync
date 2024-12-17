import { Drawer } from "@mui/material";
import styled from "styled-components";

const SidebarLayoutUi = styled(Drawer)`
  .sidebar-ctnr {
    display: grid;
    grid-auto-rows: ${p => p?.theme?.header?.height}px 1fr;
    background-color: ${p => p.theme.palette.primary.dark};
    color: ${p => p.theme.palette.primary.contrastText};

    grid-auto-rows: auto auto 1fr;
    grid-gap: 2em;
    padding: 0.5em 0;
    /* max-width: 0;
    width: 0; */
    transition: 0.2s margin-left ease-in-out;
    margin-left: -${p => p?.theme?.sidebar?.maxWidth + 50}px;
    &.show-desktop-sidebar {
      margin-left: 0px;
      transition: 0.2s margin-left ease-in-out;

      width: ${p => p?.theme?.sidebar?.maxWidth}px !important;
      min-width: ${p => p?.theme?.sidebar?.maxWidth}px !important;
      max-width: ${p => p?.theme?.sidebar?.maxWidth}px !important;
    }

    .brand {
      padding: 0 1em;

      display: grid;
      grid-auto-flow: column;
      align-content: center;
      align-items: center;
      justify-items: start;
      justify-content: start;
      /* grid-gap: 0.5em; */
      grid-auto-columns: auto 1fr;
      grid-auto-flow: column;
      grid-gap: 0.5em;

      .brand-logo {
        height: 40px;
        width: 40px;
      }

      .brand-name {
        white-space: pre-wrap;
        text-transform: capitalize;
        font-weight: 600;
        align-self: center;
      }
    }
    .app-name {
      padding: 0 1em;
      text-align: center;
      font-weight: 900;
    }

    .nav {
      display: grid;
      grid-auto-flow: row;
      align-content: start;
      /* align-items: start;
     */
      /* grid-gap: 0.5em; */
      /* padding: 0 2em; */

      .nav-item {
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        padding: ${p => p.theme.spacing(1)} 0;
        transition: 0.2s all ease-in-out;
        display: grid;
        align-items: center;
        align-content: center;
        width: 100%;
        justify-items: start;
        text-decoration: none !important;
        color: rgba(255, 255, 255, 0.6) !important;

        &:hover {
          cursor: pointer;
          color: rgba(255, 255, 255, 1) !important;
        }

        &.dropdown-link-item-active {
          color: rgba(255, 255, 255, 1) !important;
        }

        .nav-item-label {
          text-transform: capitalize;
          font-weight: 600;
          text-decoration: none !important;
          padding: 0 2em;
        }
      }
    }
  }
`;

export default SidebarLayoutUi;
