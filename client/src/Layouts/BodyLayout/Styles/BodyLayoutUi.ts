import styled from "styled-components";

const BodyLayoutUi = styled.div`
  margin: 0 1em !important;
  margin-top: 60px !important;
  &.show {
    padding-left: ${p => p.theme.sidebar.maxWidth}px !important;
  }

  &.show-mobile-sidebar {
    padding-left: 0 !important;
  }

  .body-breadcrumb {
    padding: 1em 0;
  }
`;

export default BodyLayoutUi;
