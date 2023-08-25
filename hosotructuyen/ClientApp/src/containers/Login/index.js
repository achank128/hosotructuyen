import React, { useState } from "react";
import { Form, Input, Button, Typography, Row, Col, Spin, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { setToken, setUserInfo } from "../../redux/actions";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import { config } from "../../utils";

const { Title } = Typography;
const urlLogin = `${config.baseUrl}/api/taikhoan`;

function Login({ onSetToken, onSetUserInfo }) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const showError = () => {
    message.error(
      "Đã có lỗi xảy ra! Xin vui lòng liên hệ với hội đồng để được hỗ trợ."
    );
  };
  const showErrorLogin = () => {
    message.error(
      "Tên đăng nhập hoặc mật khẩu không đúng! Xin vui lòng kiểm tra lại."
    );
  };

  async function handleLogin(values) {
    if (values.username === undefined || values.password === undefined) {
      message.success("Vui lòng điển đầy đủ thông tin!");
    } else {
      setLoading(true);
      await Axios({
        method: "POST",
        url: urlLogin + "/login",
        data: JSON.stringify({
          UserName: values.username,
          Password: values.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          setLoading(false);
          if (res.status === 200 && res.data.token !== "") {
            onSetUserInfo(res.data.userInfo[0]);
            localStorage.setItem(
              "userInfoLocal",
              JSON.stringify(res.data.userInfo[0])
            );
            onSetToken(res.data.token);
            localStorage.setItem("tokenLocal", res.data.token);
            if (history.location.pathname === "/dang-nhap") {
              history.push("/");
            }
            message.success("Đăng nhập thành công!");
          } else {
            showErrorLogin();
          }
        })
        .catch(() => {
          setLoading(false);
          showError();
        });
    }
  }

  return (
    <Col>
      <Row justify="space-around" align="middle">
        <Col span={9}></Col>
        <Col span={6}>
          <Spin spinning={loading} tip="Đang tiến hành đăng nhập...">
            <Title
              level={2}
              style={{ marginTop: 20, marginBottom: 30, color: "#164397" }}
            >
              Đăng nhập
            </Title>
            <Form
              name="normal_login"
              initialValues={{
                remember: true,
              }}
              onFinish={handleLogin}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên đăng nhập!",
                  },
                ]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Tên đăng nhập" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu!",
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon"/>}
                  type="password"
                  placeholder="Mật khẩu"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  style={{ width: "100%" }}
                  htmlType="submit"
                >
                  Đăng nhập
                </Button>
              </Form.Item>
              <Row justify="space-between">
                <Col>
                  {/* <Link href="/dang-ky">Đăng ký tài khoản</Link> */}
                </Col>
                <Col></Col>
              </Row>
            </Form>
          </Spin>
        </Col>
        <Col span={9}></Col>
      </Row>
    </Col>
  );
}

const mapDispatchToProps = (dispatch) => ({
  onSetToken: (token) => {
    dispatch(setToken(token));
  },
  onSetUserInfo: (userInfo) => {
    dispatch(setUserInfo(userInfo));
  },
});

export default connect(null, mapDispatchToProps)(Login);
