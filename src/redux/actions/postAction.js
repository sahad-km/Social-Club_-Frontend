import { ActionTypes } from "../constants/action-types";

export const setTimelinePosts = (data) => {
  return {
    type : ActionTypes.SET_TIMELINE_POSTS,
    payload: data
  }
}

export const setUpload = (data) => {
  return {
    type : ActionTypes.UPLOAD_POST,
    payload: data
  }
}
export const setComment = (data) => {
  return {
    type:ActionTypes.SET_COMMENT,
    payload:data
  }
}

export const addComment = (data) => {
  return {
    type: ActionTypes.ADD_COMMENT,
    payload: data
  }
}

export const deletePost = (data) => {
  return {
    type: ActionTypes.DELETE_POST,
    payload: data
  }
}

export const editPost = (data) => {
  return {
    type: ActionTypes.EDIT_POST,
    payload: data
  }
}
