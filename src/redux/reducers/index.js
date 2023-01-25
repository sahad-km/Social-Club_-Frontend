import { combineReducers } from "redux";
import { userReducer,postReducer,allUsersReducer,commentReducer, chatUserReducer, themeUserReducer, userTokenReducer} from "./userReducer";

const reducers = combineReducers({
  user: userReducer,
  post: postReducer,
  allUser: allUsersReducer,
  comment: commentReducer,
  chatUser: chatUserReducer,
  isDarkMode: themeUserReducer,
  token: userTokenReducer
});
export default reducers;