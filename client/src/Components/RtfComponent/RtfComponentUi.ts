import { Paper } from "@mui/material";
import styled from "styled-components";

const MAX_MARK_HALF_POINTS = 144;

// A blank line is as tall as its paragraph mark's size (data-mark="fs23" = 11.5pt), as in the VB.NET RichTextBox.
const MARK_SIZE_RULES = Array.from({ length: MAX_MARK_HALF_POINTS }, (_, i) => i + 1)
  .map((halfPoints) => `.ql-editor p[data-mark~="fs${halfPoints}"] { font-size: ${halfPoints / 2}pt; }`)
  .join("\n");

const RtfComponentUi = styled(Paper)`
  /* Customize the container of the editor */
  width: 100%;
  margin: 0 auto;
  /* border: 1px solid #ccc; */
  /* border-radius: 3px !important; */
  /* background-color: #fff !important; */
  /* border: 1px solid black !important; */

  .ql-editor {
    border: none !important;
    font-size: 11pt;
    /* Match the legacy VB.NET RichTextBox: single line spacing and a default tab stop every 0.5in. */
    line-height: normal;
    tab-size: 36pt;
    -moz-tab-size: 36pt;
  }
  .ql-editor p {
    white-space: pre-wrap;
  }
  ${MARK_SIZE_RULES}
  .ql-soft-break br {
    display: inline;
  }
  .ql-container.ql-snow {
    font-family: "Arial" !important;
    border: none !important;
    * {
      font-family: "Arial" !important;
    }
  }

  /* In fullscreen the editor fills the screen below the toolbar instead of keeping its inline height. */
  &:fullscreen {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
  &:fullscreen .rtf-scroll {
    flex: 1;
    min-height: 0;
    height: auto !important;
  }

  /* Customize Quill's toolbar */
  .ql-toolbar {
    background-color: #f1f1f1;
    border: none !important;
  }
`;

export default RtfComponentUi;
