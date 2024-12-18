import styled from "styled-components";

const RtfComponentUi = styled(`div`)`
  /* Customize the container of the editor */
  width: 100%;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 3px !important;
  /* border: 1px solid black !important; */

  .ql-container.ql-snow {
    border: none !important;
  }

  .ql-editor {
    border: none !important;
  }

  /* Customize Quill's toolbar */
  .ql-toolbar {
    background-color: #f1f1f1;
    border: none !important;
  }
`;

export default RtfComponentUi;
