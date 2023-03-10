import { ActionTypes } from "../constants/action-types";
const intialState = {
  user: null,
};


export const userReducer = (state = intialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_USER:
      return { ...state, user: payload };
    case ActionTypes.FOLLOW_USER:
      return {...state, user: {...state.user, following: [...state.user.following, payload] }} 
    case ActionTypes.UNFOLLOW_USER:
      return {...state, user: {...state.user, following: [...state.user.following.filter((personId)=>personId!==payload)] }}
    case ActionTypes.LOGOUT:
      return { user: null};
    default:
      return state;
  }
};

export const allUsersReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_ALL_USERS:
      return { ...state, allUsers: payload };  
    case ActionTypes.LOGOUT:
      return { allUsers: null};
    default:
      return state;
  }
};

export const commentReducer = (state = {}, { type, payload}) => {
  switch (type) {
    case ActionTypes.SET_COMMENT:
      return { ...state, comment: payload}; 
    case ActionTypes.ADD_COMMENT:
      return{ ...state, comment: [payload, ...state.comment]};
    case ActionTypes.LOGOUT:
      return { comment: null};
    default:
      return state;  
  }
};

export const postReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_TIMELINE_POSTS:
      return { ...state, post: payload };
    case ActionTypes.UPLOAD_POST:
      return { ...state, post: [payload, ...state.post]};
    case ActionTypes.DELETE_POST:
      return { ...state, post: [...state.post.filter((post)=>post._id!==payload)]};
    case ActionTypes.EDIT_POST:
      return { ...state, post: state.post.map(object => {if (object._id === payload.id) {return {...object, caption: payload.caption};}return object;})};
    case ActionTypes.LOGOUT:
      return { post: null};
    default:
      return state;
  }
};

export const pageNoReducer = (state = {}, {type, payload}) => {
  switch (type) {
    case ActionTypes.SET_PAGE:
      return {...state, page: payload};
    default:
      return state;
  }
}

export const chatUserReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_CHAT_USER:
      return { ...state, chatUser: [...state.chatUser, payload]};
    case ActionTypes.LOGOUT:
      return { chatUser: null};
    default:
      return state;  
  }
};

export const themeUserReducer = (state = false, { type}) => {
  switch (type) {
    case ActionTypes.SET_THEME_ACTION:
      return !state;
    default:
      return state;  
  }
};

export const userTokenReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_TOKEN:
      return { ...state, token: payload};
    case ActionTypes.LOGOUT:
      return { token: null};
    default:
      return state;  
  }
};