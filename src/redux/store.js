import reducers from "./reducers/index";
import storage from "redux-persist/lib/storage";
import { configureStore, applyMiddleware, compose } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { persistReducer } from "redux-persist";
const composeEnhancers = window.REDUX_DEVTOOLS_EXTENTION_COMPOSE || compose;

const persistConfig = {
  key: "user",
  storage,
  blacklist: ['post']
};
const persistedReducer = persistReducer(
  persistConfig,
  reducers,
  composeEnhancers
);
const Store = configureStore({
  reducer: persistedReducer,
  middleware: (composeEnhancers) => composeEnhancers(applyMiddleware(thunk)),
});
export default Store;