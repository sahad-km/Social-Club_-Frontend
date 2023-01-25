import { ActionTypes } from "../constants/action-types";

export const setUser = (data) => {
  return {
    type: ActionTypes.SET_USER,
    payload: data,
  };
};

export const setAlluser = (data) => {
  return {
    type: ActionTypes.SET_ALL_USERS,
    payload: data,
  };
};

export const followUser = (data) => {
  return {
    type: ActionTypes.FOLLOW_USER,
    payload: data,
  };
};

export const unFollowUser = (data) => {
  return {
    type: ActionTypes.UNFOLLOW_USER,
    payload: data,
  }
}

export const setToken = (data) => {
  return {
    type: ActionTypes.SET_TOKEN,
    payload: data,
  }
}

