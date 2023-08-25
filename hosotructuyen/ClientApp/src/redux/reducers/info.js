import { REQUEST_FAILED, TOKEN, USER_INFO_SUCCESS } from "../actions/type";

const initialToken = "";
const initialUserInfo = "";

export const token = (token = initialToken, action) => {
  switch (action.type) {
    case TOKEN:
      return action.token;
    case REQUEST_FAILED:
      return "";
    default:
      return token;
  }
};

export const userInfo = (userInfo = initialUserInfo, action) => {
  switch (action.type) {
    case USER_INFO_SUCCESS:
      return action.userInfo;
    case REQUEST_FAILED:
      return "";
    default:
      return userInfo;
  }
};
