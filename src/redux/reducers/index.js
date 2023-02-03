import { combineReducers } from "redux";
import { userReducer,postReducer,allUsersReducer,commentReducer, chatUserReducer, themeUserReducer, userTokenReducer, pageNoReducer} from "./userReducer";

const reducers = combineReducers({
  user: userReducer,
  post: postReducer,
  allUser: allUsersReducer,
  comment: commentReducer,
  chatUser: chatUserReducer,
  isDarkMode: themeUserReducer,
  token: userTokenReducer,
  page: pageNoReducer
});
export default reducers;