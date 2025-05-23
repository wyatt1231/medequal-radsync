import { Paper } from "@mui/material";
import styled from "styled-components";

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
  }
  .ql-container.ql-snow {
    font-family: "Arial" !important;
    border: none !important;
    * {
      font-family: "Arial" !important;
    }
  }

  /* Customize Quill's toolbar */
  .ql-toolbar {
    background-color: #f1f1f1;
    border: none !important;
  }
`;

export default RtfComponentUi;
