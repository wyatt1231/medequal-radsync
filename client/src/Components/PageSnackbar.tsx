import { useSnackbar } from "notistack";
import { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootStore } from "../Contexts/Store";

const PageSnackbar = memo(() => {
  const { enqueueSnackbar } = useSnackbar();

  const { message, options } = useSelector(
    (state: RootStore) => state.PageReducer.page_snackbar
  );

  useEffect(() => {
    let mounted = true;

    const triggerSnackbar = () => {
      if (message) {
        if (options) {
          enqueueSnackbar(
            <div dangerouslySetInnerHTML={{ __html: message }} />,
            { ...options }
          );
        } else {
          enqueueSnackbar(
            <div dangerouslySetInnerHTML={{ __html: message }} />
          );
        }
      }
    };

    mounted && triggerSnackbar();
    return () => {
      mounted = false;
    };
  }, [enqueueSnackbar, message, options]);

  return null;
});

export default PageSnackbar;
