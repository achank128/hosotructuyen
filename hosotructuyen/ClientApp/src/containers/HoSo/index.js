import React, { useState, useEffect } from "react";
import {
  Alert,
  Col,
  Drawer,
  Input,
  message,
  Row,
  Space,
  Spin,
  Table,
  Timeline,
  Tooltip,
  Typography,
} from "antd";
import {
  BarChartOutlined,
  FolderOutlined,
  SearchOutlined,
  InboxOutlined,
  PlusOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  FolderOpenFilled,
  HistoryOutlined,
} from "@ant-design/icons";
import Button from "antd-button-color";
import Highlighter from "react-highlight-words";
import { NavLink, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import Axios from "axios";
import Login from "../Login";
import {
  colors,
  config,
  notify,
  listUserRole,
} from "../../utils";
import { CSVLink } from "react-csv";

const { Title, Text } = Typography;

function HoSo({ token, userInfo }) {
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [hoso, setHoso] = useState([]);
  const [hosoFiltered, setHosoFiltered] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  let searchInput;

  const showError = () => {
    message.error(notify.errorApi);
  };

  async function getHoSo(loadTableOnly = false) {
    let urlGetHoSo = "";
    if (listUserRole.nghienCuuSinh.includes(userInfo.Role)) {
      urlGetHoSo = config.baseUrl + "/api/hoso/user/" + userInfo.UserId;
    } else if (listUserRole.admin.includes(userInfo.Role)) {
      urlGetHoSo = config.baseUrl + "/api/hoso/admin";
    } else if (listUserRole.reviewer.includes(userInfo.Role)) {
      urlGetHoSo = config.baseUrl + "/api/hoso/reviewer/" + userInfo.UserId;
    }
    setTableLoading(true);
    if (loadTableOnly !== true) setLoading(true);
    await Axios({
      method: "GET",
      url: urlGetHoSo,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        console.debug('getHoSo res', res);
        let _data = res.data.filter(item => !(item.ParentId != null && item.ParentId.length > 0));
        _data.forEach(item => {
          item.hoSoList = res.data
            .filter(rel => rel.HoSoId === item.HoSoId || rel.ParentId === item.HoSoId)
            .sort((a, b) => a.LanBoSung - b.LanBoSung);
          // Phục vụ sắp xếp
          item.ThoiGianTaoHoSo = item.hoSoList[item.hoSoList.length - 1].ThoiGianTaoHoSo;
          item.NgayTaoHoSo = item.hoSoList[item.hoSoList.length - 1].NgayTaoHoSo;
        });
        try {
          _data.sort((a, b) => b.ThoiGianTaoHoSo.localeCompare(a.ThoiGianTaoHoSo));
        } catch (ex) {
          console.debug('getHoSo sort by ThoiGianTaoHoSo', ex);
        }
        setHoso(_data);
        setHosoFiltered(_data);
        setTableLoading(false);
        setLoading(false);
      })
      .catch((ex) => {
        console.debug('getHoSo error', ex);
        setTableLoading(false);
        setLoading(false);
        showError();
      });
  }

  // Lịch sử hồ sơ
  const [isLichSuVisible, setIsLichSuVisible] = useState(false);
  const [loadingLichSu, setLoadingLichSu] = useState(false);
  const [lichSuHoSo, setLichSuHoSo] = useState([]);
  function showLichSuHoSo(hoSoId) {
    setIsLichSuVisible(true);
    getLichSuHoSo(hoSoId);
  }
  function hideLichSuHoSo() {
    setIsLichSuVisible(false);
    setLichSuHoSo([]);
  }
  async function getLichSuHoSo(hoSoId) {
    setLoadingLichSu(true);
    await Axios({
      method: "GET",
      url: "/api/hoso/" + hoSoId + "/history",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((result) => {
        setLichSuHoSo(result.data);
        setLoadingLichSu(false);
      })
      .catch(() => {
        setLoadingLichSu(false);
        showError();
      });
  }

  useEffect(() => {
    if (token && userInfo) {
      getHoSo();
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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleFilterTrangThai = (trangThai) => {
    if (trangThai.length > 0) {
      setHosoFiltered(hoso.filter(hs => hs.TrangThai === trangThai || hs.hoSoList.filter(rel => rel.TrangThai === trangThai).length > 0));
    } else {
      setHosoFiltered(hoso);
    }
  };

  var countByTrangThai = (trangThai) => {
    if (trangThai.length > 0) {
      return hoso.filter(hs => hs.TrangThai === trangThai || hs.hoSoList.filter(rel => rel.TrangThai === trangThai).length > 0).length || 0;
    } else {
      return hoso.length || 0;
    }
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

  const columnsHoSo = [
    {
      title: <b>Tên đề tài</b>,
      dataIndex: "TenDeTai",
      width: "40%",
      ...getColumnSearchProps("TenDeTai"),
      //render: (TenDeTai, row) => (
      //<NavLink
      //  to={{
      //    pathname: "/ho-so/" + row.HoSoId,
      //  }}
      //>
      //  {TenDeTai}
      //</NavLink>
      //<Typography.Link>{TenDeTai}</Typography.Link>
      //),
    },
    {
      title: <b>Mã số đề tài</b>,
      dataIndex: "MaSoDeTai",
      ...getColumnSearchProps("MaSoDeTai"),
    },
    {
      title: <b>Tên viết tắt</b>,
      dataIndex: "TenVietTat",
      ...getColumnSearchProps("TenVietTat"),
    },
    //{
    //  title: <b>Loại hồ sơ</b>,
    //  dataIndex: "LoaiHoSo",
    //  filters: [
    //    {
    //      text: "Nộp ban đầu",
    //      value: "Nộp ban đầu",
    //    },
    //    {
    //      text: "Nộp bổ sung",
    //      value: "Nộp bổ sung",
    //    },
    //  ],
    //  onFilter: (value, record) => record.LoaiHoSo.indexOf(value) === 0,
    //},
    {
      title: <b>Loại đề tài</b>,
      dataIndex: "LoaiDeTai",
      filters: [
        {
          text: "Thử nghiệm lâm sàng",
          value: "Thử nghiệm lâm sàng",
        },
        {
          text: "Nghiên cứu quan sát",
          value: "Nghiên cứu quan sát",
        },
        {
          text: "Khác",
          value: "Khác",
        },
      ],
      onFilter: (value, record) => record.LoaiDeTai.indexOf(value) === 0,
    },
    //{
    //  title: <b>Ngày nộp online</b>,
    //  dataIndex: "NgayTaoHoSo",
    //},
    //{
    //  title: <b>Ngày nộp hồ sơ giấy</b>,
    //  dataIndex: "NgayNopHoSoGiay",
    //},
    //{
    //  title: <b>Trạng Thái</b>,
    //  dataIndex: "TrangThai",
    //  filters: [
    //    {
    //      text: "Chờ xét duyệt",
    //      value: "Chờ xét duyệt",
    //    },
    //    {
    //      text: "Đang xét duyệt",
    //      value: "Đang xét duyệt",
    //    },
    //    {
    //      text: "Chấp thuận thông qua",
    //      value: "Chấp thuận thông qua",
    //    },
    //    {
    //      text: "Chấp thuận thông qua có chỉnh sửa",
    //      value: "Chấp thuận thông qua có chỉnh sửa",
    //    },
    //    {
    //      text: "Đề nghị sửa chữa để xét duyệt lại",
    //      value: "Đề nghị sửa chữa để xét duyệt lại",
    //    },
    //    {
    //      text: "Không chấp thuận",
    //      value: "Không chấp thuận",
    //    },
    //  ],
    //  onFilter: (value, record) => record.TrangThai.indexOf(value) === 0,
    //},
  ];

  const columnsHoSoChildren = [
    {
      title: <b>Loại hồ sơ</b>,
      dataIndex: "LoaiHoSo",
    },
    {
      title: <b>Lần bổ sung</b>,
      dataIndex: "LanBoSung",
    },
    {
      title: <b>Ngày nộp online</b>,
      dataIndex: "NgayTaoHoSo",
    },
    {
      title: <b>Ngày nộp hồ sơ giấy</b>,
      dataIndex: "NgayNopHoSoGiay",
      render: (value) => value !== null && value.length > 10 ? moment(value).format("DD-MM-YYYY") : value,
    },
    {
      title: <b>Trạng Thái</b>,
      dataIndex: "TrangThai",
    },
    {
      title: <b></b>,
      dataIndex: "HoSoId",
      render: (HoSoId, row) => (
        <Space size="small">
          <Button
            danger
            icon={<FolderOpenFilled />}
            style={{ fontWeight: "bold" }}
            onClick={() => { history.push("/ho-so/" + HoSoId); }}
          >
            Xem hồ sơ
          </Button>
          {listUserRole.admin.includes(userInfo.Role) && <Button
            icon={<HistoryOutlined />}
            style={{ marginLeft: 10 }}
            onClick={() => showLichSuHoSo(HoSoId) }
          >Lịch sử</Button>}
        </Space>
      ),
    },
  ];

  const hoSoChildrenFooter = (hoSoGoc) => {
    if (userInfo.UserId === hoSoGoc.UserId) {
      return (
        <Space>
          <Button
            type="success"
            icon={<PlusOutlined />}
            className="mr-2"
            onClick={() => history.push("/nop-ho-so-bo-sung/" + hoSoGoc.HoSoId)}
            >
            Nộp bổ sung
          </Button>
          <Button
            type="warning"
            icon={<PlusOutlined />}
            onClick={() => history.push("/nop-ho-so-nghiem-thu/" + hoSoGoc.HoSoId)}
          >
            Nộp Nghiệm thu
          </Button>
        </Space>
      );
    } else {
      return false;
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

  const headers = [
    { label: "Mã hồ sơ", key: "HoSoId" },
    { label: "Tên đề tài", key: "TenDeTai" },
    { label: "Mã đề tài", key: "MaSoDeTai" },
    { label: "Tên viết tắt", key: "TenVietTat" },
    { label: "Nhà tài trợ", key: "NhaTaiTro" },
    { label: "NCV chính", key: "NghienCuuVien" },
    { label: "Giai đoạn thử nghiệm", key: "GiaiDoanThuNghiem" },
    { label: "Thời gian thực hiện", key: "ThoiGianThucHien" },
    { label: "Ngày nộp HS giấy", key: "NgayNopHoSoGiay" },
    { label: "Ngày nộp HS online", key: "NgayTaoHoSo" },
    { label: "Ngày HD chấp thuận", key: "NgayHdddChapThuan" },
    { label: "Loại hồ sơ", key: "LoaiHoSo" },
    { label: "Loại đề tài", key: "LoaiDeTai" },
    { label: "Cơ quan thực hiện", key: "CoQuanThucHien" },
    { label: "Cấp quản lý", key: "CapQuanLy" },
    { label: "Kinh phí dự kiến", key: "KinhPhiDuKien" },
    { label: "Lệ phí", key: "LePhi" },
    { label: "Trạng thái", key: "TrangThai" },
    { label: "File kết quả", key: "FileKetQua" },
    { label: "Mô tả", key: "MoTa" },
  ];
  function renderButtonAction() {
    return (<Space size="small">
      <Tooltip title="Làm mới danh sách"><Button icon={<ReloadOutlined />} onClick={() => { getHoSo(true) }} ></Button></Tooltip>
      {listUserRole.nghienCuuSinh.includes(userInfo.Role) && <NavLink
        to={{
          pathname: "/nop-ho-so",
        }}
      >
        <Button type="primary" icon={<PlusOutlined />}>Nộp hồ sơ mới</Button>
      </NavLink>}
      {listUserRole.admin.includes(userInfo.Role) && <Button type="success" ghost>
        <CSVLink
          data={hoso}
          headers={headers}
          filename={"Ho_so_" + moment().format("DD_MM_YYYY") + ".csv"}
        >
          <FileExcelOutlined /> Xuất báo cáo
        </CSVLink>
      </Button>}
    </Space>
    );
  }

  function renderThongKeItem(title, count, background) {
    return (
      <Col span={4}>
        <Row
          style={{
            padding: 20,
            backgroundColor: background,
            height: 112,
            borderRadius: 5,
            cursor: 'pointer',
          }}
          value={title}
          onClick={() => handleFilterTrangThai(title)}
        >
          <Col>
            <Row>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 5,
                  color: "#fff",
                }}
              >
                {count}
              </Text>
            </Row>
            <Row>
              <Text
                style={{
                  fontSize: 14,
                  color: "#fff",
                }}
              >
                {title}
              </Text>
            </Row>
          </Col>
        </Row>
      </Col>
    );
  }

  function renderThongKe() {
    if (listUserRole.admin.includes(userInfo.Role)) {
      return (
        <Row>
          <Col span={24}>
            <Row>
              <BarChartOutlined
                style={{
                  fontSize: "28px",
                  color: colors.title,
                  marginRight: 10,
                }}
              />
              <Title style={{ color: colors.title }} level={4}>
                QUẢN LÝ THỐNG KÊ
              </Title>
            </Row>
            <Row
              justify="space-between"
              gutter={[20, 20]}
              style={{ marginTop: 10, marginBottom: 20 }}
            >
              <Col span={8}></Col>
              <Col span={8}>
                <Row
                  style={{
                    backgroundColor: colors.title,
                    padding: 20,
                    borderRadius: 5,
                    cursor: 'pointer',
                  }}
                  justify="center"
                  onClick={() => handleFilterTrangThai('')}
                >
                  <Col>
                    <Row justify="center">
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: "bold",
                          marginBottom: 10,
                          color: "#fff",
                        }}
                      >
                        Tổng số hồ sơ
                      </Text>
                    </Row>
                    <Row justify="center">
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#fff",
                        }}
                      >
                        {hoso.length + " hồ sơ"}
                      </Text>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col span={8}></Col>
            </Row>
            <Row style={{ marginBottom: 60 }} gutter={[20, 20]}>
              {renderThongKeItem(
                "Chấp thuận thông qua",
                countByTrangThai("Chấp thuận thông qua") + " hồ sơ",
                "#30A81D"
              )}
              {renderThongKeItem(
                "Chấp thuận thông qua có chỉnh sửa",
                countByTrangThai("Chấp thuận thông qua có chỉnh sửa") + " hồ sơ",
                "#3FBB0E"
              )}
              {renderThongKeItem(
                "Đang xét duyệt",
                countByTrangThai("Đang xét duyệt") + " hồ sơ",
                "#98CD12"
              )}
              {renderThongKeItem(
                "Chờ xét duyệt",
                countByTrangThai("Chờ xét duyệt") + " hồ sơ",
                "#E0DB4D"
              )}
              {renderThongKeItem(
                "Đề nghị sửa chữa để xét duyệt lại",
                countByTrangThai("Đề nghị sửa chữa để xét duyệt lại") + " hồ sơ",
                "#EB8A49"
              )}
              {renderThongKeItem(
                "Không chấp thuận",
                countByTrangThai("Không chấp thuận") + " hồ sơ",
                "#DD5040"
              )}
            </Row>
          </Col>
        </Row>
      );
    }
  }

  // Drawer lịch sử hồ sơ
  function drawerLichSuHoSo() {
    return <Drawer
      title="Lịch sử hồ sơ"
      placement="right"
      width={512}
      className="drawer-responsive"
      visible={isLichSuVisible}
      onClose={hideLichSuHoSo}
    >

      <Spin spinning={loadingLichSu}>
        {lichSuHoSo.length > 0 &&
          <Timeline style={{ paddingTop: 30 }}>
            {lichSuHoSo?.map(ls =>
              <Timeline.Item key={ls.Id}>
                <Text type="secondary"><HistoryOutlined /> {moment(ls.ThoiGian).format("YYYY-MM-DD HH:mm:ss")}</Text>
                <br />
                {ls.Title}
                <br />
                <Text type="secondary">{ls.ChiTiet}</Text>
              </Timeline.Item>
            )}
          </Timeline>
        }
        {lichSuHoSo.length === 0 && <Text type="secondary">Chưa có lịch sử được ghi nhận</Text>}
      </Spin>
    </Drawer>
  }

  return (
    <Col>
      {renderThongKe()}
      <Row justify="space-between">
        <Col>
          <Row>
            <FolderOutlined
              style={{
                fontSize: "28px",
                color: colors.title,
                marginRight: 10,
              }}
            />
            <Title style={{ color: colors.title }} level={4}>
              DANH SÁCH HỒ SƠ
            </Title>
          </Row>
        </Col>
        {renderButtonAction()}
      </Row>
      <Row>
        <Col span={24}>
          <Table
            bordered
            rowKey="HoSoId"
            style={{ width: "100%", marginTop: 10 }}
            columns={columnsHoSo}
            dataSource={hosoFiltered}
            pagination={{ pageSize: 10 }}
            loading={tableLoading}
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
            expandable={{
              expandedRowRender: deTai => (
                <Table
                  bordered
                  columns={columnsHoSoChildren}
                  dataSource={deTai.hoSoList}
                  pagination={false}
                  size="small"
                  footer={() => hoSoChildrenFooter(deTai)}
                />
              ),
              expandRowByClick: true,
            }}
          />
        </Col>
      </Row>
      {drawerLichSuHoSo()}
    </Col>
  );
}

const mapStateToProps = (state) => ({
  token: state.token,
  userInfo: state.userInfo,
});

export default connect(mapStateToProps, null)(HoSo);
