import styled from "styled-components";

const RtfComponentUi = styled(`div`)`
  /* Customize the container of the editor */
  .editor-container {
    width: 100%;
    margin: 0 auto;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    height: 100% !important;
  }

  .ql-editor {
    height: 700px !important;
  }

  /* Customize Quill's toolbar */
  .ql-toolbar {
    background-color: #f1f1f1;
  }
`;

export default RtfComponentUi;
