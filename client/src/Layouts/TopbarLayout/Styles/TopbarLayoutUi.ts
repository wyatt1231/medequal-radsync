import { AppBar } from "@mui/material";
import styled from "styled-components";

const TopbarLayoutUi = styled(AppBar)`
  background-color: #fff !important;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1) !important;
  display: grid !important;
  align-content: center;
  align-items: center;
  height: 60px;
  min-height: 60px;
  grid-auto-flow: column;

  &.show {
    padding-left: ${p => p.theme.sidebar.maxWidth}px !important;
  }

  &.show-mobile-sidebar {
    padding-left: 0 !important;
  }
  .start-ctnr {
    display: grid;
    justify-content: start;
    justify-items: start;
    align-content: center;
    align-items: center;
    padding: 0 1em;
    grid-gap: 0.5em;
    grid-auto-flow: column;
  }

  .end-ctnr {
    display: grid;
    justify-content: end;
    justify-items: end;
    align-content: center;
    align-items: center;
    padding: 0 1em;
    grid-gap: 0.5em;
    grid-auto-flow: column;
  }
`;

export default TopbarLayoutUi;
