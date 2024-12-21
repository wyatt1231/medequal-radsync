import { Box, Button, Grid, IconButton, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC, memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageActions from "../../Contexts/Actions/PageActions";
import StudyActions from "../../Contexts/Actions/StudyActions";
import StudyApi from "../../Contexts/Apis/StudyApi";
import { RootStore } from "../../Contexts/Store";
import { StudyTemplateDto } from "../../Interfaces/StudyInterfaces";
import theme from "../../Styles/MuiTheme";
import StringUtil from "../../Utils/StringUtil";

import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { FormType } from "../../Contexts/Types/FormTypes";
import StudyManageTemplateForm from "../StudyManagePage/StudyManageTemplateForm";

interface TemplatePageProps {}

const TemplatePage: FC<TemplatePageProps> = memo(() => {
  const dispatch = useDispatch();
  const divRef = useRef<HTMLDivElement>(null); // Ref to access the div element
  const [position, set_position] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const [is_loading_table, set_is_loading_table] = useState(false);

  const columns: GridColDef<StudyTemplateDto>[] = [
    {
      field: "templatekey",
      headerName: "Title",
      editable: false,
      width: 200,
    },
    {
      field: "templatedeschtml",
      headerName: "Template",
      editable: false,
      flex: 1,
      renderCell: ({ row }) => {
        return StringUtil.StripHtml(row?.templatedeschtml ?? ``);
      },
    },
    {
      field: "",
      headerName: "Actions",
      editable: false,
      minWidth: 100,
      maxWidth: 100,
      align: `center`,
      renderCell: ({ row }) => {
        return (
          <>
            <Box>
              <IconButton
                title={"Edit Template"}
                onClick={() => {
                  dispatch(
                    PageActions.PushPageSideout({
                      title: `Edit Template / ${row.templatekey}`,
                      width: theme.breakpoints.values.md + `px`,
                      BodyComponent: (
                        <StudyManageTemplateForm form_type="EDIT" study_template={row} onSubmit={onSubmitTemplate}></StudyManageTemplateForm>
                      ),
                      ActionComponent: (
                        <>
                          <Button type="submit" form="form_study_template" variant="contained">
                            Save Template
                          </Button>
                        </>
                      ),
                    })
                  );
                }}
                size={"small"}
              >
                <EditRoundedIcon fontSize="small" />
              </IconButton>
              <IconButton
                title={"Delete Template"}
                onClick={() => {
                  //  dispatch(StudyActions.SetStudyTemplates());

                  dispatch(
                    PageActions.SetPageConfirmation({
                      open: true,
                      // custom_title: `Are you sure that you want to save the claim form?`,
                      continueCallback: async () => {
                        dispatch(PageActions.SetLoading(true));

                        try {
                          await StudyApi.DeleteStudyTemplate(row.templateno);

                          dispatch(StudyActions.SetStudyTemplates());

                          dispatch(PageActions.SetPrompt(`The template has been deleted successfully!`, `success`));
                        } catch (error) {
                          dispatch(PageActions.SetHttpErrorPrompt(error));
                        }

                        dispatch(PageActions.SetLoading(false));
                      },
                    })
                  );
                }}
                size={"small"}
              >
                <DeleteRoundedIcon fontSize="small" color="error" />
              </IconButton>
            </Box>
          </>
        );
      },
    },
  ];

  const { study_templates } = useSelector((store: RootStore) => store.StudyReducer);

  const setIsLoadingTable = useCallback((is_loading: boolean) => {
    set_is_loading_table(is_loading);
  }, []);

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

  useEffect(() => {
    dispatch(StudyActions.SetStudyTemplates(null, setIsLoadingTable));
  }, [dispatch, setIsLoadingTable]);

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      set_position({ top: rect.top, left: rect.left });
    }
  }, []);

  useEffect(() => {
    dispatch(
      PageActions.SetPageLinks([
        {
          label: "Templates",
          to: "/template",
        },
      ])
    );
  }, [dispatch]);

  return (
    <>
      <Paper
        ref={divRef}
        style={{
          padding: `1em`,
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Box margin={theme.spacing(1)} display={`grid`} justifyContent={`end`} alignItems={`center`}>
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
            </Box>
          </Grid>
          <Grid item xs={12}>
            <div style={{ height: `calc(100vh - ${position.top + 110}px)`, width: "100%" }}>
              <DataGrid
                getRowId={(p) => p.templateno}
                density="compact"
                rows={study_templates ?? []}
                columns={columns}
                loading={false}
                disableSelectionOnClick
              />
            </div>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
});

export default TemplatePage;
