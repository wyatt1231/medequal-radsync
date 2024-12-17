import { Button, LinearProgress, Slide } from "@material-ui/core";
import DraftsIcon from "@material-ui/icons/Drafts";
import RestoreIcon from "@material-ui/icons/Restore";
import SaveIcon from "@material-ui/icons/Save";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RichTextEditor, { EditorValue } from "react-rte";
import ConfirmationDialog from "../../../Component/ConfirmationDialog/ConfirmationDialog";
import LoadingDialog from "../../../Component/LoadingDialog/LoadingDialog";
import UseConvertHtmlToRtf from "../../../Hooks/UseConvertHtmlToRtf";
import { UseHtmlPolisher } from "../../../Hooks/UseHtmlPolisher";
import { ARadMgmtUpdateImpression } from "../../../Services/Actions/RadStudyManagementActions";
import { RootStore } from "../../../Services/Store";
import { useHistory } from "react-router-dom";
interface IRadStudyContent {}

const toolbarConfig: any = {
  display: [
    "INLINE_STYLE_BUTTONS",
    "BLOCK_TYPE_BUTTONS",
    // "BLOCK_TYPE_DROPDOWN",
    "HISTORY_BUTTONS",
  ],
  INLINE_STYLE_BUTTONS: [
    { label: "Bold", style: "BOLD" },
    { label: "Italic", style: "ITALIC" },
    { label: "Underline", style: "UNDERLINE" },
  ],
  // BLOCK_TYPE_DROPDOWN: [
  //    {
  //      label: "Normal",
  //      style: "unstyled",
  //    },
  //    {
  //      label: "Heading Large",
  //      style: "header-one",
  //    },
  //    {
  //      label: "Heading Medium",
  //      style: "header-two",
  //    },
  //    {
  //      label: "Heading Small",
  //      style: "header-three",
  //    },
  // ],
  BLOCK_TYPE_BUTTONS: [],
};

