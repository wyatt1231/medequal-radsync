import { PageReducerModel, PageReducerTypes } from "../Types/PageTypes";

const defaultState: PageReducerModel = {
  page_links: [],
  page_confirmation: {
    open: false,
  },

  page_prompt: {
    open: false,
    custom_title: null,
    custom_subtitle: null,
    continue_callback: () => null,
    close_callback: () => null,
  },
  page_loading: {
    show: false,
    message: null,
  },
  page_snackbar: {
    message: null,
  },

  page_sideouts: [],
};

const PageReducer = (state: PageReducerModel = defaultState, action: PageReducerTypes): PageReducerModel => {
  switch (action.type) {
    case "set_page_links": {
      return {
        ...state,
        page_links: action.page_links,
      };
    }

    case "set_page_confirmation": {
      return {
        ...state,
        page_confirmation: action.page_confirmation,
      };
    }

    case "SET_PAGE_PROMPT":
      return { ...state, page_prompt: action.page_prompt };
    case "SET_PAGE_LOADING":
      return {
        ...state,
        page_loading: {
          show: action.page_loading.show,
          message: action.page_loading.message,
        },
      };

    case "SET_PAGE_SNACKBAR":
      return { ...state, page_snackbar: action.page_snackbar };

    case "SET_PAGE_SUCCESS_PROMPT":
      return { ...state, page_success_prompt: action.page_success_prompt };

    case "PUSH_PAGE_SIDEOUT":
      return {
        ...state,
        page_sideouts: [
          ...state.page_sideouts,
          {
            id: state.page_sideouts.length + 1,
            ...action.page_sideout,
          },
        ],
      };

    case "POP_PAGE_SIDEOUT": {
      const sideouts = state.page_sideouts;
      sideouts.pop();

      return { ...state, page_sideouts: sideouts };
    }

    case "SPLICE_PAGE_SIDEOUT": {
      const sideouts = state.page_sideouts;
      const index = sideouts.findIndex((p) => p.id === action.id);

      if (index !== -1) {
        sideouts.splice(index, 1);

        return { ...state, page_sideouts: sideouts };
      } else {
        return state;
      }
    }

    default:
      return state;
  }
};

export default PageReducer;
