import { OptionsObject } from "notistack";

export interface IPageLink {
  label: string;
  to: string;
}

export interface IPageConfirmation {
  open: boolean;
  continueCallback?: () => void;
  close_callback?: () => void;
  custom_title?: null | string | undefined;
  custom_subtitle?: null | string | undefined;
}

export type PagePromptTypes = {
  open: boolean;
  continue_callback: () => any;
  close_callback?: () => any;
  custom_title?: null | string;
  custom_subtitle?: null | string;
};

export type PageLoadingTypes = {
  show: boolean;
  message?: null | string;
};

export type PageLinkTypes = {
  link: string;
  title: string;
};

export type PageSnackbarTypes = {
  message: null | string;
  options?: OptionsObject;
};

export type PageSuccessPromptTypes = {
  show?: boolean;
  message?: string | number;
  action_buttons?: Array<PageSuccessActionButtonInterface>;
};

export interface PageSuccessActionButtonInterface {
  text: string;
  handleClick: () => any;
  color?: "primary" | "secondary";
}

export type PageReducerTypes =
  | {
      type: "set_page_links";
      page_links: Array<IPageLink>;
    }
  | {
      type: "set_page_confirmation";
      page_confirmation: IPageConfirmation;
    }
  //
  | {
      type: "SET_PAGE_PROMPT";
      page_prompt: PagePromptTypes;
    }
  | {
      type: "SET_PAGE_LOADING";
      page_loading: PageLoadingTypes;
    }
  | {
      type: "SET_PAGE_SNACKBAR";
      page_snackbar: PageSnackbarTypes;
    }
  | {
      type: "SET_PAGE_SUCCESS_PROMPT";
      page_success_prompt: PageSuccessPromptTypes;
    };

export interface PageReducerModel {
  page_links: Array<IPageLink>;
  page_confirmation: IPageConfirmation;

  page_prompt: PagePromptTypes;
  page_loading: PageLoadingTypes;
  page_snackbar: PageSnackbarTypes;
  page_success_prompt?: PageSuccessPromptTypes;
}
