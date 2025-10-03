import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SwipeDownRoundedIcon from "@mui/icons-material/SwipeRounded";
import { Box, Button, IconButton, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Dispatch, FC, memo, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageActions from "../../Contexts/Actions/PageActions";
import StudyActions from "../../Contexts/Actions/StudyActions";
import StudyApi from "../../Contexts/Apis/StudyApi";
import { RootStore } from "../../Contexts/Store";
import { FormType } from "../../Contexts/Types/FormTypes";
import { StudyTemplateDto } from "../../Interfaces/StudyInterfaces";
import StringUtil from "../../Utils/StringUtil";
import StudyManageTemplateAdd from "./StudyManageTemplateForm";
interface StudyManageTemplateProps {
  set_font_size: Dispatch<SetStateAction<string>>;
  set_rtf_impression: Dispatch<SetStateAction<string>>;
  onSubmitTemplate: (form_type: FormType, payload: StudyTemplateDto) => Promise<void>;
}

const StudyManageTemplate: FC<StudyManageTemplateProps> = memo(({ set_font_size, set_rtf_impression, onSubmitTemplate }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { study_impression, study_templates } = useSelector((store: RootStore) => store.StudyReducer);

  const study_template_columns: GridColDef<StudyTemplateDto>[] = [
    {
      field: "templatekey",
      headerName: "Template Name",
      editable: false,
      width: 200,
    },
    {
      field: "templatedeschtml",
      headerName: "Impression",
      editable: false,
      flex: 1,
      renderCell: ({ row }) => {
        return StringUtil.StripHtml(row?.templatedeschtml ?? ``);
      },
    },
    {
      field: "tempmodality",
      headerName: "Modality",
      editable: false,
      minWidth: 100,
      maxWidth: 100,
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
              {![`F`, `C`].includes(study_impression.resulttag) && (
                <IconButton
                  title={"Use Study Template"}
                  onClick={() => {
                    if (!!row.templatedeschtml) {
                      dispatch(
                        PageActions.SetPageConfirmation({
                          open: true,
                          custom_title: `Are you sure that you want to use this template in this result?`,
                          continueCallback: async () => {
                            set_font_size(row.font_size ?? `11pt`);
                            set_rtf_impression(row.templatedeschtml);

                            dispatch(PageActions.SetPrompt(`The study template has been used to this study!`, `success`));
                          },
                        })
                      );
                    }
                  }}
                  size={"small"}
                >
                  <SwipeDownRoundedIcon fontSize="small" color="primary" />
                </IconButton>
              )}
              <IconButton
                title={"Edit Template"}
                onClick={() => {
                  dispatch(
                    PageActions.PushPageSideout({
                      title: `Edit Template / ${row.templatekey}`,
                      width: theme.breakpoints.values.md + `px`,
                      BodyComponent: (
                        <StudyManageTemplateAdd form_type="EDIT" study_template={row} onSubmit={onSubmitTemplate}></StudyManageTemplateAdd>
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

  return (
    <>
      <Box height={`100%`}>
        <DataGrid
          getRowId={(p) => p.templateno}
          density="compact"
          rows={study_templates ?? []}
          columns={study_template_columns}
          loading={false}
          disableSelectionOnClick
        />
      </Box>
    </>
  );
});

export default StudyManageTemplate;
