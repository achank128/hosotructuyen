import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";
import { ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider locale={viVN}>
      <App />
    </ConfigProvider>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
