import { combineReducers } from "redux";

import { AppReducer } from "./app";

export default combineReducers({
  app: AppReducer
});
