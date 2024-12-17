import { Dialog } from "@mui/material";
import styled from "styled-components";

const PagePromptUi = styled(Dialog)`
  .dialog-content {
    margin-bottom: 1em;
    text-align: center;
    display: grid;
    grid-gap: 1em;

    .prompt-title {
      font-weight: 900;
      color: rgba(0, 0, 0, 0.7);
    }

    .prompt-sub {
      font-size: 0.75em;
    }
    .big-text {
      color: red;
      font-weight: 600;
      font-size: 1.1em;
    }
    .small-text {
      font-size: 0.87em;
    }
  }
`;

export default PagePromptUi;
