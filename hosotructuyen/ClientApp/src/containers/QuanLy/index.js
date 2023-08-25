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
  Space,
  Popconfirm,
  DatePicker,
  message,
} from "antd";
import {
  SettingOutlined,
  SearchOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import Axios from "axios";
import Login from "../Login";
import { connect } from "react-redux";
import { config, colors, notify } from "../../utils";
import moment from "moment";

const { Title, Text, Link } = Typography;
const { Option } = Select;
const urlUser = `${config.baseUrl}/api/taikhoan`;

function QuanLy({ token, userInfo }) {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [account, setAccount] = useState([]);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vaiTro, setVaiTro] = useState("");
  const [chucVu, setChucVu] = useState("");
  const [trangThai, setTrangThai] = useState("");
  const [ngayHetHan, setNgayHetHan] = useState("");
  const [userIdEdit, setUserIdEdit] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  let searchInput;
  const showError = () => {
    message.error(notify.errorApi);
  };

  async function getAccount() {
    setLoading(true);
    await Axios({
      method: "GET",
      url: urlUser + "/filter/all",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        setAccount(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        showError();
      });
  }

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
  const onChangeChucVu = (e) => {
    setChucVu(e.target.value);
  };
  const onChangeVaiTro = (e) => {
    setVaiTro(e.target.value);
  };
  function handleChangeRole(value) {
    setRole(value);
  }
  function handleChangeTrangThai(value) {
    setTrangThai(value);
  }
  function handleNgayHetHan(date, dateString) {
    setNgayHetHan(dateString);
  }

  function handleCancel() {
    setIsModalVisible(false);
    setDisplayName("");
    setUsername("");
    setChucVu("");
    setPassword("");
    setVaiTro("");
    setRole("");
    setEmail("");
    setPhone("");
    setTrangThai("");
    setNgayHetHan("");
    setIsEdit(false);
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
      setIsModalVisible(false);
      await Axios({
        method: "POST",
        url: urlUser,
        data: JSON.stringify({
          UserName: username,
          DisplayName: displayName,
          Password: password,
          Role: role,
          Email: email,
          Phone: phone,
          VaiTro: vaiTro,
          ChucVu: chucVu,
          DonViCongTac: "",
          Avatar: "",
          TrangThai: trangThai,
          NgayHetHan: ngayHetHan,
          NgayCapNhat: moment().format("YYYY-MM-DD hh:mm:ss"),
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then(() => {
          getAccount();
          handleCancel();
          message.success("Đã tạo tài khoản mới thành công!");
        })
        .catch(() => {
          showError();
        });
    }
  }

  async function handleUpdateUser() {
    if (username === "" || displayName === "" || role === "") {
      message.error("Vui lòng điền đầy đủ thông tin!");
    } else {
      setIsModalVisible(false);
      await Axios({
        method: "PUT",
        url: urlUser,
        data: JSON.stringify({
          UserId: userIdEdit,
          UserName: username,
          DisplayName: displayName,
          Password: password,
          Role: role,
          Email: email,
          Phone: phone,
          VaiTro: vaiTro,
          ChucVu: chucVu,
          DonViCongTac: "",
          Avatar: "",
          TrangThai: trangThai,
          NgayHetHan: ngayHetHan,
          NgayCapNhat: moment().format("YYYY-MM-DD hh:mm:ss"),
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then(() => {
          getAccount();
          handleCancel();
          message.success("Đã cập nhật tài khoản thành công!");
        })
        .catch(() => {
          showError();
        });
    }
  }

  async function handleDeleteUser(id) {
    setLoading(true);
    await Axios({
      method: "DELETE",
      url: config.baseUrl + "/api/taikhoan/" + id,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then(() => {
        getAccount();
        setLoading(false);
        message.success("Đã xóa tài khoản thành công!");
      })
      .catch(() => {
        setLoading(false);
        showError();
      });
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={"Nhập từ khóa"}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
          >
            Tìm kiếm
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small">
            Bỏ lọc
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columnsAccount = [
    {
      title: <b>Tên hiển thị</b>,
      dataIndex: "DisplayName",
      ...getColumnSearchProps("DisplayName"),
    },
    {
      title: <b>Tên tài khoản</b>,
      dataIndex: "UserName",
      ...getColumnSearchProps("UserName"),
    },
    {
      title: <b>Chức vụ</b>,
      dataIndex: "ChucVu",
    },
    {
      title: <b>Vai trò</b>,
      dataIndex: "VaiTro",
    },
    {
      title: <b>Loại toàn khoản</b>,
      dataIndex: "Role",
      filters: [
        {
          text: "Hội đồng đạo đức",
          value: "reviewer",
        },
        {
          text: "Thư ký",
          value: "admin",
        },
        {
          text: "Học viên",
          value: "hocVien",
        },
        {
          text: "Nghiên cứu viên chính",
          value: "nghienCuuVienChinh",
        },
        {
          text: "Nhà tài trợ",
          value: "nhaTaiTro",
        },
        {
          text: "Khác",
          value: "khac",
        },
      ],
      onFilter: (value, record) => record.Role.indexOf(value) === 0,
      render: (Role) => {
        if (Role === "hocVien") {
          return <Text>Học viên</Text>;
        } else if (Role === "nghienCuuVienChinh") {
          return <Text>Nghiên cứu viên chính</Text>;
        } else if (Role === "nhaTaiTro") {
          return <Text>Nhà tài trợ</Text>;
        } else if (Role === "khac") {
          return <Text>Khác</Text>;
        } else if (Role === "reviewer") {
          return <Text>Hội đồng đạo đức</Text>;
        } else if (Role === "admin") {
          return <Text>Thư ký</Text>;
        }
      },
    },
    {
      title: <b>Trạng Thái</b>,
      dataIndex: "TrangThai",
      filters: [
        {
          text: "Chưa kích hoạt",
          value: "Chưa kích hoạt",
        },
        {
          text: "Đã kích hoạt",
          value: "Đã kích hoạt",
        },
        {
          text: "Tạm khóa",
          value: "Tạm khóa",
        },
      ],
      onFilter: (value, record) => record.TrangThai.indexOf(value) === 0,
    },
    {
      title: <b>Hành động</b>,
      key: "action",
      render: (text, record) => (
        <Row>
          <Link
            style={{ marginRight: 20, fontWeight: "bold" }}
            onClick={() => {
              setIsEdit(true);
              setDisplayName(record.DisplayName);
              setUsername(record.UserName);
              setChucVu(record.ChucVu);
              setVaiTro(record.VaiTro);
              setRole(record.Role);
              setUserIdEdit(record.UserId);
              setEmail(record.Email);
              setPhone(record.Phone);
              setTrangThai(record.TrangThai);
              setNgayHetHan(record.NgayHetHan);
              setIsModalVisible(true);
            }}
          >
            Sửa
          </Link>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa tài khoản này?"
            onConfirm={() => handleDeleteUser(record.UserId)}
            okText="OK"
            cancelText="Thoát"
          >
            <Link style={{ color: "red", fontWeight: "bold" }}>Xóa</Link>
          </Popconfirm>
        </Row>
      ),
    },
  ];

  useEffect(() => {
    if (token) {
      getAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token || !userInfo) {
    return <Login />;
  } else if (userInfo.Role !== "admin") {
    return (
      <Col>
        <Alert
          message="Tài khoản của bạn không có quyền truy cập vào mục này!"
          description="Vui lòng kiểm tra lại trạng thái tài khoản hoặc liên hệ với quản trị để được hỗ trợ."
          type="error"
          showIcon
        />
      </Col>
    );
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

  return (
    <Col>
      <Row justify="space-between">
        <Col>
          <Row>
            <SettingOutlined
              style={{
                fontSize: "28px",
                color: colors.title,
                marginRight: 10,
              }}
            />
            <Title style={{ color: colors.title }} level={4}>
              QUẢN LÝ TÀI KHOẢN
            </Title>
          </Row>
        </Col>
        <Col>
          <Row>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
              Tạo tài khoản
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
                  {isEdit === false
                    ? "Tạo tài khoản mới"
                    : "Chỉnh sửa tài khoản"}
                </Text>
              }
              visible={isModalVisible}
              onOk={() => {
                if (isEdit) {
                  handleUpdateUser();
                } else {
                  handleCreateUser();
                }
              }}
              onCancel={handleCancel}
              okText="Lưu ngay"
              cancelText="Thoát"
              width="50%"
            >
              <Row gutter={[40, 40]}>
                <Col span={12}>
                  <Row justify={"space-between"} align={"middle"}>
                    <Col>
                      <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                        Họ và Tên
                      </Text>
                    </Col>
                    <Col>
                      <Text
                        style={{ fontSize: 13, color: colors.inputRequire }}
                      >
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
                        Loại tài khoản
                      </Text>
                    </Col>
                    <Col>
                      <Text
                        style={{ fontSize: 13, color: colors.inputRequire }}
                      >
                        Bắt buộc
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Select
                      value={role}
                      style={{ width: "100%", marginBottom: 20 }}
                      onChange={handleChangeRole}
                    >
                      <Option value="reviewer">Hội đồng đạo đức</Option>
                      <Option value="admin">Thư ký</Option>
                      <Option value="hocVien">Học viên</Option>
                      <Option value="nghienCuuVienChinh">
                        Nghiên cứu viên chính
                      </Option>
                      <Option value="nhaTaiTro">Nhà tài trợ</Option>
                      <Option value="khac">Khác</Option>
                    </Select>
                  </Row>
                  <Row justify={"space-between"} align={"middle"}>
                    <Col>
                      <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                        Trạng thái
                      </Text>
                    </Col>
                    <Col>
                      <Text
                        style={{ fontSize: 13, color: colors.inputRequire }}
                      >
                        Bắt buộc
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Select
                      value={trangThai}
                      style={{ width: "100%" }}
                      onChange={handleChangeTrangThai}
                    >
                      <Option value="Chưa kích hoạt">Chưa kích hoạt</Option>
                      <Option value="Đã kích hoạt">Đã kích hoạt</Option>
                      <Option value="Tạm khóa">Tạm khóa</Option>
                    </Select>
                  </Row>
                  <Row style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                      Địa chỉ email
                    </Text>
                  </Row>
                  <Row>
                    <Input value={email} onChange={onChangeEmail} />
                  </Row>
                  <Row style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                      Số điện thoại
                    </Text>
                  </Row>
                  <Row>
                    <Input value={phone} onChange={onChangePhone} />
                  </Row>
                </Col>
                <Col span={12}>
                  <Row justify={"space-between"} align={"middle"}>
                    <Col>
                      <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                        Tên đăng nhập
                      </Text>
                    </Col>
                    <Col>
                      <Text
                        style={{ fontSize: 13, color: colors.inputRequire }}
                      >
                        Bắt buộc
                      </Text>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 20 }}>
                    <Input
                      maxLength={30}
                      value={username}
                      onChange={onChangeUsername}
                    />
                  </Row>
                  <Row justify={"space-between"} align={"middle"}>
                    <Col>
                      <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                        Mật khẩu
                      </Text>
                    </Col>
                    <Col>
                      <Text
                        style={{ fontSize: 13, color: colors.inputRequire }}
                      >
                        Bắt buộc
                      </Text>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 20 }}>
                    <Input
                      value={password}
                      onChange={onChangePassword}
                      placeholder={isEdit ? "Không bắt buộc đổi mật khẩu" : ""}
                    />
                  </Row>
                  <Row>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                      Chức vụ
                    </Text>
                  </Row>
                  <Row>
                    <Input value={chucVu} onChange={onChangeChucVu} />
                  </Row>
                  <Row style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                      Vai trò trong hội đồng
                    </Text>
                  </Row>
                  <Row>
                    <Input value={vaiTro} onChange={onChangeVaiTro} />
                  </Row>
                  <Row style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                      Ngày hết hạn
                    </Text>
                  </Row>
                  <Row>
                    <DatePicker
                      style={{ marginBottom: 20, width: "100%" }}
                      onChange={handleNgayHetHan}
                      placeholder={ngayHetHan}
                      format="DD-MM-YYYY"
                      disabled={
                        role === "admin" || role === "reviewer" ? true : false
                      }
                    />
                  </Row>
                </Col>
              </Row>
            </Modal>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            bordered
            rowKey="UserId"
            style={{ width: "100%" }}
            columns={columnsAccount}
            dataSource={account}
            pagination={{ pageSize: 10 }}
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

export default connect(mapStateToProps, null)(QuanLy);
