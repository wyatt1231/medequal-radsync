import styled from "styled-components";

const LinkTabsUi = styled.div`
  background-color: #fff;
  min-width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;

  /* span.PrivateTabIndicator-root-1.PrivateTabIndicator-colorPrimary-2.MuiTabs-indicator {
    border-bottom-color: blue !important;
  }
  .MuiTabs-root {
    min-height: 0 !important;
  }

  .MuiTab-wrapper {
    padding: 0.3em 0;
    font-weight: 900;
    font-size: 0.9em;
  }
  .tabs {
    .Mui-selected {
      color: #2196f3 !important;
      border-bottom-color: #2196f3 !important;
    }
  }
  .body {
    border-radius: 7px;
  } */

  .custom-tab-container {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    margin: 1em 0;
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

export default LinkTabsUi;
