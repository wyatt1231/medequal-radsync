import CancelPresentationRoundedIcon from "@mui/icons-material/CancelPresentationRounded";
import { Backdrop, IconButton, styled, useTheme } from "@mui/material";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import { FC, memo, useEffect } from "react";
import FileUtils from "../../Utils/FileUtils";

export interface IPreviewPDF {
  handleClose?: () => void;
  actions?: any;
  files?: IPdf[];
}

export interface IPdf {
  file?: any;
  doc_title?: string;
  type?: "img" | "pdf" | "doc" | "pptx" | "";
}

// memo(({ patno }) =>
const PreviewPDF: FC<IPreviewPDF> = memo(
  ({ actions, children, files, handleClose }) => {
    const theme = useTheme();

    useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "auto";
      };
    }, []);

    console.log(`files`, files);

    return (
      <div>
        <StyledPdfPreview theme={theme} open={true}>
          <div className="header">
            <div className="start">
              <div className="start-item">
                <IconButton
                  onClick={() => {
                    if (typeof handleClose === "function") {
                      handleClose();
                    }
                  }}
                >
                  <CancelPresentationRoundedIcon />
                </IconButton>
              </div>
              <div className="start-item doc-title">
                {files?.map((p) => p.doc_title).join(`, `)}
              </div>
            </div>
            <div className="center"></div>
            <div className="end">{actions}</div>
          </div>

          <div
            className="document"
            onContextMenu={(e) => {
              e.preventDefault();
            }}
          >
            {!!files &&
              files?.map((row, id: number) => (
                <div key={id}>
                  {/* <div className="start-item doc-title">{``}</div> */}
                  <div className="start-item doc-title">{row.doc_title}</div>
                  <iframe
                    key={id}
                    id="iframe-pdf"
                    title="pdf-frame"
                    src={
                      URL.createObjectURL(
                        FileUtils.Base64toBlob(row.file, "application/pdf")
                      ) + "#toolbar=0"
                    }
                    scrolling="auto"
                    frameBorder="0"
                    style={{
                      minHeight: `100vh`,
                      height: `100%`,
                      width: "80vw",
                      maxWidth: "90vw",
                      backgroundColor: `transparent`,
                      overflow: `auto`,
                    }}
                  />
                </div>
              ))}
          </div>
        </StyledPdfPreview>
      </div>
    );
  }
);

export default PreviewPDF;

const StyledPdfPreview = styled(Backdrop)`
  .page-item {
    margin-bottom: 1.5em;
  }
  &.MuiBackdrop-root {
    z-index: ${(p) => p.theme.zIndex.drawer + 2};
    min-width: 100vw;
    min-height: 100vh;
    max-height: 100vh;
    overflow-y: auto;
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.85);
    .MuiIconButton-root {
      color: #fff;
      /* background-color: blue; */
    }

    .header {
      position: sticky;
      top: 0;
      color: #fff !important;
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr 1fr 1fr;
      padding: 1em;
      background-color: rgba(0, 0, 0, 0.1);
      box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
      align-items: center;
      align-content: center;
      .start {
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        align-content: center;
        justify-content: start;
        grid-gap: 0.5em;
        font-weight: 500;
        text-shadow: 1px 1px 1px black;

        .doc-title {
          /* background-color: rgba(0, 0, 0, 0.2); */
          /* box-shadow: 0 0 50px rgba(0, 0, 0, 0.2); */
          border-radius: 20px;
          /* padding: 0.5em 0; */
        }
      }

      .center {
      }

      .end {
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        align-content: center;
        justify-content: end;
      }
    }
    .document {
      right: 30;
      display: grid;
      justify-content: center;
      justify-items: center;
      width: 100%;
      min-width: 100%;

      position: absolute !important;
      top: 50px !important;
      height: calc(100vh - 50px) !important;
      overflow: hidden !important;
      /* min-height: 85vh; */
      /* max-height: 85vh; */

      .start-item.doc-title {
        display: grid;
        justify-content: center;
        justify-items: center;
        font-weight: 500;
        color: #fff;
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 0.5em 0;
        border-bottom: 1px solid #ffffff84;
      }
    }
  }
`;
