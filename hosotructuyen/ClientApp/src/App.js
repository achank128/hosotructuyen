import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {
  Layout,
  Menu,
  Col,
  Row,
  Button,
  Image,
  Typography,
  Popover,
  Badge,
  notification,
  Dropdown,
} from "antd";
import {
  HomeOutlined,
  FolderOutlined,
  UserOutlined,
  ReadOutlined,
  EnvironmentOutlined,
  MailOutlined,
  FileTextOutlined,
  LogoutOutlined,
  CloseCircleTwoTone,
  TeamOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { setToken, setUserInfo } from "./redux/actions";
import { NavLink } from "react-router-dom";
import Axios from "axios";

import Home from "./containers/Home";
import HoSo from "./containers/HoSo";
import XemHoSo from "./containers/HoSo/detail";
import NopHoSo from "./containers/HoSo/create";
import NopHoSoBoSung from "./containers/HoSo/createBoSung";
import HuongDan from "./containers/HuongDan";
import TaiLieu from "./containers/TaiLieu";
import QuanLy from "./containers/QuanLy";
import Login from "./containers/Login";
import Register from "./containers/Login/register";
import HomThu from "./containers/HomThu";
import { config, colors } from "./utils";

import "antd/dist/antd.min.css";
import "antd-button-color/dist/css/style.css";
import "./custom.css";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

function App({ token, userInfo, onSetToken, onSetUserInfo }) {
  const [thongBao, setThongBao] = useState([]);
  const unsafePropsAddress = {
    href: "https://g.page/benhvienk-vn?share",
    target: "_blank",
  };

  function handleLogout() {
    localStorage.setItem("tokenLocal", "");
    localStorage.setItem("userInfoLocal", "");
    onSetToken("");
    onSetUserInfo("");
  }

  async function getThongBao(status) {
    if (userInfo) {
      let urlGetThongBao =
        config.baseUrl + "/api/thongbao/user/" + userInfo.UserId + "/role";
      if (userInfo.Role === "admin") {
        urlGetThongBao = urlGetThongBao + "/admin/0/10";
      } else {
        urlGetThongBao = urlGetThongBao + "/user/0/10";
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
        if (status === "init") {
          showPopupThongBao(res.data);
        }
      });
    }
  }

  async function updateThongBao(id) {
    await Axios({
      method: "PUT",
      url: config.baseUrl + "/api/thongbao",
      data: JSON.stringify({
        ThongBaoId: id,
        TrangThai: "Đã xem",
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then(() => {
      getThongBao("none");
    });
  }

  function showPopupThongBao(notifications) {
    function closeAllNotifications() {
      notification.close("notificationCloser");
      for (let i = 0; i < notifications.length; i++) {
        notification.close("notification" + i);
      }
      //notification.destroy();
    }
    if (notifications.filter((item) => item.TrangThai === "Mới").length > 1) {
      const args = {
        key: "notificationCloser",
        message: (
          <Typography.Link
            style={{ fontSize: 14, fontWeight: "bold", marginTop: 8 }}
            onClick={() => closeAllNotifications()}
          >
            ĐÓNG TẤT CẢ
          </Typography.Link>
        ),
        duration: 0,
        icon: <CloseCircleTwoTone twoToneColor="#1890ff" />,
        onClick: () => closeAllNotifications(),
        onClose: () => closeAllNotifications(),
        style: {overflow: "unset"},
      };
      notification.open(args);
    }
    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].TrangThai === "Mới") {
        const args = {
          key: "notification" + i,
          message: (
            <Typography.Link
              href={"/ho-so/" + notifications[i].HoSoId}
              style={{ fontSize: 14 }}
              onClick={() => updateThongBao(notifications[i].ThongBaoId)}
            >
              <Text>{notifications[i].NoiDung}</Text>
            </Typography.Link>
          ),
          description: (
            <Text style={{ fontSize: 12, color: colors.inputRequire }}>
              {notifications[i].NgayTao}
            </Text>
          ),
          duration: 0,
          onClose: () => {
            updateThongBao(notifications[i].ThongBaoId);
            // Đóng noti "ĐÓNG TẤT CẢ" nếu đóng noti cuối cùng
            if (notifications.length == 2) {
              notification.close("notificationCloser");
            }
          },
        };
        notification.open(args);
      }
    }
  }

  useEffect(() => {
    getThongBao("init"); // Init: Show popup thong bao chi lan dau sau khi load web. Nhung lan sau ("none") khi an xem them ko show popup nua
    if (!token) {
      if (localStorage.getItem("tokenLocal")) {
        onSetToken(localStorage.getItem("tokenLocal"));
        onSetUserInfo(JSON.parse(localStorage.getItem("userInfoLocal")));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function renderAdmin() {
    if (userInfo) {
      if (userInfo.Role === "admin") {
        return (
          <Menu.Item key="1"><Link to="/quan-ly"><TeamOutlined /> Quản lý tài khoản</Link></Menu.Item>
        );
      }
    }
  }
  const accountView = (
    <Menu>
      {renderAdmin()}
      <Menu.Item key="2"><Link to="/tai-khoan"><SolutionOutlined /> Thông tin tài khoản</Link></Menu.Item>
      <Menu.Item key="3"><Link to="/dang-nhap" onClick={() => { handleLogout(); }}><LogoutOutlined /> Đăng xuất</Link></Menu.Item>
    </Menu>
  );

  function renderAccount() {
    if (userInfo) {
      return (
        <Row justify="end" align="middle">
          <NavLink style={{ fontWeight: "bold" }} to="/hom-thu">
            <Button type="link">
              <Badge
                dot={
                  thongBao.filter((item) => item.TrangThai === "Mới").length >
                  0
                }
                size="small"
              >
                <MailOutlined style={{ fontSize: 18, color: "#1890ff" }} />
              </Badge>
            </Button>
          </NavLink>
          <Dropdown overlay={accountView}>
            <Button type="link" style={{ paddingRight: 0 }}>
              <UserOutlined style={{ fontSize: 18 }} />
              <Text
                style={{ marginLeft: 5, fontWeight: "bold", fontSize: 14 }}
              >
                {userInfo.DisplayName.substring(0, 30)}
              </Text>
            </Button>
          </Dropdown>
        </Row>
      );
    } else {
      return (
        <Row justify="end">
          <NavLink
            style={{ marginRight: 20, fontWeight: "bold" }}
            to={{
              pathname: "/dang-nhap",
            }}
          >
            Đăng nhập
          </NavLink>
          <NavLink
            style={{ fontWeight: "bold" }}
            to={{
              pathname: "/tai-khoan",
            }}
          >
            Đăng ký
          </NavLink>
        </Row>
      );
    }
  }

  return (
    <Router>
      <Layout>
        <Header className="header">
          <Row justify="space-between">
            <Col span={19}>
              <Row>
                <Col style={{ marginTop: 10, marginRight: 50 }}>
                  <Image
                    height={45}
                    preview={false}
                    src="/files/imgs/logo-benhvienk.png"
                  />
                </Col>
                <Col>
                  <Menu
                    theme="light"
                    mode="horizontal"
                    defaultSelectedKeys={[
                      window.location.href.includes("/ho-so")
                      || window.location.href.includes("/nop-ho-so")
                        ? "2"
                        : window.location.href.includes("/huong-dan")
                          ? "3"
                          : window.location.href.includes("/tai-lieu")
                            ? "4"
                            : "1"
                    ]}
                  >
                    <Menu.Item key="1" icon={<HomeOutlined />}>
                      <Link to="/" style={{ fontWeight: "bold" }}>
                        Trang chủ
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<FolderOutlined />}>
                      <Link to="/ho-so" style={{ fontWeight: "bold" }}>
                        Hồ sơ
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<ReadOutlined />}>
                      <Link to="/huong-dan" style={{ fontWeight: "bold" }}>
                        Hướng dẫn
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<FileTextOutlined />}>
                      <Link to="/tai-lieu" style={{ fontWeight: "bold" }}>
                        Tài liệu
                      </Link>
                    </Menu.Item>
                  </Menu>
                </Col>
              </Row>
            </Col>
            <Col span={5}>{renderAccount()}</Col>
          </Row>
        </Header>
        <Content className="site-layout">
          <div className="site-layout-background">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/ho-so" component={HoSo} />
              <Route exact path="/ho-so/:id" component={XemHoSo} />
              <Route exact path="/nop-ho-so" component={NopHoSo} />
              <Route exact path="/nop-ho-so-bo-sung/:id" component={NopHoSoBoSung} />
              <Route exact path="/huong-dan" component={HuongDan} />
              <Route exact path="/tai-lieu" component={TaiLieu} />
              <Route exact path="/quan-ly" component={QuanLy} />
              <Route exact path="/dang-nhap" component={Login} />
              <Route exact path="/tai-khoan" component={Register} />
              <Route exact path="/hom-thu" component={HomThu} />
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          <Title style={{ color: colors.title }} level={5}>
            HỘI ĐỒNG ĐẠO ĐỨC BỆNH VIỆN K
          </Title>
          <Col>
            <EnvironmentOutlined style={{ color: colors.title }} />
            <Text style={{ marginLeft: 5 }}>
              <Text strong style={{ color: colors.title }}>
                Cơ sở 1:{" "}
              </Text>
              <a {...unsafePropsAddress}>
                Số 43 Quán Sứ và số 9A - 9B Phan Chu Trinh, Hoàn Kiếm, Hà Nội
              </a>
            </Text>
          </Col>
          <Col>
            <EnvironmentOutlined style={{ color: colors.title }} />
            <Text style={{ marginLeft: 5 }}>
              <Text strong style={{ color: colors.title }}>
                Cơ sở 2:{" "}
              </Text>
              Tựu Liệt, Tam Hiệp, Thanh Trì, Hà Nội
            </Text>
          </Col>
          <Col>
            <EnvironmentOutlined style={{ color: colors.title }} />
            <Text style={{ marginLeft: 5 }}>
              <Text strong style={{ color: colors.title }}>
                Cơ sở 3:{" "}
              </Text>
              Số 30 đường Cầu Bươu, Tân Triều, Thanh Trì, Hà Nội
            </Text>
          </Col>
          <Col>
            <MailOutlined style={{ color: colors.title }} />
            <Text style={{ marginLeft: 5 }}>
              <a href="mailto:hddd@bvk.org.vn">hddd@bvk.org.vn</a>
            </Text>
          </Col>
        </Footer>
        {/* <Footer>
          <Row gutter={[40, 40]}>
            <Col span={6}>
              <Row>
                <Title style={{ color: colors.title }} level={5}>
                  HỘI ĐỒNG ĐẠO ĐỨC BỆNH VIỆN K
                </Title>
              </Row>
              <Row style={{ marginBottom: 10 }}>
                <Col>
                  <EnvironmentOutlined style={{ color: colors.title }} />
                  <Text style={{ marginLeft: 5 }}>
                    Số 43 Quán Sứ (đang sửa chữa) và số 9A - 9B Phan Chu Trinh,
                    Hoàn Kiếm, Hà Nội
                  </Text>
                </Col>
              </Row>
              <Row style={{ marginBottom: 10 }}>
                <Col>
                  <PhoneOutlined style={{ color: colors.title }} />
                  <Text style={{ marginLeft: 5 }}>
                    0904 748 808, 0904 592 017
                  </Text>
                </Col>
              </Row>
              <Row style={{ marginBottom: 10 }}>
                <Col>
                  <MailOutlined style={{ color: colors.title }} />
                  <Text style={{ marginLeft: 5 }}>benhvienk@bvk.org.vn</Text>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row>
                <Title style={{ color: colors.title }} level={5}>
                  CƠ SỞ 1
                </Title>
              </Row>
              <Row style={{ marginBottom: 10 }}>
                <Col>
                  <EnvironmentOutlined style={{ color: colors.title }} />
                  <Text style={{ marginLeft: 5 }}>
                    Số 43 Quán Sứ (đang sửa chữa) và số 9A - 9B Phan Chu Trinh,
                    Hoàn Kiếm, Hà Nội
                  </Text>
                </Col>
              </Row>
              <Row style={{ marginBottom: 10 }}>
                <Col>
                  <PhoneOutlined style={{ color: colors.title }} />
                  <Text style={{ marginLeft: 5 }}>
                    0904 748 808, 0904 592 017
                  </Text>
                </Col>
              </Row>
              <Row style={{ marginBottom: 10 }}>
                <Col>
                  <MailOutlined style={{ color: colors.title }} />
                  <Text style={{ marginLeft: 5 }}>benhvienk@bvk.org.vn</Text>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row>
                <Title style={{ color: colors.title }} level={5}>
                  CƠ SỞ 2
                </Title>
              </Row>
              <Row style={{ marginBottom: 10 }}>
                <Col>
                  <EnvironmentOutlined style={{ color: colors.title }} />
                  <Text style={{ marginLeft: 5 }}>
                    Tựu Liệt, Tam Hiệp, Thanh Trì, Hà Nội
                  </Text>
                </Col>
              </Row>
              <Row style={{ marginBottom: 10 }}>
                <Col>
                  <PhoneOutlined style={{ color: colors.title }} />
                  <Text style={{ marginLeft: 5 }}>0936 238 808</Text>
                </Col>
              </Row>
              <Row style={{ marginBottom: 10 }}>
                <Col>
                  <MailOutlined style={{ color: colors.title }} />
                  <Text style={{ marginLeft: 5 }}>benhvienk@bvk.org.vn</Text>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row>
                <Title style={{ color: colors.title }} level={5}>
                  CƠ SỞ 3
                </Title>
              </Row>
              <Row style={{ marginBottom: 10 }}>
                <Col>
                  <EnvironmentOutlined style={{ color: colors.title }} />
                  <Text style={{ marginLeft: 5 }}>
                    Số 30 đường Cầu Bươu, Tân Triều, Thanh Trì, Hà Nội
                  </Text>
                </Col>
              </Row>
              <Row style={{ marginBottom: 10 }}>
                <Col>
                  <PhoneOutlined style={{ color: colors.title }} />
                  <Text style={{ marginLeft: 5 }}>0904 690 818</Text>
                </Col>
              </Row>
              <Row style={{ marginBottom: 10 }}>
                <Col>
                  <MailOutlined style={{ color: colors.title }} />
                  <Text style={{ marginLeft: 5 }}>benhvienk@bvk.org.vn</Text>
                </Col>
              </Row>
            </Col>
          </Row>
        </Footer> */}
      </Layout>
    </Router>
  );
}

const mapStateToProps = (state) => ({
  token: state.token,
  userInfo: state.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
  onSetToken: (token) => {
    dispatch(setToken(token));
  },
  onSetUserInfo: (userInfo) => {
    dispatch(setUserInfo(userInfo));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
