import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
// import PlaylistAddCircleIcon from "@mui/icons-material/PlaylistAddCheck";
import PreviewIcon from "@mui/icons-material/Preview";
import { Box, Button, Chip, Grid, IconButton, Paper, Typography, useTheme } from "@mui/material";
import { FC, memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../../Components/Loader";
import RtfComponent from "../../Components/RtfComponent/RtfComponent";
import PageActions from "../../Contexts/Actions/PageActions";
import StudyActions from "../../Contexts/Actions/StudyActions";
import StudyApi from "../../Contexts/Apis/StudyApi";
import { RootStore } from "../../Contexts/Store";
import { FormType } from "../../Contexts/Types/FormTypes";
import { StudyDto, StudyTemplateDto } from "../../Interfaces/StudyInterfaces";
import StringUtil from "../../Utils/StringUtil";
import StudyManagePagePatientInfo from "./StudyManagePagePatientInfo";
import StudyManageTemplate from "./StudyManageTemplate";
import StudyManageTemplateForm from "./StudyManageTemplateForm";
interface StudyManagePageProps {}

interface StudyManagePageParamsProps {
  radresultno: string;
}

const StudyManagePage: FC<StudyManagePageProps> = memo(() => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const divRef = useRef(null);
  const theme = useTheme();
  const params = useParams<StudyManagePageParamsProps>();
  const { radresultno } = params;
  const dispatch = useDispatch();

  const { study, study_impression } = useSelector((store: RootStore) => store.StudyReducer);

  const [font_size, set_font_size] = useState(`11pt`);

  const [is_full_screen_study, set_is_full_screen_study] = useState(false);
  // const [is_full_screen_imaging, set_is_full_screen_imaging] = useState(false);
  const [rtf_impression, set_rtf_impression] = useState<string>("");
  const [loading_study, set_loading_study] = useState(false);
  const [loading_study_patient, set_loading_study_patient] = useState(false);
  const [loading_study_impression, set_loading_study_impression] = useState(false);

  const onSubmitTemplate = async (form_type: FormType, payload: StudyTemplateDto) => {
    if (form_type === `ADD`) {
      dispatch(PageActions.SetLoading(true));
      try {
        await StudyApi.AddStudyTemplate(payload);
        dispatch(PageActions.SetPrompt(`The template has been added successfully!`, `success`));
        dispatch(StudyActions.SetStudyTemplates());
        dispatch(PageActions.PopPageSideout());
      } catch (error) {
        dispatch(PageActions.SetHttpErrorPrompt(error));
      }
      dispatch(PageActions.SetLoading(false));
    } else if (form_type === `EDIT`) {
      dispatch(PageActions.SetLoading(true));
      try {
        await StudyApi.UpdateStudyTemplate(payload);
        dispatch(PageActions.SetPrompt(`The template has been updated successfully!`, `success`));
        dispatch(StudyActions.SetStudyTemplates());
        dispatch(PageActions.PopPageSideout());
      } catch (error) {
        dispatch(PageActions.SetHttpErrorPrompt(error));
      }
      dispatch(PageActions.SetLoading(false));
    }
  };

  const onClickOpenTemplate = async () => {
    try {
      dispatch(PageActions.SetLoading(true));
      const templates = await StudyApi.GetStudyTemplates();
      dispatch(StudyActions.SetStudyTemplates(templates));
      dispatch(PageActions.SetLoading(false));

      dispatch(
        PageActions.PushPageSideout({
          title: `Study Templates`,
          width: theme.breakpoints.values.lg + `px`,
          ActionComponent: (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  dispatch(
                    PageActions.PushPageSideout({
                      title: `Create a Template`,
                      width: theme.breakpoints.values.md + `px`,
                      BodyComponent: <StudyManageTemplateForm form_type="ADD" onSubmit={onSubmitTemplate}></StudyManageTemplateForm>,
                      ActionComponent: (
                        <>
                          <Button type="submit" form="form_study_template" variant="contained">
                            Add Template
                          </Button>
                        </>
                      ),
                    })
                  );
                }}
              >
                Create Template
              </Button>
            </>
          ),
          BodyComponent: (
            <StudyManageTemplate
              set_font_size={set_font_size}
              set_rtf_impression={set_rtf_impression}
              onSubmitTemplate={onSubmitTemplate}
            ></StudyManageTemplate>
          ),
        })
      );
    } catch (error) {
      dispatch(PageActions.SetHttpErrorPrompt(error));
    }
  };

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
        // set_is_full_screen_imaging(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const onClickFullScreenImaging = () => {
    if (iframeRef.current) {
      // set_is_full_screen_imaging(true);
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

  const onEditorChange = (content: string) => {
    set_rtf_impression(content);
  };

  const onSubmitStudy = useCallback(
    async (tag: `F` | `D`) => {
      const payload: StudyDto = {
        resulttag: tag,
        radresulthtml: rtf_impression,
        radresultno: radresultno,
        resultdesc: StringUtil.HtmlToRtf(rtf_impression),
      };

      dispatch(
        PageActions.SetPageConfirmation({
          open: true,
          continueCallback: async () => {
            dispatch(PageActions.SetLoading(true));

            try {
              await StudyApi.UpdateStudyImpression(radresultno, payload);
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

  const onUnverifyStudy = useCallback(async () => {
    dispatch(
      PageActions.SetPageConfirmation({
        open: true,
        continueCallback: async () => {
          dispatch(PageActions.SetLoading(true));
          try {
            await StudyApi.UnverifyStudyImpression(radresultno);
            dispatch(PageActions.SetPrompt(`The study impression has been revoked!`, `success`));
            dispatch(StudyActions.SetStudy(radresultno));
            dispatch(StudyActions.SetStudyImpression(radresultno));
          } catch (error) {
            dispatch(PageActions.SetHttpErrorPrompt(error));
          }

          dispatch(PageActions.SetLoading(false));
        },
      })
    );
  }, [dispatch, radresultno]);

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
      // console.log(`study_impression?.radresulthtml `, study_impression?.radresulthtml);

      set_rtf_impression(study_impression?.radresulthtml ?? ``);

      set_font_size(study_impression?.font_size ?? `11pt`);
    }
  }, [dispatch, radresultno, study_impression, loading_study_impression]);

  return loading_study || loading_study_impression ? (
    <Loader></Loader>
  ) : (
    <div>
      <Grid container rowSpacing={3} columnSpacing={3}>
        <Grid item xs={12}>
          <Paper style={{ padding: `1em` }}>
            <StudyManagePagePatientInfo radresultno={radresultno}></StudyManagePagePatientInfo>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper style={{ padding: `1em` }} ref={divRef}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography component={"div"} className="form-separator">
                  <Box display={`grid`} gridAutoFlow={`column`} gridAutoColumns={`1fr auto`} alignItems={`center`} alignContent={`center`}>
                    <Box
                      display={`grid`}
                      gridAutoFlow={`column`}
                      gap={`1em`}
                      justifyContent={`start`}
                      justifyItems={`start`}
                      alignItems={`center`}
                      alignContent={`center`}
                    >
                      <span>Study/Imaging Report</span>

                      <Chip label={StringUtil.ReplaceNull(study?.resulttag, "-")} color="info" size="small" />
                    </Box>
                    <Box
                      display={`grid`}
                      gridAutoFlow={`column`}
                      gap={`1em`}
                      justifyContent={`end`}
                      justifyItems={`end`}
                      alignItems={`center`}
                      alignContent={`center`}
                    >
                      {/* // <IconButton title="View Result Templates" onClick={onClickOpenTemplate} size={"small"}>
                        //   <PlaylistAddCircleIcon fontSize="small" color="primary" />
                        // </IconButton> */}
                      <Button variant="outlined" color="primary" onClick={onClickOpenTemplate} size={"small"}>
                        View Templates
                      </Button>

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

              <Grid item xs={12} md={6}>
                {/* <Typography component={"div"} className="form-separator">
                  Study Report
                </Typography> */}

                <div>
                  <RtfComponent
                    value={rtf_impression}
                    onChange={onEditorChange}
                    read_only={!["D"].includes(study_impression?.resulttag)}
                    height={is_full_screen_study ? `82vh` : `700px`}
                    font_size={font_size}
                    set_font_size={set_font_size}
                  />

                  <Box marginTop={`1em`} display={`grid`} gridAutoFlow={`column`} gap={`1em`} justifyContent={`end`} justifyItems={`end`}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      disabled={!["D"].includes(study_impression?.resulttag)}
                      onClick={async () => {
                        await onSubmitStudy(`D`);
                      }}
                    >
                      Save as Draft
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!["D"].includes(study_impression?.resulttag)}
                      onClick={async () => {
                        await onSubmitStudy(`F`);
                      }}
                    >
                      Save as Final
                    </Button>

                    {["F"].includes(study_impression?.resulttag) && (
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={async () => {
                          await onUnverifyStudy();
                        }}
                      >
                        Unverify
                      </Button>
                    )}
                  </Box>
                </div>
              </Grid>

              <Grid item xs={12} md={6}>
                {!!study?.study_link && (
                  <div style={{ height: is_full_screen_study ? `90.3vh` : `800px`, position: `relative`, borderRadius: `3px`, background: `black` }}>
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
