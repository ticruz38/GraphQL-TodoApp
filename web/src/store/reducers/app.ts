import { SWITCH_COLOR, SWITCH_LANG } from "../actions";

export const initialState = {
  color: "green",
  lang: "en"
};

export type AppState = {
  color: "green" | "red" | "blue" | string;
  lang: "en" | "de" | "fr" | string;
};

export const AppReducer = (state: AppState = initialState, action) => {
  switch (action.type) {
    case SWITCH_COLOR:
      return {
        ...state,
        color: action.color
      };
    case SWITCH_LANG:
      return {
        ...state,
        lang: action.lang
      };
    default:
      return state;
  }
};
