import { put, takeLatest, call, select } from "redux-saga/effects";
import { USER_INFO, USER_INFO_SUCCESS, REQUEST_FAILED } from "../actions/type";
import { config } from "../../utils";
import request from "../../utils/request";

const getToken = (state) => state.token;
const getUserId = (state) => state.userId;
const urlUserInfo = `${config.url}/api/users/me`;

function* fetchUserInfo() {
   const token = yield select(getToken);
   const userId = yield select(getUserId);
   const urlApi = urlUserInfo + userId;
   try {
      const response = yield call(request, urlApi, {
         method: "GET",
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
         },
         body: "",
      });
      yield put({ type: USER_INFO_SUCCESS, userInfo: response.data });
   } catch (error) {
      yield put({ type: REQUEST_FAILED, error });
   }
}

export function* watchUserInfo() {
   yield takeLatest(USER_INFO, fetchUserInfo);
}
