import { REQUEST_FAILED, TOKEN, USER_INFO, USER_INFO_SUCCESS } from "./type";

export const setToken = (token) => ({
  type: TOKEN,
  token,
});

export const requestFailedAction = (error) => ({
  type: REQUEST_FAILED,
  error,
});

export const getUserInfoAction = (userId) => ({
  type: USER_INFO,
  userId,
});
export const setUserInfo = (userInfo) => ({
  type: USER_INFO_SUCCESS,
  userInfo,
});
