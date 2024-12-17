import { combineReducers } from "redux";
import ConfigReducer from "./ConfigReducer";
import InpatientReducer from "./InpatientReducer";
import LayoutReducer from "./LayoutReducer";
import LibraryReducer from "./LibraryReducer";
import PageReducer from "./PageReducer";
import StudyReducer from "./StudyReducer";
import UserReducer from "./UserReducer";

const RootReducer = combineReducers({
  UserReducer,
  ConfigReducer,
  LayoutReducer,
  PageReducer,
  InpatientReducer,
  StudyReducer,
  LibraryReducer,
});

export default RootReducer;
