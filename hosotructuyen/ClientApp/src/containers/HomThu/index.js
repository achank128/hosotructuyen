import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Typography,
  Spin,
  Alert,
  Table,
  Button,
  Modal,
  Select,
  Input,
  Popconfirm,
  message,
} from "antd";
import { MailOutlined, InboxOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import Axios from "axios";
import Login from "../Login";
import { connect } from "react-redux";
import { config, colors, notify } from "../../utils";
import moment from "moment";

const { TextArea } = Input;
const { Title, Text, Link } = Typography;
const { Option } = Select;
const offsetJump = 15;
const urlThongBao = `${config.baseUrl}/api/thongbao`;
const urlUser = `${config.baseUrl}/api/taikhoan`;

function HomThu({ token, userInfo }) {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [thongBao, setThongBao] = useState([]);
  const [offset, setOffset] = useState(0);
  const [tatCa, setTatCa] = useState([]);
  const [hoiDong, setHoiDong] = useState([]);
  const [noiDung, setNoiDung] = useState("");
  const [userSelectRender, setUserSelectRender] = useState([]);
  const [nguoiNhan, setNguoiNhan] = useState([]);
  const [nguoiNhanReply, setNguoiNhanReply] = useState("");

  const showError = () => {
    message.error(notify.errorApi);
  };

  const onChangeNoiDung = (e) => {
    setNoiDung(e.target.value);
  };

  function handleChonNguoiGui(value) {
    const nguoiNhanTmp = [];
    if (value[0] === "Thư ký") {
      nguoiNhanTmp.push(0);
    } else {
      for (let i = 0; i < tatCa.length; i++) {
        for (let j = 0; j < value.length; j++) {
          if (value[j] === tatCa[i].UserName) {
            nguoiNhanTmp.push(tatCa[i].UserId);
          }
        }
      }
    }
    setNguoiNhan(nguoiNhanTmp);
  }

  function handleCancel() {
    setIsModalVisible(false);
    setNguoiNhan([]);
    setNoiDung("");
    setNguoiNhanReply("");
    setIsReply(false);
  }

  function getAllUser() {
    Axios({
      method: "GET",
      url: urlUser + "/filter/all",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then((res) => {
      setTatCa(res.data);
    });
  }

  function getHoiDong() {
    Axios({
      method: "GET",
      url: urlUser + "/filter/reviewer",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then((res) => {
      setHoiDong(res.data);
    });
  }

  async function getThongBao(offsetNum) {
    if (userInfo) {
      let urlGetThongBao =
        config.baseUrl + "/api/thongbao/user/" + userInfo.UserId + "/role";
      if (userInfo.Role === "admin") {
        urlGetThongBao =
          urlGetThongBao + "/admin/" + offsetNum + "/" + offsetJump;
      } else {
        urlGetThongBao =
          urlGetThongBao + "/user/" + offsetNum + "/" + offsetJump;
      }
      await Axios({
        method: "GET",
        url: urlGetThongBao,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then((res) => {
        setThongBao(res.data);
      });
    }
  }

  function handelCreateNotification() {
    var tenNguoiGui = "";
    if (userInfo.Role === "admin") {
      tenNguoiGui = userInfo.DisplayName + " - Thư ký";
    } else if (userInfo.Role === "reviewer") {
      tenNguoiGui = userInfo.DisplayName + " - Hội đồng";
    } else {
      tenNguoiGui = userInfo.DisplayName;
    }
    for (let i = 0; i < nguoiNhan.length; i++) {
      Axios({
        method: "POST",
        url: urlThongBao,
        data: JSON.stringify({
          NguoiTaoId: userInfo.UserId,
          NguoiNhanId: nguoiNhan[i],
          NgayTao: moment().format("DD-MM-YYYY hh:mm:ss"),
          HoSoId: "",
          NoiDung: noiDung,
          LoaiThongBao: "admin",
          TrangThai: "Mới",
          NguoiGui: tenNguoiGui,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then(() => {
        message.success("Gửi thông báo thành công!");
      });
    }
  }

  async function updateThongBao(id) {
    await Axios({
      method: "PUT",
      url: urlThongBao,
      data: JSON.stringify({
        ThongBaoId: id,
        TrangThai: "Đã xem",
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then(() => {
      setOffset(0);
      getThongBao(0, "none");
    });
  }

  async function handleDeleteNotification(id) {
    setLoading(true);
    await Axios({
      method: "DELETE",
      url: urlThongBao + "/" + id,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then(() => {
        getThongBao(0, "none");
        setLoading(false);
        message.success("Đã xóa thông báo thành công!");
      })
      .catch(() => {
        setLoading(false);
        showError();
      });
  }

  const columnsNotification = [
    {
      title: <b>Nội dung</b>,
      dataIndex: "NoiDung",
      width: "50%",
    },
    {
      title: <b>Người gửi</b>,
      dataIndex: "NguoiGui",
    },
    {
      title: <b>Phân loại</b>,
      dataIndex: "LoaiThongBao",
      filters: [
        {
          text: "Hồ sơ",
          value: "hoso",
        },
        {
          text: "Tin nhắn",
          value: "admin",
        },
      ],
      onFilter: (value, record) => record.LoaiThongBao.indexOf(value) === 0,
      render: (LoaiThongBao) => {
        if (LoaiThongBao === "hoso") {
          return <Text>Hồ sơ</Text>;
        } else if (LoaiThongBao === "admin") {
          return <Text>Tin nhắn</Text>;
        }
      },
    },
    {
      title: <b>Trạng thái</b>,
      dataIndex: "TrangThai",
      filters: [
        {
          text: "Mới",
          value: "Mới",
        },
        {
          text: "Đã xem",
          value: "Đã xem",
        },
      ],
      onFilter: (value, record) => record.TrangThai.indexOf(value) === 0,
      render: (TrangThai) => {
        if (TrangThai === "Mới") {
          return <Text>Mới</Text>;
        } else if (TrangThai === "Đã xem") {
          return <Text>Đã xem</Text>;
        }
      },
    },
    {
      title: <b>Thời gian</b>,
      dataIndex: "NgayTao",
    },
    {
      title: <b>Hành động</b>,
      key: "action",
      render: (record) => (
        <Col>
          <Row>
            <Popconfirm
              title="Bạn chắc chắn muốn xóa thông báo này?"
              onConfirm={() => handleDeleteNotification(record.ThongBaoId)}
              okText="OK"
              cancelText="Thoát"
            >
              <Link style={{ color: "red", fontWeight: "bold" }}>Xóa</Link>
            </Popconfirm>
            {record.HoSoId === "" ? (
              <Link
                style={{ fontWeight: "bold", marginLeft: 10 }}
                onClick={() => {
                  setNguoiNhanReply(record.NguoiGui);
                  setIsReply(true);
                  setNguoiNhan([record.NguoiTaoId]);
                  setNoiDung(record.NoiDung + " => Trả lời: ");
                  setIsModalVisible(true);
                }}
              >
                Trả lời
              </Link>
            ) : (
              <NavLink
                style={{ fontWeight: "bold", marginLeft: 10 }}
                to={{
                  pathname: "/ho-so/" + record.HoSoId,
                }}
              >
                Xem
              </NavLink>
            )}
          </Row>
          <Row>
            {record.TrangThai === "Mới" ? (
              <Link
                style={{ marginTop: 10 }}
                onClick={() => {
                  updateThongBao(record.ThongBaoId);
                }}
              >
                Đánh dấu đã đọc
              </Link>
            ) : (
              <div></div>
            )}
          </Row>
        </Col>
      ),
    },
  ];

  useEffect(() => {
    if (token) {
      getThongBao(0, "init");
      getAllUser();
      getHoiDong();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token || !userInfo) {
    return <Login />;
  } else if (userInfo.TrangThai !== "Đã kích hoạt") {
    return (
      <Col>
        <Alert
          message={notify.requireActive}
          description={notify.requireActiveDescription}
          type="error"
          showIcon
        />
      </Col>
    );
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

  function renderNguoiNhan(role) {
    const userSelect = [];
    if (role === "admin") {
      // userSelect.push(
      //   <Option key="TẤT CẢ HỘI ĐỒNG" value="TẤT CẢ HỘI ĐỒNG">
      //     TẤT CẢ HỘI ĐỒNG
      //   </Option>
      // );
      // userSelect.push(
      //   <Option key="TẤT CẢ NGƯỜI NỘP HỒ SƠ" value="TẤT CẢ NGƯỜI NỘP HỒ SƠ">
      //     TẤT CẢ NGƯỜI NỘP HỒ SƠ
      //   </Option>
      // );
      for (let i = 0; i < tatCa.length; i++) {
        userSelect.push(
          <Option key={tatCa[i].UserName} value={tatCa[i].UserName}>
            {tatCa[i].VaiTro === ""
              ? tatCa[i].DisplayName + " (" + tatCa[i].UserName + ")"
              : tatCa[i].DisplayName +
                " (" +
                tatCa[i].UserName +
                ")" +
                " - " +
                tatCa[i].VaiTro}
          </Option>
        );
      }
    } else if (
      role === "user1" ||
      role === "user2" ||
      role === "user3" ||
      role === "user4"
    ) {
      userSelect.push(
        <Option key="Thư ký" value="Thư ký">
          Thư ký
        </Option>
      );
    } else if (role === "reviewer") {
      for (let i = 0; i < hoiDong.length; i++) {
        userSelect.push(
          <Option key={hoiDong[i].UserName} value={hoiDong[i].UserName}>
            {hoiDong[i].VaiTro === ""
              ? hoiDong[i].DisplayName + " (" + hoiDong[i].UserName + ")"
              : hoiDong[i].DisplayName +
                " (" +
                hoiDong[i].UserName +
                ")" +
                " - " +
                hoiDong[i].VaiTro}
          </Option>
        );
      }
    }
    setUserSelectRender(userSelect);
  }

  return (
    <Col>
      <Row justify="space-between">
        <Col>
          <Row>
            <MailOutlined
              style={{
                fontSize: "28px",
                color: colors.title,
                marginRight: 10,
              }}
            />
            <Title style={{ color: colors.title, marginRight: 20 }} level={4}>
              THÔNG BÁO
            </Title>
          </Row>
        </Col>
        <Col>
          <Row>
            {offset === 0 ? (
              <Button
                type="primary"
                style={{ marginRight: 10 }}
                onClick={() => {
                  getThongBao(offset + offsetJump, "none");
                  setOffset(offset + offsetJump);
                }}
              >
                Xem thêm
              </Button>
            ) : (
              <div>
                <Button
                  type="primary"
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    getThongBao(0, "none");
                    setOffset(0);
                  }}
                >
                  Tải lại
                </Button>
                <Button
                  type="primary"
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    getThongBao(offset + offsetJump, "none");
                    setOffset(offset + offsetJump);
                  }}
                >
                  Xem thêm
                </Button>
              </div>
            )}
            <Button
              type="primary"
              onClick={() => {
                renderNguoiNhan(userInfo.Role);
                setIsModalVisible(true);
              }}
            >
              Gửi tin mới
            </Button>
          </Row>
          <Row>
            <Modal
              title={
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: colors.title,
                  }}
                >
                  Gửi tin mới
                </Text>
              }
              visible={isModalVisible}
              onOk={() => {
                handelCreateNotification();
                handleCancel();
              }}
              onCancel={() => handleCancel()}
              okText="Gửi tin"
              cancelText="Thoát"
              width="50%"
            >
              <Col>
                <Row>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Người nhận
                  </Text>
                </Row>
                {isReply ? (
                  <Row style={{ marginBottom: 20 }}>
                    <Text>{nguoiNhanReply}</Text>
                  </Row>
                ) : (
                  <Row style={{ marginBottom: 20 }}>
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: "100%", marginBottom: 20 }}
                      placeholder="Chọn danh sách"
                      onChange={handleChonNguoiGui}
                    >
                      {userSelectRender}
                    </Select>
                  </Row>
                )}
                <Row>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Nội dung tin nhắn
                  </Text>
                </Row>
                <Row>
                  <TextArea
                    style={{ width: "100%" }}
                    showCount
                    maxLength={500}
                    value={noiDung}
                    onChange={onChangeNoiDung}
                  />
                </Row>
              </Col>
            </Modal>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            bordered
            rowKey="ThongBaoId"
            style={{ width: "100%" }}
            columns={columnsNotification}
            dataSource={thongBao}
            pagination={false}
            locale={{
              emptyText: (
                <span>
                  <InboxOutlined
                    style={{ fontSize: "36px", color: colors.boder }}
                  />
                  <Title level={5} style={{ color: colors.boder }}>
                    {notify.emptyData}
                  </Title>
                </span>
              ),
            }}
          />
        </Col>
      </Row>
    </Col>
  );
}

const mapStateToProps = (state) => ({
  token: state.token,
  userInfo: state.userInfo,
});

export default connect(mapStateToProps, null)(HomThu);
