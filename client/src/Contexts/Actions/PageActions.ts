import { Dispatch } from "react";
import { IResponseDto } from "../../Interfaces/ResponseInterfaces";
import {
  IPageConfirmation,
  IPageLink,
  PageReducerTypes,
} from "../Types/PageTypes";

const SetPageLinks =
  (page_links: Array<IPageLink>) =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "set_page_links",
      page_links: page_links,
    });
  };

const SetPageConfirmation =
  (confirmation_settings: IPageConfirmation) =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "set_page_confirmation",
      page_confirmation: confirmation_settings,
    });
  };

const ResetPageConfirmation =
  () => async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "set_page_confirmation",
      page_confirmation: {
        open: false,
        custom_title: null,
        custom_subtitle: null,
        continueCallback: () => null,
        close_callback: () => null,
        // continue_callback: null,
        // close_callback: null,
      },
    });
  };

const SetLoading =
  (is_show: boolean, message?: string) =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: is_show,
        message: message,
      },
    });
  };

const SetPrompt =
  (message: string = ``, type: `success` | `error`) =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "SET_PAGE_SNACKBAR",
      page_snackbar: {
        message: message,
        options: {
          variant: type,
        },
      },
    });
  };

const SetHttpErrorPrompt =
  (error: any) => async (dispatch: Dispatch<PageReducerTypes>) => {
    const response_data: IResponseDto = error?.response?.data;
    dispatch({
      type: "SET_PAGE_SNACKBAR",
      page_snackbar: {
        message: response_data?.message ?? ``,
        options: {
          variant: `error`,
        },
      },
    });
  };

const PageActions = {
  SetPageLinks,
  SetPageConfirmation,
  ResetPageConfirmation,
  SetLoading,
  SetPrompt,
  SetHttpErrorPrompt,
};

export default PageActions;
