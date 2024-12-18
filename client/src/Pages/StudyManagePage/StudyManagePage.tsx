import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PlaylistAddCircleIcon from "@mui/icons-material/PlaylistAddCheck";
import PreviewIcon from "@mui/icons-material/Preview";
import { Box, Button, Grid, IconButton, Paper, Typography } from "@mui/material";
import { FC, memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useTheme } from "styled-components";
import RtfComponent from "../../Components/RtfComponent/RtfComponent";
import PageActions from "../../Contexts/Actions/PageActions";
import StudyActions from "../../Contexts/Actions/StudyActions";
import StudyApi from "../../Contexts/Apis/StudyApi";
import { RootStore } from "../../Contexts/Store";
import { StudyDto } from "../../Interfaces/StudyInterfaces";
import StudyManagePagePatientInfo from "./StudyManagePagePatientInfo";
interface StudyManagePageProps {}

interface StudyManagePageParamsProps {
  radresultno: string;
}

const StudyManagePage: FC<StudyManagePageProps> = memo(() => {
  const theme = useTheme();
  const params = useParams<StudyManagePageParamsProps>();
  const { radresultno } = params;
  const dispatch = useDispatch();

  const { study, study_impression } = useSelector((store: RootStore) => store.StudyReducer);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const divRef = useRef(null);
  const [is_full_screen_study, set_is_full_screen_study] = useState(false);
  const [is_full_screen_imaging, set_is_full_screen_imaging] = useState(false);
  const [rtf_impression, set_rtf_impression] = useState<string>("");
  const [loading_study, set_loading_study] = useState(false);
  const [loading_study_patient, set_loading_study_patient] = useState(false);
  const [loading_study_impression, set_loading_study_impression] = useState(false);

  const onClickFullScreenStudy = useCallback(() => {
    if (is_full_screen_study) {
      set_is_full_screen_study(false);
      document
        .exitFullscreen()
        .then(() => console.log("Exited fullscreen"))
        .catch((err) => console.error("Error exiting fullscreen:", err));
    } else {
      set_is_full_screen_study(true);
      if (divRef.current) {
        if (divRef.current.requestFullscreen) {
          divRef.current.requestFullscreen();
        } else if (divRef.current.mozRequestFullScreen) {
          divRef.current.mozRequestFullScreen();
        } else if (divRef.current.webkitRequestFullscreen) {
          divRef.current.webkitRequestFullscreen();
        } else if (divRef.current.msRequestFullscreen) {
          divRef.current.msRequestFullscreen();
        }
      }
    }
  }, [is_full_screen_study]);

  useEffect(() => {
    // Event handler
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        set_is_full_screen_study(false);
        set_is_full_screen_imaging(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const onClickFullScreenImaging = () => {
    if (iframeRef.current) {
      set_is_full_screen_imaging(true);
      iframeRef.current
        .requestFullscreen()
        .then(() => console.log("Iframe is fullscreen"))
        .catch((err) => console.error("Error entering fullscreen:", err));
    }
  };

  const onClickOpenLinkNewWindow = () => {
    if (!!study?.study_link) {
      window.open(study?.study_link, "_blank", "noopener,noreferrer");
    }
  };
  // const exitFullscreen = () => {
  //   if (document.fullscreenElement) {
  //     document
  //       .exitFullscreen()
  //       .then(() => console.log("Exited fullscreen"))
  //       .catch((err) => console.error("Error exiting fullscreen:", err));
  //   }
  // };

  const onEditorChange = (content: string) => {
    set_rtf_impression(content);
  };

  const onSubmitStudy = useCallback(
    async (tag: `F` | `D`) => {
      const payload: StudyDto = {
        resulttag: tag,
        radresulthtml: rtf_impression,
        radresultno: radresultno,
      };

      dispatch(
        PageActions.SetPageConfirmation({
          open: true,
          continueCallback: async () => {
            dispatch(PageActions.SetLoading(true));

            try {
              const study_result = await StudyApi.UpdateStudyImpression(radresultno, payload);

              console.log(`study_result`, study_result);

              dispatch(PageActions.SetPrompt(`The study impression has been saved as ${tag === `D` ? `DRAFT` : `FINAL`}!`, `success`));

              dispatch(StudyActions.SetStudy(radresultno));
              dispatch(StudyActions.SetStudyImpression(radresultno));
            } catch (error) {
              dispatch(PageActions.SetHttpErrorPrompt(error));
            }

            dispatch(PageActions.SetLoading(false));
          },
        })
      );
    },
    [dispatch, radresultno, rtf_impression]
  );

  useEffect(() => {
    dispatch(
      PageActions.SetPageLinks([
        {
          to: `/study`,
          label: `Studies`,
        },
        {
          to: window.location.pathname,
          label: radresultno,
        },
      ])
    );
  }, [dispatch, radresultno]);

  useEffect(() => {
    if (!!radresultno) {
      dispatch(
        StudyActions.SetStudy(radresultno, (is_loading: boolean) => {
          set_loading_study(is_loading);
        })
      );

      dispatch(
        StudyActions.SetStudyPatient(radresultno, (is_loading: boolean) => {
          set_loading_study_patient(is_loading);
        })
      );

      dispatch(
        StudyActions.SetStudyImpression(radresultno, (is_loading: boolean) => {
          set_loading_study_impression(is_loading);
        })
      );
    }
  }, [dispatch, radresultno]);

  useEffect(() => {
    if (!!radresultno && !!study_impression && !loading_study_impression) {
      set_rtf_impression(study_impression?.radresulthtml ?? ``);
    }
  }, [dispatch, radresultno, study_impression, loading_study_impression]);

  return (
    <div>
      <Grid container rowSpacing={3} columnSpacing={3}>
        <Grid item xs={12}>
          <Paper style={{ padding: `1em` }}>
            <StudyManagePagePatientInfo radresultno={radresultno}></StudyManagePagePatientInfo>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper style={{ padding: `1em`, width: "100%", height: "100%" }} ref={divRef}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography component={"div"} className="form-separator">
                  <Box display={`grid`} gridAutoFlow={`column`} gridAutoColumns={`1fr auto`} alignItems={`center`} alignContent={`center`}>
                    <div>Study/Imaging Report</div>
                    <Box
                      display={`grid`}
                      gridAutoFlow={`column`}
                      gap={`1em`}
                      justifyContent={`end`}
                      justifyItems={`end`}
                      alignItems={`center`}
                      alignContent={`center`}
                    >
                      <IconButton title="Result Templates" onClick={onClickFullScreenStudy} size={"small"}>
                        <PlaylistAddCircleIcon fontSize="small" color="primary" />
                      </IconButton>

                      <IconButton title={"Open Imaging In New Window"} onClick={onClickOpenLinkNewWindow} size={"small"}>
                        <OpenInNewIcon fontSize="small" color="primary" />
                      </IconButton>

                      <IconButton title={"Preview Imaging"} onClick={onClickFullScreenImaging} size={"small"}>
                        <PreviewIcon fontSize="small" color="primary" />
                      </IconButton>
                      <IconButton
                        title={is_full_screen_study ? "Exit Study Report & Imaging Full Screen" : "Enter Study Report & Imaging Full Screen"}
                        onClick={onClickFullScreenStudy}
                        size={"small"}
                      >
                        {is_full_screen_study ? (
                          <FullscreenExitIcon fontSize="small" color="primary" />
                        ) : (
                          <FullscreenIcon fontSize="small" color="primary" />
                        )}
                      </IconButton>
                    </Box>
                  </Box>
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                {/* <Typography component={"div"} className="form-separator">
                  Study Report
                </Typography> */}

                <div>
                  <RtfComponent
                    value={rtf_impression}
                    onChange={onEditorChange}
                    read_only={!["D", "C"].includes(study_impression?.resulttag)}
                    height={is_full_screen_study ? `89vh` : `730px`}
                  />

                  <Box marginTop={`1em`} display={`grid`} gridAutoFlow={`column`} gap={`1em`} justifyContent={`end`} justifyItems={`end`}>
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled={!["D", "C"].includes(study_impression?.resulttag)}
                      onClick={async () => {
                        await onSubmitStudy(`D`);
                      }}
                    >
                      Save as Draft
                    </Button>

                    <Button
                      variant="contained"
                      color="warning"
                      disabled={!["D", "C"].includes(study_impression?.resulttag)}
                      onClick={async () => {
                        await onSubmitStudy(`F`);
                      }}
                    >
                      Save as Final
                    </Button>
                  </Box>
                </div>
              </Grid>

              <Grid item xs={12} md={8}>
                {!!study?.study_link && (
                  <div style={{ height: is_full_screen_study ? `93vh` : `800px`, position: `relative`, background: `black` }}>
                    <iframe
                      ref={iframeRef}
                      src={study.study_link}
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                      title="Embedded Content"
                      // allowFullScreen={true}
                      scrolling="no"
                      frameBorder={0}
                    >
                      {/* allow="autoplay; encrypted-media; fullscreen" */}
                      Your browser doesnot support iframes
                      <a href={study.study_link}>click here to view the image directly.</a>
                    </iframe>
                  </div>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
});

export default StudyManagePage;
