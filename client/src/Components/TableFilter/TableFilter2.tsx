import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import { LoadingButton } from "@mui/lab";
import {
  Grid,
  IconButton,
  Paper,
  Popover,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
interface TableFilter2Props {
  width?: number;
  initial_filter: any;
  handleSetTableSearch: (data: any) => any;
}

const TableFilter2: FC<TableFilter2Props> = memo(
  ({ children, width, initial_filter, handleSetTableSearch }) => {
    const theme = useTheme();
    const btn_ref = useRef<HTMLButtonElement | null>(null);
    const screen_sm = useMediaQuery(theme.breakpoints.down("sm"));
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
      null
    );

    const form_filter_instance = useForm<any>({
      mode: "onChange",
      defaultValues: initial_filter,
    });

    const [toggle_popover, set_toggle_popover] = useState(0);

    const handleSubmitForm = useCallback(
      async (data: any) => {
        handleSetTableSearch(data);
        set_toggle_popover((p) => p + 1);
      },
      [handleSetTableSearch]
    );

    const handleClearForm = useCallback(async () => {
      form_filter_instance.reset();
      handleSetTableSearch(initial_filter);
      set_toggle_popover((p) => p + 1);
    }, [handleSetTableSearch, initial_filter]);

    const handleOpen = useCallback(() => {
      setAnchorEl(btn_ref.current);
    }, []);

    const handleClose = useCallback(() => {
      setAnchorEl(null);
    }, []);

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    useEffect(() => {
      handleClose();
    }, [handleClose, toggle_popover]);

    return (
      <div>
        <Tooltip title="Filter the records of the table">
          <IconButton
            type="button"
            color="primary"
            aria-describedby={id}
            onClick={handleOpen}
            ref={btn_ref}
          >
            <FilterListRoundedIcon color="primary" />
          </IconButton>
        </Tooltip>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <PopperContent
            style={{
              minWidth: screen_sm ? `100%` : !!width ? width : 650,
              maxWidth: screen_sm ? `100%` : !!width ? width : 650,
            }}
          >
            <div className="popper-content">
              <Typography
                fontWeight="900"
                className="title-text-secondary filter-title"
              >
                Filter Table Results
              </Typography>
              <div className="content">
                <FormProvider {...form_filter_instance}>
                  <form
                    onSubmit={form_filter_instance.handleSubmit(
                      handleSubmitForm
                    )}
                    noValidate
                    id="form_filter_instance"
                  >
                    {children}
                  </form>
                </FormProvider>
              </div>

              <div className="actions">
                <Grid container justifyContent="flex-end" spacing={2}>
                  <Grid item>
                    <LoadingButton
                      variant="contained"
                      fullWidth
                      color="primary"
                      type="submit"
                      form="form_filter_instance"
                      disabled={!form_filter_instance?.formState?.isValid}
                    >
                      Apply
                    </LoadingButton>
                  </Grid>
                  <Grid item>
                    <LoadingButton
                      variant="contained"
                      fullWidth
                      color="secondary"
                      onClick={() => handleClearForm()}
                    >
                      Clear
                    </LoadingButton>
                  </Grid>
                </Grid>
              </div>
            </div>
          </PopperContent>
        </Popover>
      </div>
    );
  }
);

export default TableFilter2;

const PopperContent = styled(Paper)`
  .popper-content {
    display: grid;
    grid-gap: 0.5em;
    grid-auto-rows: auto 1fr auto;
    .filter-title {
      padding: 1em 2em;
      font-weight: 600;
      padding-bottom: 0;
    }

    .content {
      /* margin-top: 1em; */
      padding: 1em 2em;
    }

    .actions {
      background-color: #fafafa;
      padding: 0.5em 2em;
      align-self: end;
    }
  }
`;