const RadStudyContent = memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();

  console.log(`history`, history.location.pathname);

  const [rtfContent, setRtfContent] = useState<EditorValue>(
    RichTextEditor.createEmptyValue()
  );

  const RadStudyImpressionLoading = useSelector(
    (state: RootStore) => state.RadStudyMgmt.radStudyImpressionLoading
  );

  const RadStudyImpression = useSelector(
    (state: RootStore) => state.RadStudyMgmt.radStudyImpressionData
  );
  const radStudyImpressionUpdating = useSelector(
    (state: RootStore) => state.RadStudyMgmt.radStudyImpressionUpdating
  );

  const [ResetCounter, SetResetCounter] = useState<number>(0);
  const [openDraftConfirmDialog, setOpenDraftConfirmDialog] = useState<boolean>(
    false
  );
  const [openSaveFinalConfirmDialog, setOpenSaveFinalConfirmDialog] = useState<
    boolean
  >(false);

  const handleResetImpression = useCallback(() => {
    SetResetCounter((resetCount) => resetCount + 1);
  }, []);

  const handleOpenDraftConfirmDialog = useCallback(() => {
    setOpenDraftConfirmDialog(true);
  }, []);
  const handleOpenSaveFinalConfirmDialog = useCallback(() => {
    setOpenSaveFinalConfirmDialog(true);
  }, []);

  const handleCloseDraftConfirmDialog = useCallback(() => {
    setOpenDraftConfirmDialog(false);
  }, []);
  const handleCloseSaveFinalConfirmDialog = useCallback(() => {
    setOpenSaveFinalConfirmDialog(false);
  }, []);

  const handleSaveDraftImpression = useCallback(async () => {
    const polishedHtml = UseHtmlPolisher(rtfContent.toString("html"));

    console.log(polishedHtml);
    const rtf: string | null = UseConvertHtmlToRtf(polishedHtml);

    const impressionParams = {
      resultdesc: rtf === null ? "" : rtf,
      radresultno: RadStudyImpression.radresultno,
      resulttag: "D",
    };

    dispatch(
      ARadMgmtUpdateImpression(
        impressionParams,
        handleCloseDraftConfirmDialog,
        history
      )
    );
  }, [
    RadStudyImpression,
    dispatch,
    handleCloseDraftConfirmDialog,
    rtfContent,
    history,
  ]);

  const handleSaveFinalImpression = useCallback(async () => {
    const polishedHtml = UseHtmlPolisher(rtfContent.toString("html"));

    console.log(polishedHtml);
    const rtf: string | null = UseConvertHtmlToRtf(polishedHtml);

    const impressionParams = {
      resultdesc: rtf === null ? "" : rtf,
      radresultno: RadStudyImpression.radresultno,
      resulttag: "F",
    };

    dispatch(
      ARadMgmtUpdateImpression(
        impressionParams,
        handleCloseDraftConfirmDialog,
        history
      )
    );
  }, [
    RadStudyImpression,
    dispatch,
    handleCloseDraftConfirmDialog,
    rtfContent,
    history,
  ]);

  const isReadOnly = useCallback(() => {
    if (
      RadStudyImpression?.resulttag === "D" ||
      RadStudyImpression?.resulttag === "C"
    ) {
      return false;
    }

    return true;
  }, [RadStudyImpression]);

  useEffect(() => {
    let mounted = true;

    const initializeData = () => {
      if (
        RadStudyImpression?.resultdesc &&
        typeof RadStudyImpression?.resultdesc !== "undefined"
      ) {
        setRtfContent(
          RichTextEditor.createValueFromString(
            RadStudyImpression?.resultdesc.toString("html"),
            "html"
          )
        );
      }
    };
    mounted && initializeData();
    return () => {
      mounted = false;
    };
  }, [RadStudyImpression, ResetCounter]);

  const handleChange = useCallback((value: any) => {
    setRtfContent(value);
  }, []);
  return (
    <div className="study-rtf scroll">
      <div className="rtf-header">
        You can write or edit the drafted and charged study impression below.
      </div>

      <div className="body">
        <div className="rtf scroll">
          {RadStudyImpressionLoading && <LinearProgress />}
          {!RadStudyImpressionLoading && (
            <Slide
              direction="right"
              in={!RadStudyImpressionLoading}
              mountOnEnter
              unmountOnExit
            >
              <RichTextEditor
                value={rtfContent}
                // autoFocus={true}
                readOnly={isReadOnly()}
                placeholder="Write your study impression here..."
                toolbarClassName="rte-toolbar"
                editorClassName="rte-editor "
                className="rte-container"
                toolbarConfig={toolbarConfig}
                onChange={handleChange}
              />
            </Slide>
          )}
        </div>

        <div className="footer">
          <Button
            color="default"
            startIcon={<RestoreIcon />}
            variant="contained"
            size="small"
            disabled={isReadOnly()}
            onClick={handleResetImpression}
          >
            Reset
          </Button>
          <Button
            startIcon={<DraftsIcon />}
            color="secondary"
            variant="contained"
            size="small"
            disabled={isReadOnly()}
            onClick={handleOpenDraftConfirmDialog}
          >
            Draft
          </Button>
          <Button
            startIcon={<SaveIcon />}
            color="primary"
            variant="contained"
            size="small"
            disabled={isReadOnly()}
            onClick={handleOpenSaveFinalConfirmDialog}
          >
            Save/Finalize
          </Button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={openDraftConfirmDialog}
        handleCancel={handleCloseDraftConfirmDialog}
        handleContinue={handleSaveDraftImpression}
        askMessage="You are saving this report to draft, Do you want to continue?"
      />

      <ConfirmationDialog
        isOpen={openSaveFinalConfirmDialog}
        handleCancel={handleCloseSaveFinalConfirmDialog}
        handleContinue={handleSaveFinalImpression}
        askMessage="You are saving this report as final. You won't be able to revert this action. Do you want to continue?"
      />

      <LoadingDialog
        loadingMessage="Saving, please wait..."
        open={radStudyImpressionUpdating}
      />
    </div>
  );
});

export default RadStudyContent;
