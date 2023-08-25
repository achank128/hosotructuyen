import React, { useState } from "react";
import {
  Input,
  Button,
  Typography,
  Row,
  Col,
  Select,
  Spin,
  Alert,
  message,
} from "antd";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { setUserInfo } from "../../redux/actions";
import Axios from "axios";
import { config, colors, notify } from "../../utils";
import moment from "moment";

const { Title, Text } = Typography;
const { Option } = Select;
const urlUser = `${config.baseUrl}/api/taikhoan`;

function Register({ token, userInfo, onSetUserInfo }) {
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(
    userInfo === "" ? "" : userInfo.UserName
  );
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState(
    userInfo === "" ? "" : userInfo.DisplayName
  );
  const [email, setEmail] = useState(userInfo === "" ? "" : userInfo.Email);
  const [phone, setPhone] = useState(userInfo === "" ? "" : userInfo.Phone);
  const [role, setRole] = useState(userInfo === "" ? "" : userInfo.Role);
  const [ngayHetHan] = useState(userInfo === "" ? "" : userInfo.NgayHetHan);

  const onChangeDisplayName = (e) => {
    setDisplayName(e.target.value);
  };
  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const onChangePhone = (e) => {
    setPhone(e.target.value);
  };
  function handleChangeRole(value) {
    setRole(value);
  }

  function handleCancel() {
    setDisplayName("");
    setUsername("");
    setPassword("");
    setEmail("");
    setPhone("");
  }

  async function getInfoUser() {
    await Axios({
      method: "GET",
      url: config.baseUrl + "/api/taikhoan/" + userInfo.UserId,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then((res) => {
      if (res.status === 200) {
        onSetUserInfo(res.data[0]);
        localStorage.setItem("userInfoLocal", JSON.stringify(res.data[0]));
      }
    });
  }

  if (username === "" && userInfo !== "") {
    setDisplayName(userInfo.DisplayName);
    setUsername(userInfo.UserName);
    setEmail(userInfo.Email);
    setPhone(userInfo.Phone);
    setRole(userInfo.Role);
  }

  async function handleCreateUser() {
    if (
      username === "" ||
      password === "" ||
      displayName === "" ||
      role === ""
    ) {
      message.error("Vui lòng điền đầy đủ thông tin!");
    } else {
      await Axios({
        method: "POST",
        url: urlUser + "/dangky",
        data: JSON.stringify({
          UserName: username,
          DisplayName: displayName,
          Password: password,
          Role: role,
          Email: email,
          Phone: phone,
          Address: "",
          VaiTro: "",
          ChucVu: "",
          Avatar: "",
          NgayHetHan: "",
          NgayCapNhat: moment().format("YYYY-MM-DD hh:mm:ss"),
          TrangThai: "Chưa kích hoạt",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(() => {
          handleCancel();
          history.push("/dang-nhap");
          message.success(
            "Đã tạo tài khoản mới thành công! Xin vui lòng đăng nhập."
          );
        })
        .catch(() => {
          message.error(notify.errorSystem);
        });
    }
  }

  async function handleUpdateUser() {
    if (username === "" || displayName === "") {
      message.error(notify.errorRequired);
    } else {
      setLoading(true);
      await Axios({
        method: "PUT",
        url: urlUser,
        data: JSON.stringify({
          UserId: userInfo.UserId,
          UserName: username,
          DisplayName: displayName,
          Password: password,
          Role: userInfo.Role,
          Email: email,
          Phone: phone,
          Address: "",
          VaiTro: userInfo.VaiTro,
          ChucVu: userInfo.ChucVu,
          Avatar: "",
          NgayHetHan: userInfo.NgayHetHan,
          NgayCapNhat: moment().format("YYYY-MM-DD hh:mm:ss"),
          TrangThai: userInfo.TrangThai,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then(() => {
          getInfoUser();
          setLoading(false);
          message.success("Đã cập nhật tài khoản thành công!");
        })
        .catch(() => {
          setLoading(false);
          message.error(notify.errorApi);
        });
    }
  }

  function renderAction() {
    if (userInfo === "") {
      return (
        <Row style={{ marginTop: 40, marginBottom: 40 }}>
          <Button
            onClick={() => handleCreateUser()}
            style={{ marginRight: 20 }}
            type="primary"
          >
            Đăng ký
          </Button>
          <Button onClick={() => history.push("/")}>Hủy bỏ</Button>
        </Row>
      );
    } else {
      return (
        <Row style={{ marginTop: 40, marginBottom: 40 }}>
          <Button
            onClick={() => handleUpdateUser()}
            style={{ marginRight: 20 }}
            type="primary"
          >
            Cập nhật
          </Button>
          <Button onClick={() => history.goBack()}>Quay lại</Button>
        </Row>
      );
    }
  }

  function renderRole() {
    if (userInfo === "") {
      return (
        <Select
          value={role}
          style={{ width: "100%" }}
          onChange={handleChangeRole}
          disabled={userInfo === "" ? false : true}
        >
          <Option value="user1">Người nộp hồ sơ 1</Option>
          <Option value="user2">Người nộp hồ sơ 2</Option>
          <Option value="user3">Người nộp hồ sơ 3</Option>
          <Option value="user4">Người nộp hồ sơ 4</Option>
        </Select>
      );
    } else if (userInfo.Role === "admin") {
      return <Input value="Thư ký" disabled />;
    } else if (userInfo.Role === "reviewer") {
      return <Input value="Hội đồng đạo đức" disabled />;
    } else if (userInfo.Role === "user1") {
      return <Input value="Người nộp hồ sơ 1" disabled />;
    } else if (userInfo.Role === "user2") {
      return <Input value="Người nộp hồ sơ 2" disabled />;
    } else if (userInfo.Role === "user3") {
      return <Input value="Người nộp hồ sơ 3" disabled />;
    } else if (userInfo.Role === "user4") {
      return <Input value="Người nộp hồ sơ 4" disabled />;
    }
  }

  if (loading) {
    return (
      <Spin tip="Đang tải...">
        <Alert
          message="Đang tải dữ liệu!"
          description="Xin vui lòng chờ trong giây lát..."
          type="info"
        />
      </Spin>
    );
  }

  return (
    <Col>
      <Row justify="space-around" align="middle">
        <Col span={4}></Col>
        <Col span={16}>
          <Title
            level={2}
            style={{ marginTop: 20, marginBottom: 30, color: "#164397" }}
          >
            {userInfo === ""
              ? "Đăng ký tài khoản"
              : "Cập nhật thông tin tài khoản"}
          </Title>
          <Row gutter={[40, 40]}>
            <Col span={12}>
              <Row justify={"space-between"} align={"middle"}>
                <Col>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Họ và Tên
                  </Text>
                </Col>
                <Col>
                  <Text style={{ fontSize: 13, color: colors.inputRequire }}>
                    Bắt buộc
                  </Text>
                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Input
                  maxLength={50}
                  value={displayName}
                  onChange={onChangeDisplayName}
                />
              </Row>
              <Row justify={"space-between"} align={"middle"}>
                <Col>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Mật khẩu
                  </Text>
                </Col>
                <Col>
                  <Text style={{ fontSize: 13, color: colors.inputRequire }}>
                    Bắt buộc
                  </Text>
                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Input
                  value={password}
                  onChange={onChangePassword}
                  placeholder={
                    userInfo === "" ? "" : "Không bắt buộc đổi mật khẩu"
                  }
                />
              </Row>
              <Row>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  Địa chỉ email
                </Text>
              </Row>
              <Row>
                <Input value={email} onChange={onChangeEmail} />
              </Row>
              {userInfo ? (
                <Row style={{ marginTop: 20 }}>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Ngày tài khoản hết hạn
                  </Text>
                  <Input value={ngayHetHan} disabled />
                </Row>
              ) : (
                <div></div>
              )}
            </Col>
            <Col span={12}>
              <Row justify={"space-between"} align={"middle"}>
                <Col>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Tên đăng nhập
                  </Text>
                </Col>
                <Col>
                  <Text style={{ fontSize: 13, color: colors.inputRequire }}>
                    Bắt buộc
                  </Text>
                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Input
                  disabled={userInfo === "" ? false : true}
                  maxLength={30}
                  value={username}
                  onChange={onChangeUsername}
                />
              </Row>
              <Row justify={"space-between"} align={"middle"}>
                <Col>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Loại tài khoản
                  </Text>
                </Col>
                <Col>
                  <Text style={{ fontSize: 13, color: colors.inputRequire }}>
                    Bắt buộc
                  </Text>
                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>{renderRole()}</Row>
              <Row>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  Số điện thoại
                </Text>
              </Row>
              <Row>
                <Input value={phone} onChange={onChangePhone} />
              </Row>
            </Col>
          </Row>
          {renderAction()}
        </Col>
        <Col span={4}></Col>
      </Row>
    </Col>
  );
}

const mapStateToProps = (state) => ({
  token: state.token,
  userInfo: state.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
  onSetUserInfo: (userInfo) => {
    dispatch(setUserInfo(userInfo));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
