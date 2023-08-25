import { fork } from "redux-saga/effects";

import { watchUserInfo } from "./info";

export default function* rootSaga() {
   yield fork(watchUserInfo);
}
