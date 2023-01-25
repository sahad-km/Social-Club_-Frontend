import { ActionTypes } from "../constants/action-types";

export const setChatUser = (data) => {
    return {
      type: ActionTypes.SET_CHAT_USER,
      payload: data,
    };
  };