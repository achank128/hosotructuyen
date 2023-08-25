import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import Axios from "axios";
import { connect } from "react-redux";
import {
  Alert,
  Avatar,
  Checkbox,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  List,
  message,
  Modal,
  Popconfirm,
  Popover,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
  Timeline,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  EyeFilled,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileWordOutlined,
  HistoryOutlined,
  InboxOutlined,
  MinusCircleOutlined,
  PaperClipOutlined,
  PlusCircleOutlined,
  SaveOutlined,
  SendOutlined,
  UndoOutlined,
  UploadOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BellOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import Button from "antd-button-color"
import {
  config,
  notify,
  //info,
  colors,
  listTrangThaiHoSo,
  listLoaiHoSo,
  listLoaiDinhKemView,
  listUserRole,
  listLoaiFileHoSo,
} from "../../utils";
import Login from "../Login";
//import { CSVLink } from "react-csv";

const { Title, Text, Link } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const urlHoSo = `/api/hoso`;
const urlFile = `/api/tailieu`;
const urlThongBao = `/api/thongbao`;
const urlUser = `/api/taikhoan`;

function XemHoSo({ token, userInfo }) {
  let { id } = useParams();
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [loadingXuLy, setLoadingXuLy] = useState(false);
  const [loadingXuLyMsg, setLoadingXuLyMsg] = useState(false);
  const [checkAccess, setCheckAccess] = useState(false);
  const [isShowNhanXet, setIsShowNhanXet] = useState(false);
  const [showLanBoSung, setShowLanBoSung] = useState(true);
  const [hoSo, setHoSo] = useState("");
  const [hoiDong, setHoiDong] = useState([]);
  const [hoiDongView, setHoiDongView] = useState([]);
  const [hoiDongCu, setHoiDongCu] = useState([]);
  const [hoiDongFull, setHoiDongFull] = useState([]);
  const [hoiDongFullId, setHoiDongFullId] = useState([]);
  const [hoiDongFullUserName, setHoiDongFullIdUserName] = useState([]);
  const [nhanXetId, setNhanXetId] = useState([]);
  const [nhanXetCuaToiId, setNhanXetCuaToiId] = useState(0);
  const [ghiChu, setGhiChu] = useState("");
  const [trangThai, setTrangThai] = useState("");
  const [ngayRaQuyetDinh, setNgayRaQuyetDinh] = useState("");
  const [xetDuyetCuaToi, setXetDuyetCuaToi] = useState("");
  const [fileDinhKem, setFileDinhKem] = useState([]);
  const [fileKetQua, setFileKetQua] = useState("");
  const [fileThuKy, setFileThuKy] = useState([]);
  //const [fileBoSung, setFileBoSung] = useState([]);
  //const [fileBoSungView, setFileBoSungView] = useState([]);
  const [fileHoiDongNhanXet, setFileHoiDongNhanXet] = useState([]);
  const [tenFileNhanXetHoiDong, setTenFileNhanXetHoiDong] = useState("");
  const [tenFileNhanXetHoiDongCu, setTenFileNhanXetHoiDongCu] = useState("");
  const [linkHop, setLinkHop] = useState("");
  const [gioHop, setGioHop] = useState("");
  const [nhanXet, setNhanXet] = useState([]);
  const [currentNhanXet, setCurrentNhanXet] = useState([]);
  const [mauNhanXet, setMauNhanXet] = useState("Thử nghiệm lâm sàng");
  const [danhSachKhachMoi, setDanhSachKhachMoi] = useState([]);
  const [danhSachKhachMoiView, setDanhSachKhachMoiView] = useState([]);
  const [danhSachKhachMoiCu, setDanhSachKhachMoiCu] = useState([]);
  const [tatCaUser, setTatCaUser] = useState([]);
  const [tatCaUserId, setTatCaUserId] = useState([]);
  const [tatCaUserName, setTatCaUserName] = useState([]);
  const [filesBienNhan, setFilesBienNhan] = useState([]);
  const [filesBienNhanView, setFilesBienNhanView] = useState([]);
  const [filesGiayBaoNhan, setfilesGiayBaoNhan] = useState([]);
  const [filesGiayBaoNhanView, setfilesGiayBaoNhanView] = useState([]);
  const [visibleModalHop, setVisibleModalHop] = useState(false);
  const [loadingXuatGiayBaoNhan, setLoadingXuatGiayBaoNhan] = useState(false);
  const [loadingXuatFileNhanXet, setLoadingXuatFileNhanXet] = useState(false);
  const [loadingXuatDanhMucHoSo, setLoadingXuatDanhMucHoSo] = useState(false);
  const [ellipsisHoSoTrinhNop, setEllipsisHoSoTrinhNop] = useState(true);
  const [ngayHenDuyetHoSoGiay, setNgayHenDuyetHoSoGiay] = useState("");
  const [ngayDuyetHoSoGiay, setNgayDuyetHoSoGiay] = useState("");
  const [filesKetQuaXetDuyet, setFilesKetQuaXetDuyet] = useState([]);
  const [filesKetQuaXetDuyetView, setFilesKetQuaXetDuyetView] = useState([]);
  // Bảng tài liệu bổ sung
  const [taiLieuBoSungForm] = Form.useForm();

  const showError = (type) => {
    if (type === 'System') {
      message.error(notify.errorSystem);
    } else {
      message.error(notify.errorApi);
    }
  };

  // Link hop
  const unsafePropsRoomMeet = {
    href: hoSo.LinkHop,
    target: "_blank",
  };

  // Form nhan xet cua hoi dong
  const [mau11, setMau11] = useState("");
  const [mau12, setMau12] = useState("");
  const [mau13, setMau13] = useState("");
  const [mau14, setMau14] = useState("");
  const [mau15, setMau15] = useState("");
  const [mau21, setMau21] = useState("");
  const [mau22, setMau22] = useState("");
  const [mau23, setMau23] = useState("");
  const [mau24, setMau24] = useState("");
  const [mau25, setMau25] = useState("");
  const [mau2611, setMau2611] = useState("");
  const [mau2612, setMau2612] = useState("");
  const [mau2613, setMau2613] = useState("");
  const [mau2621, setMau2621] = useState("");
  const [mau2622, setMau2622] = useState("");
  const [mau2623, setMau2623] = useState("");
  const [mau2624, setMau2624] = useState("");
  const [mau2625, setMau2625] = useState("");
  const [mau2631, setMau2631] = useState("");
  const [mau2632, setMau2632] = useState("");
  const [mau2641, setMau2641] = useState("");
  const [mau2642, setMau2642] = useState("");
  const [mau2643, setMau2643] = useState("");
  const [mau2644, setMau2644] = useState("");
  const [mau2651, setMau2651] = useState("");
  const [mau2652, setMau2652] = useState("");
  const [mau2653, setMau2653] = useState("");
  const [mau266, setMau266] = useState("");
  const [mau267, setMau267] = useState("");
  const [mau27, setMau27] = useState("");
  const [mau28, setMau28] = useState("");
  const [mau29, setMau29] = useState("");
  const changeMau11 = (e) => {
    setMau11(e.target.value);
  };
  const changeMau12 = (e) => {
    setMau12(e.target.value);
  };
  const changeMau13 = (e) => {
    setMau13(e.target.value);
  };
  const changeMau14 = (e) => {
    setMau14(e.target.value);
  };
  const changeMau15 = (e) => {
    setMau15(e.target.value);
  };
  const changeMau21 = (e) => {
    setMau21(e.target.value);
  };
  const changeMau22 = (e) => {
    setMau22(e.target.value);
  };
  const changeMau23 = (e) => {
    setMau23(e.target.value);
  };
  const changeMau24 = (e) => {
    setMau24(e.target.value);
  };
  const changeMau25 = (e) => {
    setMau25(e.target.value);
  };
  const changeMau2611 = (e) => {
    setMau2611(e.target.value);
  };
  const changeMau2612 = (e) => {
    setMau2612(e.target.value);
  };
  const changeMau2613 = (e) => {
    setMau2613(e.target.value);
  };
  const changeMau2621 = (e) => {
    setMau2621(e.target.value);
  };
  const changeMau2622 = (e) => {
    setMau2622(e.target.value);
  };
  const changeMau2623 = (e) => {
    setMau2623(e.target.value);
  };
  const changeMau2624 = (e) => {
    setMau2624(e.target.value);
  };
  const changeMau2625 = (e) => {
    setMau2625(e.target.value);
  };
  const changeMau2631 = (e) => {
    setMau2631(e.target.value);
  };
  const changeMau2632 = (e) => {
    setMau2632(e.target.value);
  };
  const changeMau2641 = (e) => {
    setMau2641(e.target.value);
  };
  const changeMau2642 = (e) => {
    setMau2642(e.target.value);
  };
  const changeMau2643 = (e) => {
    setMau2643(e.target.value);
  };
  const changeMau2644 = (e) => {
    setMau2644(e.target.value);
  };
  const changeMau2651 = (e) => {
    setMau2651(e.target.value);
  };
  const changeMau2652 = (e) => {
    setMau2652(e.target.value);
  };
  const changeMau2653 = (e) => {
    setMau2653(e.target.value);
  };
  const changeMau266 = (e) => {
    setMau266(e.target.value);
  };
  const changeMau267 = (e) => {
    setMau267(e.target.value);
  };
  const changeMau27 = (e) => {
    setMau27(e.target.value);
  };
  const changeMau28 = (e) => {
    setMau28(e.target.value);
  };
  const changeMau29 = (e) => {
    setMau29(e.target.value);
  };
  const changeGhiChu = (e) => {
    setGhiChu(e.target.value);
  };

  function handleNgayHenDuyetHoSoGiay(date, dateString) {
    setNgayHenDuyetHoSoGiay(dateString);
  }
  function handleNgayDuyetHoSoGiay(date, dateString) {
    setNgayDuyetHoSoGiay(dateString);
  }
  function handleLinkHop({ target: { value } }) {
    setLinkHop(value);
  }
  function handleGioHop(date, dateString) {
    setGioHop(dateString);
  }
  function handleTrangThai(value) {
    setTrangThai(value);
  }
  function handleNgayRaQuyetDinh(value, dateString) {
    setNgayRaQuyetDinh(dateString);
  }
  function handleXetDuyetCuaToi(value) {
    setXetDuyetCuaToi(value);
  }
  function handleMauNhanXet(value) {
    setMauNhanXet(value);
  }
  function handleXemNhanXet(nhanXetData) {
    setCurrentNhanXet(nhanXetData);
    // Set mẫu hiển thị
    setMauNhanXet(nhanXetData.MauBaoCao);
    // Set data
    setMau21(nhanXetData.Mau21);
    setMau22(nhanXetData.Mau22);
    setMau23(nhanXetData.Mau23);
    setMau24(nhanXetData.Mau24);
    setMau25(nhanXetData.Mau25);
    setMau2611(nhanXetData.Mau2611);
    setMau2612(nhanXetData.Mau2612);
    setMau2613(nhanXetData.Mau2613);
    setMau2621(nhanXetData.Mau2621);
    setMau2622(nhanXetData.Mau2622);
    setMau2623(nhanXetData.Mau2623);
    setMau2624(nhanXetData.Mau2624);
    setMau2625(nhanXetData.Mau2625);
    setMau2631(nhanXetData.Mau2631);
    setMau2632(nhanXetData.Mau2632);
    setMau2641(nhanXetData.Mau2641);
    setMau2642(nhanXetData.Mau2642);
    setMau2643(nhanXetData.Mau2643);
    setMau2644(nhanXetData.Mau2644);
    setMau2651(nhanXetData.Mau2651);
    setMau2652(nhanXetData.Mau2652);
    setMau2653(nhanXetData.Mau2653);
    setMau266(nhanXetData.Mau266);
    setMau267(nhanXetData.Mau267);
    setMau27(nhanXetData.Mau27);
    setMau28(nhanXetData.Mau28);
    setMau29(nhanXetData.Mau29);
    setMau11(nhanXetData.Mau11);
    setMau12(nhanXetData.Mau12);
    setMau13(nhanXetData.Mau13);
    setMau14(nhanXetData.Mau14);
    setMau15(nhanXetData.Mau15);
    // Show modal
    setIsShowNhanXet(true);
  }

  // Chon danh sach hoi dong nhan xet
  function handleChonHoiDong(value) {
    if (value && value.includes("Toàn bộ hội đồng")) {
      setHoiDongView(hoiDongFullUserName);
      setHoiDong(hoiDongFullId);
    } else {
      setHoiDongView(value);
      const hoiDongTmp = [];
      for (let i = 0; i < tatCaUser.length; i++) {
        for (let j = 0; j < value.length; j++) {
          if (value[j] === tatCaUser[i].UserName) {
            hoiDongTmp.push(tatCaUser[i].UserId);
          }
        }
      }
      setHoiDong(hoiDongTmp);
    }
  }

  // Chon danh sach khach moi tham gia cuoc hop
  function handleChonKhachMoi(value) {
    if (value && value.includes("Toàn bộ hội đồng")) {
      setDanhSachKhachMoiView(hoiDongFullUserName);
      setDanhSachKhachMoi(hoiDongFullId);
    } else if (value && value.includes("Tất cả người dùng")) {
      setDanhSachKhachMoiView(tatCaUserName);
      setDanhSachKhachMoi(tatCaUserId);
    } else {
      setDanhSachKhachMoiView(value);
      const khachMoiTmp = [];
      for (let i = 0; i < tatCaUser.length; i++) {
        for (let j = 0; j < value.length; j++) {
          if (value[j] === tatCaUser[i].UserName) {
            khachMoiTmp.push(tatCaUser[i].UserId);
          }
        }
      }
      setDanhSachKhachMoi(khachMoiTmp);
    }
  }

  async function getHoSo() {
    setLoading(true);
    await Axios({
      method: "GET",
      url: config.baseUrl + "/api/hoso/" + id,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        setLoading(false);
        if (
          !listUserRole.admin.includes(userInfo.Role) &&
          !listUserRole.reviewer.includes(userInfo.Role) &&
          userInfo.UserId !== res.data[0].UserId
        ) {
          setCheckAccess(true);
        } else {
          let _hoSoInfo = res.data[0];
          setHoSo(_hoSoInfo);
          setTrangThai(_hoSoInfo.TrangThai);
          setFileKetQua(_hoSoInfo.FileKetQua);
          setLinkHop(_hoSoInfo.LinkHop);
          setGioHop(_hoSoInfo.GioHop);
          setShowLanBoSung(_hoSoInfo.LoaiHoSo === listLoaiHoSo.BoSung);
        }
      })
      .catch(() => {
        setLoading(false);
        showError();
      });
  }

  function getNhanXet() {
    if (listUserRole.admin.includes(userInfo.Role)) {
      Axios({
        method: "GET",
        url: config.baseUrl + "/api/nhanxet/hoso/" + id,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          setNhanXet(res.data);
        })
        .catch(() => {
          showError();
        });
    } else if (listUserRole.reviewer.includes(userInfo.Role)) {
      Axios({
        method: "GET",
        url:
          config.baseUrl +
          "/api/nhanxet/hoso/" +
          id +
          "/user/" +
          userInfo.UserId,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          if (res.data.length > 0) {
            setGhiChu(res.data[0].GhiChu);
            setNhanXetCuaToiId(res.data[0].NhanXetId);
            setCurrentNhanXet(res.data[0]);
            setXetDuyetCuaToi(res.data[0].KetQua);
            setTenFileNhanXetHoiDongCu(res.data[0].FileNhanXet);
            setMauNhanXet(res.data[0].MauBaoCao);
            // set data
            setMau11(res.data[0].Mau11);
            setMau12(res.data[0].Mau12);
            setMau13(res.data[0].Mau13);
            setMau14(res.data[0].Mau14);
            setMau15(res.data[0].Mau15);
            setMau21(res.data[0].Mau21);
            setMau22(res.data[0].Mau22);
            setMau23(res.data[0].Mau23);
            setMau24(res.data[0].Mau24);
            setMau25(res.data[0].Mau25);
            setMau2611(res.data[0].Mau2611);
            setMau2612(res.data[0].Mau2612);
            setMau2613(res.data[0].Mau2613);
            setMau2621(res.data[0].Mau2621);
            setMau2622(res.data[0].Mau2622);
            setMau2623(res.data[0].Mau2623);
            setMau2624(res.data[0].Mau2624);
            setMau2625(res.data[0].Mau2625);
            setMau2631(res.data[0].Mau2631);
            setMau2632(res.data[0].Mau2632);
            setMau2641(res.data[0].Mau2641);
            setMau2642(res.data[0].Mau2642);
            setMau2643(res.data[0].Mau2643);
            setMau2644(res.data[0].Mau2644);
            setMau2651(res.data[0].Mau2651);
            setMau2652(res.data[0].Mau2652);
            setMau2653(res.data[0].Mau2653);
            setMau266(res.data[0].Mau266);
            setMau267(res.data[0].Mau267);
            setMau27(res.data[0].Mau27);
            setMau28(res.data[0].Mau28);
            setMau29(res.data[0].Mau29);
          }
        })
        .catch(() => {
          showError();
        });
    }
  }

  // Danh sach thanh vien hoi dong xu ly và hach moi cua Ho so nay
  function getHoiDong() {
    Axios({
      method: "GET",
      url: config.baseUrl + "/api/hoso/" + id + "/hoidong",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        const hoiDongTmp = [];
        const hoiDongViewTmp = [];
        const khachMoiTmp = [];
        const khachMoiViewTmp = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].PhanLoai === "Hội đồng") {
            hoiDongTmp.push(res.data[i].UserId);
            hoiDongViewTmp.push(res.data[i].UserName);
          } else if (res.data[i].PhanLoai === "Khách mời") {
            khachMoiTmp.push(res.data[i].UserId);
            khachMoiViewTmp.push(res.data[i].UserName);
          }
        }
        setHoiDong(hoiDongTmp);
        setHoiDongCu(hoiDongTmp);
        setHoiDongView(hoiDongViewTmp);
        setDanhSachKhachMoi(khachMoiTmp);
        setDanhSachKhachMoiCu(khachMoiTmp);
        setDanhSachKhachMoiView(khachMoiViewTmp);
      })
      .catch(() => {
        showError();
      });
  }

  // Danh sach tat ca hoi dong
  function getTatCaUser() {
    Axios({
      method: "GET",
      // url: config.baseUrl + "/api/hoso/hoidong",
      url: urlUser + "/filter/all",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        // Lay danh sach tat ca user
        setTatCaUser(res.data);
        setTatCaUserId(res.data.map(x => x.UserId));
        setTatCaUserName(res.data.map(x => x.UserName));

        // Loc ra danh sach hoi dong
        const tatCaHoiDong = res.data.filter(
          (item) => item.Role === "reviewer"
        );
        setHoiDongFull(tatCaHoiDong);
        const hoiDongIdTmp = [];
        const hoiDongUsernameTmp = [];
        for (let i = 0; i < tatCaHoiDong.length; i++) {
          hoiDongIdTmp.push(tatCaHoiDong[i].UserId);
          hoiDongUsernameTmp.push(tatCaHoiDong[i].UserName);
        }
        setHoiDongFullId(hoiDongIdTmp);
        setHoiDongFullIdUserName(hoiDongUsernameTmp);
      })
      .catch(() => {
        showError();
      });
  }

  // Danh sach tat ca file dinh kem
  function getFileDinhKem() {
    Axios({
      method: "GET",
      url: config.baseUrl + "/api/tailieu/hoso/" + id,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        setFileDinhKem(res.data);
      })
      .catch(() => {
        showError();
      });
  }

  // Lịch sử hồ sơ
  const [isLichSuVisible, setIsLichSuVisible] = useState(false);
  const [loadingLichSu, setLoadingLichSu] = useState(false);
  const [lichSuHoSo, setLichSuHoSo] = useState([]);
  function showLichSuHoSo() {
    setIsLichSuVisible(true);
    getLichSuHoSo();
  }
  function hideLichSuHoSo() {
    setIsLichSuVisible(false);
    setLichSuHoSo([]);
  }
  async function getLichSuHoSo() {
    setLoadingLichSu(true);
    await Axios({
      method: "GET",
      url: "/api/hoso/" + id + "/history",
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

  // Các cuộc họp
  const [isListCuocHopVisible, setIsListCuocHopVisible] = useState(false);
  const [loadingListCuocHop, setLoadingListCuocHop] = useState(false);
  const [listCuocHop, setListCuocHop] = useState([]);
  function showListCuocHop() {
    setIsListCuocHopVisible(true);
    getListCuocHop();
  }
  function hideListCuocHop() {
    setIsListCuocHopVisible(false);
    setListCuocHop([]);
  }
  async function getListCuocHop() {
    setLoadingListCuocHop(true);
    await Axios({
      method: "GET",
      url: "/api/hoso/" + id + "/cuocHop",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((result) => {
        let _listHop = result.data;
        setListCuocHop(_listHop);
        let _currentHop = _listHop.find(x => x.IsCurrent === true);
        setCurrentHop(_currentHop);
        setLoadingListCuocHop(false);
      })
      .catch(() => {
        setLoadingListCuocHop(false);
        showError();
      });
  }
  //#region Drawer thêm sửa cuộc họp
  const [isDrawerHopVisible, setIsDrawerHopVisible] = useState(false);
  const [isEditHop, setIsEditHop] = useState(false);
  const [currentHop, setCurrentHop] = useState({});
  const [formHop] = Form.useForm();
  const [loadingFormHop, setLoadingFormHop] = useState(false);
  function addCuocHop() {
    setIsEditHop(false);
    setIsDrawerHopVisible(true);
    formHop.resetFields();
  }
  function editCuocHop(cuocHop) {
    setIsEditHop(true);
    setIsDrawerHopVisible(true);
    setCurrentHop(cuocHop);
    formHop.setFieldsValue({
      CuocHopId: cuocHop.CuocHopId,
      UserId: userInfo.UserId,
      HoSoId: id,
      LinkHop: cuocHop.LinkHop,
      ThoiGian: moment(cuocHop.ThoiGian, "YYYY-MM-DDTHH:mm:ss"),
      ThanhPhan: cuocHop.ThanhPhan !== null && cuocHop.ThanhPhan.includes('[') ? JSON.parse(cuocHop.ThanhPhan) : [],
      IsCurrent: cuocHop.IsCurrent,
    });
  }
  function closeDrawerCuocHop() {
    setIsEditHop(false);
    setIsDrawerHopVisible(false);
    formHop.resetFields();
  }
  async function handleSubmitCuocHop() {
    await formHop
      .validateFields()
      .then(hop => {
        setLoadingFormHop(true);
        let fd = new FormData();
        let cuocHop = {
          CuocHopId: hop.CuocHopId,
          UserId: userInfo.UserId,
          HoSoId: id,
          LinkHop: hop.LinkHop,
          ThoiGian: moment(hop.ThoiGian).format("YYYY-MM-DDTHH:mm:ss"),
          ThanhPhan: JSON.stringify(hop.ThanhPhan),
          IsCurrent: hop.IsCurrent,
        };
        fd.append("cuocHop", JSON.stringify(cuocHop));
        if (hop.FileThuyetTrinh && hop.FileThuyetTrinh.file) fd.append("files", hop.FileThuyetTrinh.file);
        console.debug(hop.FileThuyetTrinh);
        //Files
        Axios({
          method: "POST",
          url: `${urlHoSo}/${id}/cuocHop/` + (isEditHop ? 'update' : 'add'),
          data: fd,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
          .then((result) => {
            if (result.data.Error !== true) {
              setLoadingFormHop(false);
              message.success(result.data.Message);
              closeDrawerCuocHop();
              getListCuocHop();
            } else {
              if (result.data.Code === 500) {
                showError('System');
              } else {
                message.error(result.data.Message);
              }
              setLoading(false);
            }
          })
          .catch((error) => {
            console.debug('submitCuocHop error', error);
            setLoadingFormHop(false);
            showError('Api');
          });
      })
      .catch(info => {
        message.error(notify.errorRequired);
        console.debug('Validate failed:', info);
      });
  }
  async function xoaCuocHop(cuocHop) {
    setLoadingListCuocHop(true);
    await Axios({
      method: "POST",
      url: "/api/hoso/" + id + "/cuocHop/delete?cuocHopId=" + cuocHop.CuocHopId,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((result) => {
        getListCuocHop();
      })
      .catch(() => {
        setLoadingListCuocHop(false);
        showError();
      });
  }
  function handleChonThanPhan(value) {
    if (value && value.includes("Toàn bộ hội đồng")) {
      formHop.setFieldsValue({ ThanhPhan: hoiDongFullId });
    } else if (value && value.includes("Tất cả người dùng")) {
      formHop.setFieldsValue({ ThanhPhan: tatCaUserId });
    }
  }
  //#endregion Drawer thêm sửa cuộc họp

  async function handleUploadFile(category, filePending, onSuccess = function () { }) {
    if (filePending.length > 0) {
      const fd = new FormData();
      for (let i = 0; i < filePending.length; i++) {
        fd.append("files", filePending[i]);
      }
      //fd.append("filesInfo", JSON.stringify([]));
      await Axios.post(
        urlFile + "/hoso/" + id + "/" + category + "/" + userInfo.UserId,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      ).then((result) => {
        if (result.data.Error !== true) {
          setFileThuKy([]);
          //setFileBoSung([]);
          setFileHoiDongNhanXet([]);
          //setFileBoSungView([]);
          setFilesBienNhan([]);
          setFilesBienNhanView([]);
          setFilesKetQuaXetDuyetView([]);
          getFileDinhKem();
          if (category === "biennhan" || category === "giaybaonhan") {
            message.success(result.data.Message);
          }
          onSuccess(result);
        } else {
          message.error(notify.errorUpload);
          console.debug(result);
        }
        setLoading(false);
      }).catch((ex) => {
        console.debug(ex);
        setLoading(false);
        message.error(notify.errorUpload);
      });
    }
  }

  const propsUploadThuKy = {
    name: "file",
    multiple: false,
    listType: "text",
    fileList: fileThuKy,
    beforeUpload(file, fileList) {
      if (file.type !== "application/pdf") {
        message.error("Vui lòng chọn đúng định dạng file PDF!");
      } else if (file.size / 1024 / 1024 > 20) {
        message.error("Vui lòng chỉ gửi file có kích thước dưới 20 MB.");
      } else {
        setFileKetQua(userInfo.UserId + "\\" + file.name);
        setFileThuKy(fileList);
      }
      return file.type === "application/pdf" ? false : Upload.LIST_IGNORE;
    },
    onRemove() {
      setFileKetQua("");
      setFileThuKy([]);
    },
  };
  //const propsUploadBoSung = {
  //  name: "file",
  //  multiple: true,
  //  listType: "text",
  //  fileList: fileBoSungView,
  //  onChange({ fileList }) {
  //    setFileBoSungView(fileList);
  //  },
  //  beforeUpload(file, fileList) {
  //    if (file.type !== "application/pdf") {
  //      message.error("Vui lòng chọn đúng định dạng file pdf!");
  //    } else if (file.size / 1024 / 1024 > 20) {
  //      message.error("Vui lòng chỉ gửi file có kích thước dưới 20 MB.");
  //    } else {
  //      const newList = fileBoSung.concat(fileList);
  //      setFileBoSung(newList);
  //    }
  //    return file.type === "application/pdf" ? false : Upload.LIST_IGNORE;
  //  },
  //  onRemove(file) {
  //    const index = fileBoSungView.indexOf(file);
  //    const newFileList = fileBoSung.slice();
  //    newFileList.splice(index, 1);
  //    setFileBoSung(newFileList);
  //  },
  //};
  const propsUploadHoiDong = {
    name: "file",
    multiple: false,
    listType: "text",
    fileList: fileHoiDongNhanXet,
    beforeUpload(file, fileList) {
      let acceptableType = [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "application/pdf"
      ]
      if (!acceptableType.includes(file.type)) {
        message.error("Vui lòng chọn file PDF hoặc MS WORD!");
      } else if (file.size / 1024 / 1024 > 20) {
        message.error("Vui lòng chỉ gửi file có kích thước dưới 20 MB.");
      } else {
        setTenFileNhanXetHoiDong(file.name);
        setFileHoiDongNhanXet(fileList);
      }
      return file.type === "application/pdf" ? false : Upload.LIST_IGNORE;
    },
    onRemove() {
      setTenFileNhanXetHoiDong("");
      setFileHoiDongNhanXet([]);
    },
  };
  const propsUploadGiayBaoNhan = {
    name: "file",
    multiple: false,
    listType: "text",
    maxCount: 1,
    fileList: filesGiayBaoNhanView,
    onChange({ fileList }) {
      setfilesGiayBaoNhanView(fileList);
    },
    beforeUpload(file, fileList) {
      if (file.type !== "application/pdf") {
        message.error("Vui lòng chọn file có định dạng pdf!");
      } else if (file.size / 1024 / 1024 > 20) {
        message.error("Vui lòng chỉ gửi file có kích thước dưới 20 MB.");
      } else {
        const newList = filesGiayBaoNhan.concat(fileList);
        setfilesGiayBaoNhan(newList);
      }
      return file.type === "application/pdf" ? false : Upload.LIST_IGNORE;
    },
    onRemove(file) {
      const index = filesGiayBaoNhanView.indexOf(file);
      const newFileList = filesGiayBaoNhan.slice();
      newFileList.splice(index, 1);
      setfilesGiayBaoNhan(newFileList);
    },
  };
  const propsUploadBienNhan = {
    name: "file",
    multiple: true,
    listType: "text",
    fileList: filesBienNhanView,
    onChange({ fileList }) {
      setFilesBienNhanView(fileList);
    },
    beforeUpload(file, fileList) {
      if (
        file.type !== "application/pdf" &&
        file.type !== "image/png" &&
        file.type !== "image/jpeg"
      ) {
        message.error("Vui lòng chọn file có định dạng pdf, png hoặc jpg!");
      } else if (file.size / 1024 / 1024 > 20) {
        message.error("Vui lòng chỉ gửi file có kích thước dưới 20 MB.");
      } else {
        const newList = filesBienNhan.concat(fileList);
        setFilesBienNhan(newList);
      }
      return false;
    },
    onRemove(file) {
      const index = filesBienNhanView.indexOf(file);
      const newFileList = filesBienNhan.slice();
      newFileList.splice(index, 1);
      setFilesBienNhan(newFileList);
    },
  };
  const propsUploadKetQuaXetDuyet = {
    name: "file",
    multiple: true,
    maxCount: 2,
    listType: "text",
    fileList: filesKetQuaXetDuyetView,
    onChange({ fileList }) {
      setFilesKetQuaXetDuyetView(fileList);
    },
    beforeUpload(file, fileList) {
      if (
        file.type !== "application/pdf") {
        message.error("Vui lòng chọn đúng định dạng file PDF!");
      } else if (file.size / 1024 / 1024 > 20) {
        message.error("Vui lòng chỉ gửi file có kích thước dưới 20 MB.");
      } else {
        const newList = filesKetQuaXetDuyet.concat(fileList);
        setFilesKetQuaXetDuyet(newList);
      }
      return false;
    },
    onRemove(file) {
      const index = filesKetQuaXetDuyetView.indexOf(file);
      const newFileList = filesKetQuaXetDuyet.slice();
      newFileList.splice(index, 1);
      setFilesKetQuaXetDuyet(newFileList);
    },
  };

  async function handleNhacHop(cuocHop) {
    const loiNhac =
      "Vào lúc " +
      moment(cuocHop.ThoiGian, "YYYY-MM-DDTHH:mm:ss").format("HH:mm DD/MM/YYYY") +
      ", tại địa chỉ " +
      cuocHop.LinkHop +
      " sẽ diễn ra cuộc họp về đề tài: " +
      hoSo.TenDeTai;
    let thanhPhanArray = JSON.parse(cuocHop.ThanhPhan);
    for (let i = 0; i < thanhPhanArray.length; i++) {
      await Axios({
        method: "POST",
        url: urlThongBao,
        data: JSON.stringify({
          NguoiTaoId: userInfo.UserId,
          NguoiNhanId: thanhPhanArray[i],
          NgayTao: moment().format("DD-MM-YYYY HH:mm:ss"),
          HoSoId: hoSo.HoSoId,
          NoiDung: loiNhac,
          LoaiThongBao: "hoso",
          TrangThai: "Mới",
          NguoiGui: userInfo.DisplayName + " - Thư ký Hội đồng",
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
    }
    //for (let i = 0; i < danhSachKhachMoi.length; i++) {
    //  await Axios({
    //    method: "POST",
    //    url: urlThongBao,
    //    data: JSON.stringify({
    //      NguoiTaoId: userInfo.UserId,
    //      NguoiNhanId: danhSachKhachMoi[i],
    //      NgayTao: moment().format("DD-MM-YYYY hh:mm:ss"),
    //      HoSoId: hoSo.HoSoId,
    //      NoiDung: loiNhac,
    //      LoaiThongBao: "hoso",
    //      TrangThai: "Mới",
    //      NguoiGui: userInfo.DisplayName + " - Thư ký",
    //    }),
    //    headers: {
    //      "Content-Type": "application/json",
    //      Authorization: "Bearer " + token,
    //    },
    //  });
    //}
    message.success("Gửi nhắc họp thành công!");
  }

  function handleCreateNotification(nguoiNhan, tinNhan, aiGui) {
    Axios({
      method: "POST",
      url: urlThongBao,
      data: JSON.stringify({
        NguoiTaoId: userInfo.UserId,
        NguoiNhanId: nguoiNhan,
        NgayTao: moment().format("DD-MM-YYYY hh:mm:ss"),
        HoSoId: hoSo.HoSoId,
        NoiDung: tinNhan,
        LoaiThongBao: "hoso",
        TrangThai: "Mới",
        NguoiGui: aiGui,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
  }

  function handleKhachMoi() {
    for (let i = 0; i < danhSachKhachMoi.length; i++) {
      Axios({
        method: "POST",
        url: config.baseUrl + "/api/phancong",
        data: JSON.stringify({
          HoSoId: id,
          UserId: danhSachKhachMoi[i],
          PhanLoai: "Khách mời",
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
    }
  }
  function handleKhachMoiCu() {
    Axios({
      method: "DELETE",
      url: config.baseUrl + "/api/phancong/hoso/" + id + "/kieu/khachmoi",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then(() => {
      handleKhachMoi();
    });
  }

  async function handleHoiDongMoi() {
    setLoading(true);
    for (let i = 0; i < hoiDong.length; i++) {
      await Axios({
        method: "POST",
        url: config.baseUrl + "/api/phancong",
        data: JSON.stringify({
          HoSoId: id,
          UserId: hoiDong[i],
          PhanLoai: "Hội đồng",
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then(() => {
          handleCreateNotification(
            hoiDong[i],
            "Xin hội đồng cho nhận xét về đề tài: " + hoSo.TenDeTai,
            userInfo.DisplayName + " - Thư ký"
          );
        })
        .catch(() => {
          showError();
        });
    }
    setLoading(false);
    message.success("Đã cập nhật hồ sơ thành công!");
  }
  async function handleHoiDongCu() {
    setLoading(true);
    await Axios({
      method: "DELETE",
      url: config.baseUrl + "/api/phancong/hoso/" + id + "/kieu/hoidong",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then(() => {
        setLoading(false);
        handleHoiDongMoi();
      })
      .catch(() => {
        setLoading(false);
        showError();
      });
  }

  async function handleUpdateHoSo() {
    message.loading({ content: 'Đang xử lý...', key: 'loadingXuLy' });
    await Axios({
      method: "PUT",
      url: config.baseUrl + "/api/hoso",
      data: JSON.stringify({
        HoSoId: id,
        TrangThai: trangThai,
        NgayRaQuyetDinh: ngayRaQuyetDinh !== "" ? moment(ngayRaQuyetDinh, "DD-MM-YYYY").format("YYYY-MM-DDTHH:mm:ss") : null,
        FileKetQua: "ketquaxetduyet",
        //LinkHop: linkHop,
        //GioHop: gioHop,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then(() => {
        // Neu ho so da xet duyet xong thi gui thong bao cho Nghien cuu sinh
        if (
          trangThai === "Chấp thuận thông qua" ||
          trangThai === "Chấp thuận thông qua có chỉnh sửa" ||
          trangThai === "Đề nghị sửa chữa để xét duyệt lại" ||
          trangThai === "Không chấp thuận"
        ) {
          handleCreateNotification(
            hoSo.UserId,
            "Đã có kết quả hồ sơ: " + hoSo.TenDeTai,
            "Thư ký"
          );
        }

        // Kiem tra danh sach khach moi co thay doi thi update
        if (
          JSON.stringify(danhSachKhachMoi.sort()) !==
          JSON.stringify(danhSachKhachMoiCu.sort())
        ) {
          handleKhachMoiCu();
        }

        // Kiem tra xem hoi dong co thay doi thi update
        if (
          JSON.stringify(hoiDong.sort()) !== JSON.stringify(hoiDongCu.sort())
        ) {
          handleHoiDongCu();
          //handleHoiDongMoi();
        } else {
          message.success("Đã cập nhật hồ sơ thành công!");
        }
        //handleUploadFile("admin", fileThuKy);
        handleUploadFile(listLoaiFileHoSo.KetQuaXetDuyet, filesKetQuaXetDuyet);
      })
      .then(() => {
        message.destroy('loadingXuLy');
      })
      .catch(() => {
        message.destroy('loadingXuLy');
        showError();
      });
  }

  async function handleGuiNhanXet() {
    setLoading(true);
    if (nhanXetCuaToiId === 0) {
      // Neu nhanXetCuaToiId = 0 nghia la user nay chua nhan xet => tao moi.
      await Axios({
        method: "POST",
        url: config.baseUrl + "/api/nhanxet",
        data: JSON.stringify({
          HoSoId: id,
          UserId: userInfo.UserId,
          GhiChu: ghiChu,
          KetQua: xetDuyetCuaToi,
          FileNhanXet: tenFileNhanXetHoiDong,
          NgayGui: moment().format("DD-MM-YYYY hh:mm"),
          MauBaoCao: mauNhanXet,
          Mau11: mau11,
          Mau12: mau12,
          Mau13: mau13,
          Mau14: mau14,
          Mau15: mau15,
          Mau21: mau21,
          Mau22: mau22,
          Mau23: mau23,
          Mau24: mau24,
          Mau25: mau25,
          Mau2611: mau2611,
          Mau2612: mau2612,
          Mau2613: mau2613,
          Mau2621: mau2621,
          Mau2622: mau2622,
          Mau2623: mau2623,
          Mau2624: mau2624,
          Mau2625: mau2625,
          Mau2631: mau2631,
          Mau2632: mau2632,
          Mau2641: mau2641,
          Mau2642: mau2642,
          Mau2643: mau2643,
          Mau2644: mau2644,
          Mau2651: mau2651,
          Mau2652: mau2652,
          Mau2653: mau2653,
          Mau266: mau266,
          Mau267: mau267,
          Mau27: mau27,
          Mau28: mau28,
          Mau29: mau29,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then(() => {
          getNhanXet();
          setLoading(false);
          message.success("Đã gửi nhận xét thành công!");
        })
        .catch(() => {
          setLoading(false);
          showError();
        });
    } else {
      await Axios({
        method: "PUT",
        url: config.baseUrl + "/api/nhanxet",
        data: JSON.stringify({
          NhanXetId: nhanXetCuaToiId,
          GhiChu: ghiChu,
          KetQua: xetDuyetCuaToi,
          FileNhanXet: tenFileNhanXetHoiDong,
          NgayGui: moment().format("DD-MM-YYYY hh:mm"),
          MauBaoCao: mauNhanXet,
          Mau11: mau11,
          Mau12: mau12,
          Mau13: mau13,
          Mau14: mau14,
          Mau15: mau15,
          Mau21: mau21,
          Mau22: mau22,
          Mau23: mau23,
          Mau24: mau24,
          Mau25: mau25,
          Mau2611: mau2611,
          Mau2612: mau2612,
          Mau2613: mau2613,
          Mau2621: mau2621,
          Mau2622: mau2622,
          Mau2623: mau2623,
          Mau2624: mau2624,
          Mau2625: mau2625,
          Mau2631: mau2631,
          Mau2632: mau2632,
          Mau2641: mau2641,
          Mau2642: mau2642,
          Mau2643: mau2643,
          Mau2644: mau2644,
          Mau2651: mau2651,
          Mau2652: mau2652,
          Mau2653: mau2653,
          Mau266: mau266,
          Mau267: mau267,
          Mau27: mau27,
          Mau28: mau28,
          Mau29: mau29,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then(() => {
          getNhanXet();
          setLoading(false);
          message.success("Đã cập nhật nhận xét thành công!");
        })
        .catch(() => {
          setLoading(false);
          showError();
        });
    }
  }

  // Upload file biên nhận
  async function handleUploadBienNhan() {
    setLoading(true);
    try {
      handleUploadFile("biennhan", filesBienNhan);
    } catch (ex) {
      console.debug(ex);
      setLoading(false);
      showError();
    }
  }

  // Đánh dấu bản cứng
  async function handleMarkHardCopy(e) {
    console.debug(e);
    if (listUserRole.admin.includes(userInfo.Role)) {
      Axios({
        method: "POST",
        url: urlFile + "/hoso/" + id + "/markHardCopy/" + userInfo.UserId,
        data: JSON.stringify({
          TaiLieuId: e.target.value,
          HardCopy: e.target.checked === true,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then((result) => {
        console.debug(result);
        if (result.data.Error !== true) {
          //message.success(result.data.Message);
        } else {
          e.target.checked = false;
          showError('System');
        }
      }).catch((error) => {
        e.target.checked = false;
        console.debug(error);
        showError('Api');
      });
    } else {
      message.error(notify.unauthorized);
    }
  }

  // Duyệt hồ sơ sau khi nộp
  async function handleGuiGiayBaoNhan() {
    if (filesGiayBaoNhan.length === 0) {
      message.warning('Vui lòng đính kèm “Giấy báo nhận”')
    } else {
      message.loading({ content: 'Đang xử lý...', key: 'loadingXuLy' });
      Axios({
        method: "POST",
        url: urlFile + "/hoso/" + id + "/deleteCategoryFiles/" + userInfo.UserId,
        data: JSON.stringify({
          Category: "giaybaonhan",
          HoSoId: id,
          UserId: userInfo.UserId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then((result) => {
        console.debug(result);
        message.destroy('loadingXuLy');
        if (result.data.Error !== true) {
          handleUploadFile("giaybaonhan", filesGiayBaoNhan, function (result) {
            setTimeout(() => {
              window.location.reload();
            }, 500)
          });
        } else {
          showError('System');
        }
      }).catch((error) => {
        console.debug(error);
        message.destroy('loadingXuLy');
        showError('Api');
      });
    }
  }
  // Hẹn ngày duyệt hồ sơ giấy
  async function handleHenDuyetHoSoGiay() {
    if (ngayHenDuyetHoSoGiay === "") {
      message.warning('Vui lòng chọn “Ngày hẹn duyệt hồ sơ giấy”');
    } else {
      message.loading({ content: 'Đang xử lý...', key: 'loadingXuLy' });
      await Axios({
        method: "POST",
        url: urlHoSo + "/" + id + "/henNgayDuyetHoSoGiay/" + userInfo.UserId,
        data: JSON.stringify({
          HoSoId: id,
          NgayHenDuyetHoSoGiay: ngayHenDuyetHoSoGiay ? moment(ngayHenDuyetHoSoGiay, "DD-MM-YYYY").format("YYYY-MM-DDTHH:mm:ss") : "",
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((result) => {
          if (result.data.Error !== true) {
            handleCreateNotification(
              hoSo.UserId,
              `Hồ sơ thuộc đề tài ${hoSo.TenDeTai} đã được hẹn ngày duyệt hồ sơ giấy`,
              "Thư ký"
            );
            // Update hiển thị
            setHoSo({ ...hoSo, NgayHenDuyetHoSoGiay: moment(ngayHenDuyetHoSoGiay, "DD-MM-YYYY").format("YYYY-MM-DDTHH:mm:ss") });
            message.success({ content: result.data.Message, key: 'loadingXuLy' });
          } else {
            if (result.data.Code === 500) {
              message.destroy('loadingXuLy');
              showError('System');
            } else {
              message.error({ content: result.data.Message, key: 'loadingXuLy' });
            }
          }
        })
        .catch(() => {
          message.destroy('loadingXuLy');
          showError();
        });
    }
  }
  // Duyệt hồ sơ giấy
  async function handleDuyetHoSoGiay(isDuyet) {
    if (isDuyet === true && ngayDuyetHoSoGiay === "") {
      message.warning('Vui lòng chọn “Ngày duyệt hồ sơ giấy”');
    } else {
      message.loading({ content: 'Đang xử lý...', key: 'loadingXuLy' });
      await Axios({
        method: "POST",
        url: urlHoSo + "/" + id + "/duyetHoSoGiay/" + userInfo.UserId,
        data: isDuyet === true
          ? JSON.stringify({
            HoSoId: id,
            DuyetHoSoGiay: true,
            NgayDuyetHoSoGiay: moment(ngayDuyetHoSoGiay, "DD-MM-YYYY").format("YYYY-MM-DDTHH:mm:ss"),
          })
          : JSON.stringify({
            HoSoId: id,
            DuyetHoSoGiay: false,
            TrangThai: listTrangThaiHoSo.DeNghiSua,
          }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((result) => {
          message.destroy('loadingXuLy');
          if (result.data.Error !== true) {
            handleUploadFile("giaybaonhan", filesGiayBaoNhan);
            handleCreateNotification(
              hoSo.UserId,
              isDuyet
                ? `Hồ sơ thuộc đề tài ${hoSo.TenDeTai} đã được duyệt hồ sơ giấy để tiến hành xét duyệt`
                : `Hồ sơ thuộc đề tài ${hoSo.TenDeTai} không được duyệt hồ sơ giấy`,
              "Thư ký"
            );
            message.success(result.data.Message);
          } else {
            if (result.data.Code === 500) {
              showError('System');
            } else {
              message.error(result.data.Message);
            }
          }
        })
        .then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 500)
        })
        .catch(() => {
          message.destroy('loadingXuLy');
          showError();
        });
    }
  }
  // Undo duyệt hồ sơ giấy
  async function handleUndoDuyetHoSoGiay() {
    message.loading({ content: 'Đang xử lý...', key: 'loadingXuLy' });
    await Axios({
      method: "POST",
      url: urlHoSo + "/" + id + "/duyetHoSoGiay/" + userInfo.UserId,
      data: JSON.stringify({
        HoSoId: id,
        DuyetHoSoGiay: false,
        TrangThai: listTrangThaiHoSo.ChoDuyet,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((result) => {
        console.debug('handleUndoDuyetHoSoGiay POST success', result);
        message.destroy('loadingXuLy');
        if (result.data.Error !== true) {
          handleCreateNotification(
            hoSo.UserId,
            `Hồ sơ thuộc đề tài ${hoSo.TenDeTai} đã được tiếp tục tiến hành duyệt hồ sơ giấy`,
            "Thư ký"
          );
          message.success(result.data.Message);
        } else {
          if (result.data.Code === 500) {
            showError('System');
          } else {
            message.error(result.data.Message);
          }
        }
      })
      .then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 500)
      })
      .catch(() => {
        message.destroy('loadingXuLy');
        showError();
      });
  }

  useEffect(() => {
    if (token) {
      getHoSo();
      getNhanXet();
      getHoiDong();
      getTatCaUser();
      getFileDinhKem();
      getListCuocHop();
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
  } else if (checkAccess) {
    return (
      <Col>
        <Alert
          message={"Truy cập bị từ chối!"}
          description={"Bạn không có quyền truy cập hồ sơ này."}
          type="error"
          showIcon
        />
      </Col>
    );
  }

  const childrenHoiDong = [];
  for (let i = 0; i < hoiDongFull.length; i++) {
    childrenHoiDong.push(
      <Option key={hoiDongFull[i].UserName} value={hoiDongFull[i].UserName}>
        {hoiDongFull[i].VaiTro === ""
          ? hoiDongFull[i].DisplayName + " (" + hoiDongFull[i].UserName + ")"
          : hoiDongFull[i].DisplayName +
          " (" +
          hoiDongFull[i].UserName +
          ")" +
          " - " +
          hoiDongFull[i].VaiTro}
      </Option>
    );
  }
  const childrenAllUser = [];
  for (let i = 0; i < tatCaUser.length; i++) {
    childrenAllUser.push(
      <Option key={tatCaUser[i].UserName} value={tatCaUser[i].UserName}>
        {tatCaUser[i].VaiTro === ""
          ? tatCaUser[i].DisplayName + " (" + tatCaUser[i].UserName + ")"
          : tatCaUser[i].DisplayName +
          " (" +
          tatCaUser[i].UserName +
          ")" +
          " - " +
          tatCaUser[i].VaiTro}
      </Option>
    );
  }
  const allUserOptions = [];
  for (let i = 0; i < tatCaUser.length; i++) {
    allUserOptions.push(
      <Option key={tatCaUser[i].UserId} value={tatCaUser[i].UserId}>
        {tatCaUser[i].VaiTro === ""
          ? tatCaUser[i].DisplayName + " (" + tatCaUser[i].UserName + ")"
          : tatCaUser[i].DisplayName +
          " (" +
          tatCaUser[i].UserName +
          ")" +
          " - " +
          tatCaUser[i].VaiTro}
      </Option>
    );
  }

  function viewFile(url) {
    setLoadingXuLyMsg(true);
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.setRequestHeader("Authorization", "Bearer " + token);
    oReq.responseType = "blob";
    oReq.onload = function () {
      setLoadingXuLyMsg(false);
      // Once the file is downloaded, open a new window with the PDF
      // Remember to allow the POP-UPS in your browser
      if (oReq.response.type === "application/pdf") {
        const file = new Blob([oReq.response], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
      } else if (oReq.response.type === "image/png") {
        const file = new Blob([oReq.response], { type: "image/png" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
      } else if (oReq.response.type === "image/jpeg") {
        const file = new Blob([oReq.response], { type: "image/jpeg" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
      } else {
        // Trường hợp khác thì coi như không thành công
        message.warning("Không thể xem nhanh file này.");
        console.debug(oReq.response);
      }
    };
    oReq.send();
  }

  function downloadFile(url, fileName) {
    message.loading({ content: 'Đang xử lý...', key: 'loadingXuLy' });
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.setRequestHeader("Authorization", "Bearer " + token);
    oReq.responseType = "blob";
    oReq.onload = function () {
      message.destroy('loadingXuLy');
      const file = new Blob([oReq.response], {});
      const fileURL = URL.createObjectURL(file);
      let tempLink = document.createElement('a');
      tempLink.href = fileURL;
      tempLink.setAttribute('download', fileName);
      tempLink.setAttribute('target', "_blank");
      tempLink.click();
    };
    oReq.send();
  }

  // Event data của upload trong form
  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  // Form List file đính kèm
  function TaiLieuDynamicFormList({ loaiTaiLieu }) {
    const propsUploadTaiLieu = {
      name: "file",
      multiple: false,
      listType: "text",
      //fileList: filesTrinhNopView,
      beforeUpload: (file, fileList) => {
        if (file.type !== "application/pdf") {
          message.error("Vui lòng chọn đúng định dạng file pdf!");
          return Upload.LIST_IGNORE;
        } else if (file.size / 1024 / 1024 > 20) {
          message.error("Vui lòng chỉ gửi file có kích thước dưới 20 MB.");
          return Upload.LIST_IGNORE;
        } else {
          return false;
        }
      }
    };
    return (
      <Form.List key={loaiTaiLieu} name={loaiTaiLieu + "FormList"}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Row key={key} align="top">
                <Col span={1} style={{ textAlign: "center" }}>
                  <Tooltip placement="top" title="Xóa">
                    <Typography.Text type="danger">
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{ marginTop: 8 }}
                      />
                    </Typography.Text>
                  </Tooltip>
                </Col>
                <Col span={8} style={{ paddingRight: 4 }}>
                  <Form.Item
                    {...restField}
                    name={[name, "DocNameVN"]}
                    fieldKey={[fieldKey, "DocNameVN"]}
                    rules={[{ required: true, message: "Thông tin bắt buộc" }]}
                    style={{ marginBottom: 4 }}
                  >
                    <Input placeholder="Tên tài liệu" />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ paddingRight: 4 }}>
                  <Form.Item
                    {...restField}
                    name={[name, "VersionAndDate"]}
                    fieldKey={[fieldKey, "VersionAndDate"]}
                    rules={[{ required: true, message: "Thông tin bắt buộc" }]}
                    style={{ marginBottom: 4 }}
                  >
                    <Input placeholder="Phiên bản/ngày" />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    {...restField}
                    name={[name, "FileData"]}
                    fieldKey={[fieldKey, "FileData"]}
                    rules={[{ required: true, message: "Hãy đính kèm file" }]}
                    style={{ marginBottom: 4 }}
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                  >
                    <Upload {...propsUploadTaiLieu} accept=".pdf" maxCount={1}>
                      <Button icon={<UploadOutlined />}>Tải lên</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col span={0}>
                  <Form.Item
                    {...restField}
                    name={[name, "Category"]}
                    fieldKey={[fieldKey, "Category"]}
                    initialValue={loaiTaiLieu}
                    style={{ marginBottom: 4 }}
                  >
                    <Input type="hidden" />
                  </Form.Item>
                </Col>
              </Row>
            ))}
            <Form.Item style={{ marginTop: 4, marginBottom: 4 }}>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusCircleOutlined />}
              >
                Thêm tài liệu
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    );
  }
  // Upload file với thông tin //TODO: dùng chung
  async function uploadFileWithInfo(hoSoID, category, _fileList, successFunc = function () { }) {
    if (_fileList.length > 0) {
      const fd = new FormData();
      let filesInfo = [];
      for (let i = 0; i < _fileList.length; i++) {
        let currentFile = _fileList[i];
        let currentFileData = currentFile.FileData.shift();
        fd.append("files", currentFileData.originFileObj);
        filesInfo.push({
          FileName: currentFileData.name,
          Category: currentFile.Category,
          DocNameVN: currentFile.DocNameVN,
          DocNameEN: currentFile.DocNameEN,
          VersionAndDate: currentFile.VersionAndDate,
        });
      }
      fd.append("filesInfo", JSON.stringify(filesInfo));
      await Axios.post(
        urlFile + "/hoso/" + hoSoID + "/" + category + "/" + userInfo.UserId,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      ).then((result) => {
        if (result.data.Error !== true) {
          message.success("Nộp tài liệu bổ sung thành công");
          successFunc();
        } else {
          console.debug("uploadFileWithInfo failed", result);
          message.error(notify.errorUpload);
        }
      }).catch(() => {
        message.error(notify.errorUpload);
      });
    }
  }
  // Xử lý data và upload các file tài liệu bổ sung
  function handleUploadFileTaiLieuBoSung() {
    setLoadingXuLy(true);
    let filesArray = [];
    taiLieuBoSungForm
      .validateFields()
      .then((formData) => {
        // Flat các array thành 1 array chung
        filesArray = Object.values(formData).flat();
      })
      .then(() => {
        // Gỡ các item null hoặc undefined
        filesArray = filesArray.filter((x) => {
          return x !== undefined && x !== null;
        });
      })
      .then(() => {
        uploadFileWithInfo(id, "bosung", filesArray, function () {
          //setLoadingXuLy(false);
          setTimeout(() => {
            window.location.reload();
          }, 500)
        });
      })
      .catch((ex) => {
        setLoadingXuLy(false);
        console.debug("Error in handleUploadFileTaiLieuBoSung", ex);
      });
  };

  function renderNghienCuuSinh() {
    if (listUserRole.nghienCuuSinh.includes(userInfo.Role)) {
      return (
        <Row>
          <Col span={24}>
            <Row
              style={{
                marginTop: 20,
                marginBottom: 20,
                marginLeft: -30,
                marginRight: -30,
                borderTopWidth: 20,
                borderTopColor: "#f0f2f5",
                borderTopStyle: "solid",
              }}
            ></Row>
            <Row>
              <Title style={{ color: colors.title }} level={3}>
                Kết quả xét duyệt của hội đồng
              </Title>
            </Row>
            <Row>
              <Title level={5} type="danger"><InfoCircleOutlined style={{ color: "#000" }} /> {hoSo.TrangThai}</Title>
            </Row>
            {hoSo.NgayRaQuyetDinh && <Row>
              <Title level={5}><CalendarOutlined /> Ngày ra quyết định: {moment(hoSo.NgayRaQuyetDinh, "YYYY-MM-DDTHH:mm:ss").format("DD-MM-YYYY")}</Title>
            </Row>}
            {fileDinhKem && fileDinhKem.some(x => x.Category === "ketquaxetduyet") && <>
              <Row>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>File kết quả nhận xét của hội đồng: </Text>
                {/*<Link*/}
                {/*  style={{ marginLeft: 10 }}*/}
                {/*  onClick={() =>*/}
                {/*    viewFile(*/}
                {/*      "/api/tailieu?hoso=" +*/}
                {/*      id +*/}
                {/*      "&user=0&filename=" +*/}
                {/*      hoSo.FileKetQua*/}
                {/*    )*/}
                {/*  }*/}
                {/*>*/}
                {/*  Tải về file kết quả*/}
                {/*</Link>*/}
              </Row>
              {renderAttachedFiles(listLoaiFileHoSo.KetQuaXetDuyet, false)}
            </>
            }
            <Row
              style={{
                marginTop: 20,
                marginBottom: 20,
                marginLeft: -30,
                marginRight: -30,
                borderTopWidth: 20,
                borderTopColor: "#f0f2f5",
                borderTopStyle: "solid",
              }}
            ></Row>
            <Row>
              <Title style={{ color: colors.title }} level={3}>
                Bổ sung tài liệu
              </Title>
            </Row>
            <Row>
              <Form name="TaiLieuBoSungForm" autoComplete="off" form={taiLieuBoSungForm} style={{ width: "100%" }}>
                <TaiLieuDynamicFormList loaiTaiLieu="bosung" />
              </Form>
            </Row>
            <Row style={{ marginTop: 20 }}>
              <Popconfirm
                title="Bạn chắc chắn muốn gửi bổ sung những tài liệu này?"
                onConfirm={() => {
                  handleUploadFileTaiLieuBoSung();
                }}
                okText="OK"
                cancelText="Thoát"
              >
                <Button style={{ marginRight: 10 }} type="primary" icon={<SendOutlined />}>
                  Gửi bổ sung
                </Button>
              </Popconfirm>
              <Button onClick={() => history.goBack()}>Quay lại</Button>
            </Row>
          </Col>
        </Row>
      );
    }
  }

  const columnsNhanXet = [
    {
      title: <b>Họ và tên</b>,
      dataIndex: "DisplayName",
    },
    {
      title: <b>Vai trò</b>,
      dataIndex: "VaiTro",
    },
    {
      title: <b>Nhận xét</b>,
      dataIndex: "KetQua",
    },
    {
      title: <b>Mô tả</b>,
      dataIndex: "GhiChu",
    },
    {
      title: <b>Ngày nhận xét</b>,
      dataIndex: "NgayGui",
    },
    {
      title: <b>Nhận xét đánh giá</b>,
      render: (row) => (
        <Row>
          {row.MauBaoCao !== "" ? (
            <Button
              style={{ marginRight: 20 }}
              onClick={() => handleXemNhanXet(row)}
            >
              Chi tiết
            </Button>
          ) : <></>}
          {row.FileNhanXet !== "" ? (
            <Popover
              content={<>
                <Row style={{ marginBottom: 5 }}>{row.FileNhanXet}</Row>
                <Row>
                  <Col>
                    <Button
                      icon={<EyeFilled />}
                      style={{ marginLeft: 20, marginTop: 5 }}
                      onClick={() => viewFile(`/api/tailieu?hoso=${id}&user=${row.UserId}&filename=${row.FileNhanXet}&guid=${fileDinhKem?.find(x => x.FileName === row.FileNhanXet && x.Category === "reviewer")?.FilePath}`)}
                    >
                      Xem
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      style={{ marginLeft: 20, marginTop: 5 }}
                      onClick={() =>
                        downloadFile(
                          `/api/tailieu?hoso=${id}&user=${row.UserId}&filename=${row.FileNhanXet}&guid=${fileDinhKem?.find(x => x.FileName === row.FileNhanXet && x.Category === "reviewer")?.FilePath}`,
                          row.DisplayName + " - " + row.FileNhanXet
                        )
                      }
                    >
                      Download
                    </Button>
                  </Col>
                </Row>
              </>}
              title="File nhận xét"
              trigger="click"
              overlayStyle={{
                width: "350px"
              }}
            >
              <Button
                type="info"
                icon={<PaperClipOutlined />}
              >
                File nhận xét
              </Button>
            </Popover>
          ) : <></>}
        </Row>
      ),
    },
  ];
  function renderAllNhanXetHDDD() {
    if (listUserRole.admin.includes(userInfo.Role)) {
      return (
        <Row>
          <Col span={24}>
            <Row
              style={{
                marginTop: 20,
                marginBottom: 20,
                marginLeft: -30,
                marginRight: -30,
                borderTopColor: "#f0f2f5",
                borderTopWidth: 20,
                borderTopStyle: "solid",
              }}
            ></Row>
            <Row>
              <Title style={{ color: colors.title }} level={3}>
                Nhận xét của hội đồng đạo đức
              </Title>
            </Row>
            <Table
              bordered
              size="medium"
              rowKey="NhanXetId"
              pagination={{ pageSize: 10 }}
              columns={columnsNhanXet}
              dataSource={nhanXet}
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
            <Row>
              <Modal
                title={
                  <Title style={{ color: colors.title }} level={3}>
                    Nhận xét của thành viên hội đồng
                  </Title>
                }
                visible={isShowNhanXet}
                onCancel={() => setIsShowNhanXet(false)}
                cancelText="Thoát"
                width={"80%"}
                style={{ top: 20 }}
                footer={null}
              >
                <fieldset readOnly>
                  {renderFormNhanXet()}
                </fieldset>
                <Row justify="center" style={{ marginTop: 12 }}>
                  <Button
                    type="success"
                    icon={<FileWordOutlined />}
                    loading={loadingXuatFileNhanXet}
                    onClick={handleXuatFileNhanXet}
                  >
                    Xuất file nhận xét
                  </Button>
                </Row>
                <Row justify="center" style={{ marginTop: 5 }}>
                  <Text type="secondary">Nhận xét đề tài - {tatCaUser?.find(x => x.UserId === currentNhanXet.UserId)?.DisplayName}.docx</Text>
                </Row>
              </Modal>
            </Row>
          </Col>
        </Row>
      );
    }
  }

  function renderThuKy() {
    if (listUserRole.admin.includes(userInfo.Role)) {
      return (
        <Row>
          <Col span={24}>
            <Row
              style={{
                marginTop: 20,
                marginBottom: 20,
                marginLeft: -30,
                marginRight: -30,
                borderTopColor: "#f0f2f5",
                borderTopWidth: 20,
                borderTopStyle: "solid",
              }}
            ></Row>
          </Col>
          <Col span={24}>
            <Row gutter={[40, 40]}>
              <Col span={12} style={{ paddingRight: 20 }}>
                <Title style={{ color: colors.title }} level={3}>
                  Xử lý hồ sơ
                </Title>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  Danh sách thành viên hội đồng nhận xét báo cáo này
                </Text>
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: "100%", marginBottom: 20 }}
                  placeholder="Chọn danh sách"
                  value={hoiDongView}
                  onChange={handleChonHoiDong}
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option key="Toàn bộ hội đồng" value="Toàn bộ hội đồng">
                    <UsergroupAddOutlined /> CHỌN TOÀN BỘ HỘI ĐỒNG
                  </Option>
                  {childrenHoiDong}
                </Select>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  Trạng thái hồ sơ
                </Text>
                <Select
                  onChange={handleTrangThai}
                  value={trangThai}
                  style={{ width: "100%", marginBottom: 20 }}
                >
                  <Option value="Chờ xét duyệt">Chờ xét duyệt</Option>
                  <Option value="Đang xét duyệt">Đang xét duyệt</Option>
                  <Option value="Chấp thuận thông qua">
                    Chấp thuận thông qua
                  </Option>
                  <Option value="Chấp thuận thông qua có chỉnh sửa">
                    Chấp thuận thông qua có chỉnh sửa
                  </Option>
                  <Option value="Đề nghị sửa chữa để xét duyệt lại">
                    Đề nghị sửa chữa để xét duyệt lại
                  </Option>
                  <Option value="Không chấp thuận">Không chấp thuận</Option>
                </Select>
                <Row>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Ngày ra quyết định
                  </Text>
                </Row>
                <Row style={{ marginBottom: 20 }}>
                  <DatePicker
                    style={{ width: "100%" }}
                    defaultValue={hoSo.NgayRaQuyetDinh !== null && hoSo.NgayRaQuyetDinh !== "" ? moment(hoSo.NgayRaQuyetDinh, "YYYY-MM-DDTHH:mm:ss") : ""}
                    onChange={handleNgayRaQuyetDinh}
                    placeholder="Chọn ngày"
                    format="DD-MM-YYYY"
                  />
                </Row>
                <Row>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Đính kèm file quyết định
                  </Text>
                </Row>
                <Row style={{ marginBottom: 5 }}>
                  <Upload {...propsUploadKetQuaXetDuyet}>
                    <Button icon={<UploadOutlined />}>Tải lên</Button>
                  </Upload>
                  {/*{hoSo.FileKetQua === "" ? (*/}
                  {/*  <div></div>*/}
                  {/*) : (*/}
                  {/*  <Link*/}
                  {/*    style={{ marginLeft: 20, marginTop: 5 }}*/}
                  {/*    onClick={() =>*/}
                  {/*      viewFile(*/}
                  {/*        "/api/tailieu?hoso=" +*/}
                  {/*        id +*/}
                  {/*        "&user=0&filename=" +*/}
                  {/*        hoSo.FileKetQua*/}
                  {/*      )*/}
                  {/*    }*/}
                  {/*  >*/}
                  {/*    Tải về file kết quả*/}
                  {/*  </Link>*/}
                  {/*)}*/}
                </Row>
                {renderAttachedFiles(listLoaiFileHoSo.KetQuaXetDuyet, false)}
                <Row style={{ marginBottom: 20 }}></Row>
                <Row>
                  <Popconfirm
                    title="Bạn chắc chắn muốn lưu lại thông tin này?"
                    onConfirm={() => handleUpdateHoSo()}
                    okText="OK"
                    cancelText="Thoát"
                  >
                    <Button
                      style={{ marginRight: 10 }}
                      type="primary"
                      icon={<SaveOutlined />}
                    >
                      Cập nhật
                    </Button>
                  </Popconfirm>
                  <Button onClick={() => history.goBack()}>Quay lại</Button>
                </Row>
              </Col>
              <Col span={12} style={{ paddingRight: 20 }}>
                <Title style={{ color: colors.title }} level={3}>
                  Họp hộp đồng
                </Title>
                <Row>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Thành phần tham gia họp
                  </Text>
                </Row>
                <Row>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%", marginBottom: 20, pointerEvents: "none" }}
                    value={currentHop?.ThanhPhan && JSON.parse(currentHop?.ThanhPhan)}
                  >
                    {allUserOptions}
                  </Select>
                </Row>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  Đường dẫn phòng họp online
                </Text>
                <Input
                  style={{ marginBottom: 20 }}
                  value={currentHop?.LinkHop}
                  readOnly
                />
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  Thời gian diễn ra
                </Text>
                <DatePicker
                  style={{ width: "100%", pointerEvents: "none" }}
                  value={currentHop?.ThoiGian && moment(currentHop?.ThoiGian)}
                  placeholder=""
                  showTime={true}
                  format="DD-MM-YYYY HH:mm"
                  readOnly
                />
                <Row justify="space-between">
                  <Popconfirm
                    title="Bạn chắc chắn muốn gửi lời nhắc về cuộc họp hội đồng?"
                    onConfirm={() => handleNhacHop(currentHop)}
                    okText="OK"
                    cancelText="Thoát"
                  >
                    <Button
                      style={{ marginTop: 5 }}
                      type="warning"
                      icon={<BellOutlined />}
                    >
                      Gửi nhắc họp
                    </Button>
                  </Popconfirm>
                  {renderLichSuHop()}
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      );
    }
  }
  //
  function renderFormNhanXet() {
    if (mauNhanXet === "Thử nghiệm lâm sàng") {
      return (
        <div>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            1. Mức độ đầy đủ về số lượng và tính pháp lý của các tài liệu trong
            hồ sơ nghiên cứu
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau21(e.target.value);
                }}
                value={mau21}
              >
                <Radio value={"Đầy đủ"}>Đầy đủ</Radio>
                <Radio value={"Chưa đầy đủ"}>Chưa đầy đủ</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 20 }}
            onChange={changeMau21}
            value={mau21}
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            2. Tính khả thi của vấn đề nghiên cứu
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau22(e.target.value);
                }}
                value={mau22}
              >
                <Radio value={"Khả thi"}>Khả thi</Radio>
                <Radio value={"Chưa khả thi"}>Chưa khả thi</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 20 }}
            onChange={changeMau22}
            value={mau22}
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            3. Nhận xét về tên đề tài
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau23(e.target.value);
                }}
                value={mau23}
              >
                <Radio value={"Đầy đủ"}>Đầy đủ</Radio>
                <Radio value={"Chưa đầy đủ"}>Chưa đầy đủ</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 20 }}
            onChange={changeMau23}
            value={mau23}
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            4. Nhận xét về mục tiêu nghiên cứu
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau24(e.target.value);
                }}
                value={mau24}
              >
                <Radio value={"Đầy đủ"}>Đầy đủ</Radio>
                <Radio value={"Chưa đầy đủ"}>Chưa đầy đủ</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 20 }}
            onChange={changeMau24}
            value={mau24}
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            5. Nhận xét về cách tiếp cận, phương pháp nghiên cứu
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) === "reviewer" ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau25(e.target.value);
                }}
                value={mau25}
              >
                <Radio value={"Khoa học"}>Khoa học</Radio>
                <Radio value={"Chưa khoa học"}>Chưa khoa học</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 20 }}
            onChange={changeMau25}
            value={mau25}
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            6. Nhận xét về các nội dung đề cương
          </Text>
          <br />
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            6.1. Đối tượng tham gia nghiên cứu
          </Text>
          <br />
          <Text style={{ fontSize: 14 }}>6.1.1. Tiêu chuẩn lựa chọn</Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau2611(e.target.value);
                }}
                value={mau2611}
              >
                <Radio value={"Đạt"}>Đạt</Radio>
                <Radio value={"Chưa đạt"}>Chưa đạt</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 10 }}
            onChange={changeMau2611}
            value={mau2611}
          />
          <Text style={{ fontSize: 14 }}>6.1.2. Tiêu chuẩn loại trừ</Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau2612(e.target.value);
                }}
                value={mau2612}
              >
                <Radio value={"Đạt"}>Đạt</Radio>
                <Radio value={"Chưa đạt"}>Chưa đạt</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 10 }}
            onChange={changeMau2612}
            value={mau2612}
          />
          <Text style={{ fontSize: 14 }}>6.1.3. Cỡ mẫu thích hợp</Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau2613(e.target.value);
                }}
                value={mau2613}
              >
                <Radio value={"Đạt"}>Đạt</Radio>
                <Radio value={"Chưa đạt"}>Chưa đạt</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 20 }}
            onChange={changeMau2613}
            value={mau2613}
          />
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            6.2. Vấn đề đạo đức trong nghiên cứu y sinh học
          </Text>
          <br />
          <Text style={{ fontSize: 14 }}>
            6.2.1. Mức độ đầy đủ về nội dung của Phiếu cung cấp thông tin
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau2621(e.target.value);
                }}
                value={mau2621}
              >
                <Radio value={"Đầy đủ"}>Đầy đủ</Radio>
                <Radio value={"Chưa đầy đủ"}>Chưa đầy đủ</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 10 }}
            onChange={changeMau2621}
            value={mau2621}
          />
          <Text style={{ fontSize: 14 }}>
            6.2.2. Mức độ đầy đủ của Đơn tình nguyện tham gia nghiên cứu
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau2622(e.target.value);
                }}
                value={mau2622}
              >
                <Radio value={"Đầy đủ"}>Đầy đủ</Radio>
                <Radio value={"Chưa đầy đủ"}>Chưa đầy đủ</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 10 }}
            onChange={changeMau2622}
            value={mau2622}
          />
          <Text style={{ fontSize: 14 }}>
            6.2.3. Việc tổ chức thông báo, tập huấn cho đối tượng nghiên cứu
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau2623(e.target.value);
                }}
                value={mau2623}
              >
                <Radio value={"Đạt"}>Đạt</Radio>
                <Radio value={"Chưa đạt"}>Chưa đạt</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 10 }}
            onChange={changeMau2623}
            value={mau2623}
          />
          <Text style={{ fontSize: 14 }}>
            6.2.4. Chế độ bồi dưỡng, phụ cấp kinh phí cho đối tượng tham gia
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau2624(e.target.value);
                }}
                value={mau2624}
              >
                <Radio value={"Đạt"}>Đạt</Radio>
                <Radio value={"Chưa đạt"}>Chưa đạt</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 10 }}
            onChange={changeMau2624}
            value={mau2624}
          />
          <Text style={{ fontSize: 14 }}>
            6.2.5. Về bảo vệ thông tin bảo mật của đối tượng tham gia nghiên cứu
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau2625(e.target.value);
                }}
                value={mau2625}
              >
                <Radio value={"Đạt"}>Đạt</Radio>
                <Radio value={"Chưa đạt"}>Chưa đạt</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 20 }}
            onChange={changeMau2625}
            value={mau2625}
          />
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            6.3. Thời gian, địa điểm nghiên cứu
          </Text>
          <br />
          <Text style={{ fontSize: 14 }}>6.3.1. Thời gian triển khai</Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau2631(e.target.value);
                }}
                value={mau2631}
              >
                <Radio value={"Đảm bảo"}>Đảm bảo</Radio>
                <Radio value={"Chưa đảm bảo"}>Chưa đảm bảo</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 10 }}
            onChange={changeMau2631}
            value={mau2631}
          />
          <Text style={{ fontSize: 14 }}>6.3.2. Địa điểm nghiên cứu</Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau2632(e.target.value);
                }}
                value={mau2632}
              >
                <Radio value={"Đảm bảo"}>Đảm bảo</Radio>
                <Radio value={"Chưa đảm bảo"}>Chưa đảm bảo</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 20 }}
            onChange={changeMau2632}
            value={mau2632}
          />
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            6.4. Thuốc dùng trong nghiên cứu
          </Text>
          <br />
          <Text style={{ fontSize: 14 }}>
            6.4.1. Thuốc dùng trong nghiên cứu
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau2641(e.target.value);
                }}
                value={mau2641}
              >
                <Radio value={"Phù hợp"}>Phù hợp</Radio>
                <Radio value={"Chưa phù hợp"}>Chưa phù hợp</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 10 }}
            onChange={changeMau2641}
            value={mau2641}
          />
          <Text style={{ fontSize: 14 }}>
            6.4.2. Phác đồ dùng thuốc nghiên cứu
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau2642(e.target.value);
                }}
                value={mau2642}
              >
                <Radio value={"Đầy đủ"}>Đầy đủ</Radio>
                <Radio value={"Chưa đầy đủ"}>Chưa đầy đủ</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 10 }}
            onChange={changeMau2642}
            value={mau2642}
          />
          <Text style={{ fontSize: 14 }}>
            6.4.3. Ghi chép, báo cáo các phản ứng phụ
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau2643(e.target.value);
                }}
                value={mau2643}
              >
                <Radio value={"Đầy đủ"}>Đầy đủ</Radio>
                <Radio value={"Chưa đầy đủ"}>Chưa đầy đủ</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 10 }}
            onChange={changeMau2643}
            value={mau2643}
          />
          <Text style={{ fontSize: 14 }}>
            6.4.4. Chế độ bảo quản các sản phẩm nghiên cứu
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau2644(e.target.value);
                }}
                value={mau2644}
              >
                <Radio value={"Đạt"}>Đạt</Radio>
                <Radio value={"Chưa đạt"}>Chưa đạt</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 20 }}
            onChange={changeMau2644}
            value={mau2644}
          />
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            6.5. Các qui trình nghiên cứu
          </Text>
          <br />
          <Text style={{ fontSize: 14 }}>
            6.5.1. Các qui trình thao tác có liên quan tới nghiên cứu
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau2651(e.target.value);
                }}
                value={mau2651}
              >
                <Radio value={"Đầy đủ"}>Đầy đủ</Radio>
                <Radio value={"Chưa đầy đủ"}>Chưa đầy đủ</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 10 }}
            onChange={changeMau2651}
            value={mau2651}
          />
          <Text style={{ fontSize: 14 }}>
            6.5.2. Ghi chép, cập nhật số liệu và kết quả
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau2652(e.target.value);
                }}
                value={mau2652}
              >
                <Radio value={"Đầy đủ"}>Đầy đủ</Radio>
                <Radio value={"Chưa đầy đủ"}>Chưa đầy đủ</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 10 }}
            onChange={changeMau2652}
            value={mau2652}
          />
          <Text style={{ fontSize: 14 }}>
            6.5.3. Kế hoạch tổ chức thực hiện nghiên cứu
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau2653(e.target.value);
                }}
                value={mau2653}
              >
                <Radio value={"Đầy đủ"}>Đầy đủ</Radio>
                <Radio value={"Chưa đầy đủ"}>Chưa đầy đủ</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 20 }}
            onChange={changeMau2653}
            value={mau2653}
          />
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            6.6. Phương pháp đánh giá kết quả nghiên cứu
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau266(e.target.value);
                }}
                value={mau266}
              >
                <Radio value={"Đạt"}>Đạt</Radio>
                <Radio value={"Chưa đạt"}>Chưa đạt</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 20 }}
            onChange={changeMau266}
            value={mau266}
          />
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            6.7. Chăm sóc y tế sau thử nghiệm cho đối tượng tham gia nghiên cứu
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau267(e.target.value);
                }}
                value={mau267}
              >
                <Radio value={"Đạt"}>Đạt</Radio>
                <Radio value={"Chưa đạt"}>Chưa đạt</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 20 }}
            onChange={changeMau267}
            value={mau267}
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            7. Nhận xét, đánh giá về các tài liệu, hồ sơ liên quan tới nghiên
            cứu
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau27(e.target.value);
                }}
                value={mau27}
              >
                <Radio value={"Đầy đủ"}>Đầy đủ</Radio>
                <Radio value={"Chưa đầy đủ"}>Chưa đầy đủ</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 20 }}
            onChange={changeMau27}
            value={mau27}
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            8. Sự phù hợp của dự toán kinh phí đề tài
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau28(e.target.value);
                }}
                value={mau28}
              >
                <Radio value={"Phù hợp"}>Phù hợp</Radio>
                <Radio value={"Chưa phù hợp"}>Chưa phù hợp</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 20 }}
            onChange={changeMau28}
            value={mau28}
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            9. Các ý kiến nhận xét, góp ý khác
          </Text>
          <TextArea maxLength={2000} onChange={changeMau29} value={mau29} />
        </div>
      );
    } else if (mauNhanXet === "Nghiên cứu quan sát") {
      return (
        <div>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            1. Mức độ đầy đủ về số lượng và tính pháp lý của các tài liệu trong
            hồ sơ xin thử nghiệm
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau11(e.target.value);
                }}
                value={mau11}
              >
                <Radio value={"Đầy đủ"}>Đầy đủ</Radio>
                <Radio value={"Chưa đầy đủ"}>Chưa đầy đủ</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 20 }}
            onChange={changeMau11}
            value={mau11}
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            2. Nhận xét về độ tin cậy của các số liệu, kết quả nghiên cứu
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau12(e.target.value);
                }}
                value={mau12}
              >
                <Radio value={"Tin cậy"}>Tin cậy</Radio>
                <Radio value={"Chưa tin cậy"}>Chưa tin cậy</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 20 }}
            onChange={changeMau12}
            value={mau12}
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            3. Nhận xét về quy trình tuyển chọn đối tượng tham gia nghiên cứu
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau13(e.target.value);
                }}
                value={mau13}
              >
                <Radio value={"Đầy đủ"}>Đầy đủ</Radio>
                <Radio value={"Chưa đầy đủ"}>Chưa đầy đủ</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 20 }}
            onChange={changeMau13}
            value={mau13}
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            4. Nhận xét về theo dõi, đánh giá xử lý SAE
          </Text>
          {listUserRole.reviewer.includes(userInfo.Role) ? (
            <Row>
              <Radio.Group
                style={{ marginBottom: 5 }}
                onChange={(e) => {
                  setMau14(e.target.value);
                }}
                value={mau14}
              >
                <Radio value={"Đầy đủ"}>Đầy đủ</Radio>
                <Radio value={"Chưa đầy đủ"}>Chưa đầy đủ</Radio>
              </Radio.Group>
            </Row>
          ) : (
            <div></div>
          )}
          <TextArea
            maxLength={2000}
            style={{ marginBottom: 20 }}
            onChange={changeMau14}
            value={mau14}
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            5. Các góp ý khác
          </Text>
          <TextArea maxLength={2000} onChange={changeMau15} value={mau15} />
        </div>
      );
    } else {
      return (
        <div>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Nhận xét
          </Text>
          <TextArea
            maxLength={2000}
            onChange={changeMau15}
            value={mau15}
            showCount
            rows={5}
            placeholder="Nội dung nhận xét"
          />
        </div>
      );
    }
  }
  //
  function renderNhanXetHoiDong() {
    if (listUserRole.reviewer.includes(userInfo.Role)) {
      return (
        <Row>
          <Col span={24}>
            <Row
              style={{
                marginTop: 20,
                marginBottom: 20,
                marginLeft: -30,
                marginRight: -30,
                borderTopColor: "#f0f2f5",
                borderTopWidth: 20,
                borderTopStyle: "solid",
              }}
            ></Row>
          </Col>
          <Col span={24}>
            <Row gutter={[40, 40]}>
              <Col span={24}>
                <Title
                  style={{ color: colors.title, marginBottom: 20 }}
                  level={3}
                >
                  Nhận xét của thành viên hội đồng
                </Title>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  Lựa chọn mẫu nhận xét
                </Text>
                <Row>
                  <Select
                    onChange={handleMauNhanXet}
                    value={mauNhanXet}
                    style={{ width: "100%", marginBottom: 20 }}
                  >
                    <Option value="Thử nghiệm lâm sàng">
                      Thử nghiệm lâm sàng
                    </Option>
                    <Option value="Nghiên cứu quan sát">
                      Nghiên cứu quan sát
                    </Option>
                    <Option value="Nghiệm thu kết quả">
                      Nghiệm thu kết quả
                    </Option>
                    <Option value="Khác">Khác</Option>
                  </Select>
                </Row>
                {renderFormNhanXet()}
              </Col>
            </Row>
            <Row gutter={[40, 40]}>
              <Col span={24}>
                <Title
                  style={{ color: colors.title, marginBottom: 20 }}
                  level={3}
                >
                  Kết luận cuối cùng
                </Title>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  Kết quả xét duyệt của hội đồng
                </Text>
                <Row>
                  <Select
                    onChange={handleXetDuyetCuaToi}
                    value={xetDuyetCuaToi}
                    style={{ width: "100%", marginBottom: 20 }}
                  >
                    <Option value="Chấp thuận thông qua">
                      Chấp thuận thông qua
                    </Option>
                    <Option value="Chấp thuận thông qua có chỉnh sửa">
                      Chấp thuận thông qua có chỉnh sửa
                    </Option>
                    <Option value="Đề nghị sửa chữa để xét duyệt lại">
                      Đề nghị sửa chữa để xét duyệt lại
                    </Option>
                    <Option value="Không chấp thuận">Không chấp thuận</Option>
                  </Select>
                </Row>
                <Row>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Đính kèm file nhận xét
                  </Text>
                  <Link
                    style={{ marginLeft: 10, marginTop: 0.5 }}
                    href={
                      hoSo.LoaiDeTai === "Nghiên cứu quan sát"
                        ? "/files/docs/Mau_nhan_xet_2.docx"
                        : "/files/docs/Mau_nhan_xet_1.docx"
                    }
                    target="_blank"
                  >
                    (Mẫu nhận xét)
                  </Link>
                </Row>
                <Row style={{ marginBottom: 20 }}>
                  <Upload {...propsUploadHoiDong}>
                    <Button icon={<UploadOutlined />}>Tải lên</Button>
                  </Upload>
                  {tenFileNhanXetHoiDongCu === "" ? (
                    <div></div>
                  ) : (
                    <Popover
                      content={<>
                        <Row style={{ marginBottom: 5 }}>{tenFileNhanXetHoiDongCu}</Row>
                        <Row>
                          <Col>
                            <Button
                              icon={<EyeFilled />}
                              style={{ marginLeft: 20, marginTop: 5 }}
                              onClick={() =>
                                viewFile(
                                  "/api/tailieu?hoso=" +
                                  id +
                                  "&user=" +
                                  userInfo.UserId +
                                  "&filename=" +
                                  tenFileNhanXetHoiDongCu +
                                  "&guid=" +
                                  fileDinhKem?.find(x => x.FileName === tenFileNhanXetHoiDongCu && x.Category === "reviewer")?.FilePath
                                )
                              }
                            >
                              Xem
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              type="primary"
                              icon={<DownloadOutlined />}
                              style={{ marginLeft: 20, marginTop: 5 }}
                              onClick={() =>
                                downloadFile(
                                  "/api/tailieu?hoso=" +
                                  id +
                                  "&user=" +
                                  userInfo.UserId +
                                  "&filename=" +
                                  tenFileNhanXetHoiDongCu +
                                  "&guid=" +
                                  fileDinhKem?.find(x => x.FileName === tenFileNhanXetHoiDongCu && x.Category === "reviewer")?.FilePath,
                                  userInfo.DisplayName + " - " + tenFileNhanXetHoiDongCu
                                )
                              }
                            >
                              Download
                            </Button>
                          </Col>
                        </Row>
                      </>}
                      title="File nhận xét đã gửi"
                      trigger="click"
                      overlayStyle={{
                        width: "350px"
                      }}
                    >
                      <Link style={{ marginLeft: 20, marginTop: 5 }}>
                        <PaperClipOutlined /> File nhận xét đã gửi
                      </Link>
                    </Popover>
                  )}
                </Row>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  Ghi chú thêm
                </Text>
                <TextArea
                  onChange={changeGhiChu}
                  value={ghiChu}
                  maxLength={2000}
                />
              </Col>
              <Col span={24}>
                <Space size="small">
                  <Popconfirm
                    title="Bạn chắc chắn muốn lưu nhận xét này?"
                    onConfirm={() => {
                      if (xetDuyetCuaToi === "") {
                        message.error("Xin vui lòng chọn Kết quả xét duyệt!");
                      } else {
                        handleGuiNhanXet();
                        handleUploadFile("reviewer", fileHoiDongNhanXet);
                      }
                    }}
                    okText="OK"
                    cancelText="Thoát"
                  >
                    <Button type="primary" icon={<SendOutlined />}>
                      Gửi nhận xét
                    </Button>
                  </Popconfirm>
                  {nhanXetCuaToiId > 0
                    ? <Button
                      type="success"
                      icon={<FileWordOutlined />}
                      loading={loadingXuatFileNhanXet}
                      onClick={handleXuatFileNhanXet}
                    >
                      Xuất file nhận xét
                    </Button>
                    : <Tooltip title="Hãy gửi nhận xét trước khi có thể xuất file">
                      <Button type="success" disabled icon={<FileWordOutlined />} > Xuất file nhận xét </Button>
                    </Tooltip>}
                  <Button onClick={() => history.goBack()}>Quay lại</Button>
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      );
    }
  }
  //
  function renderAttachedFile(key, count, fileDinhKem, showIndex = true, ellipsis = false) {
    return (
      <Row key={key} style={{ marginTop: 5 }}>
        <Popover
          content={<>
            <Row style={{ marginBottom: 5 }}>{fileDinhKem.FileName}</Row>
            <Row>
              <Col>
                <Button
                  icon={<EyeFilled />}
                  style={{ marginLeft: 20, marginTop: 5 }}
                  onClick={() => viewFile(`/api/tailieu?hoso=${id}&user=${fileDinhKem.UserId}&filename=${fileDinhKem.FileName}&guid=${fileDinhKem.FilePath}`)}
                >
                  Xem
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  style={{ marginLeft: 20, marginTop: 5 }}
                  onClick={() =>
                    downloadFile(
                      `/api/tailieu?hoso=${id}&user=${fileDinhKem.UserId}&filename=${fileDinhKem.FileName}&guid=${fileDinhKem.FilePath}`,
                      fileDinhKem.DisplayName !== undefined ? fileDinhKem.DisplayName + " - " + fileDinhKem.FileName : fileDinhKem.FileName
                    )
                  }
                >
                  Download
                </Button>
              </Col>
            </Row>
          </>}
          title="File đính kèm"
          trigger="click"
          overlayStyle={{
            width: "350px"
          }}
        >
          <Link ellipsis={ellipsis}>
            {showIndex === true
              ? <Text style={{ marginRight: 5 }}>{count}.</Text>
              : <Text style={{ marginRight: 5 }} type="secondary"><PaperClipOutlined /></Text>
            }
            {fileDinhKem.LinkText !== undefined ? fileDinhKem.LinkText : fileDinhKem.FileName}
          </Link>
        </Popover>
      </Row>
    );
  }
  function renderAttachedFiles(type, showIndex = true) {
    const listFile = [];
    let count = 0;
    for (let i = 0; i < fileDinhKem.length; i++) {
      if (fileDinhKem[i].Category === type) {
        count += 1;
        listFile.push(renderAttachedFile(i, count, fileDinhKem[i], showIndex));
      }
    }
    return listFile;
  }
  function renderGiayBaoNhan() {
    const listFile = [];
    let count = 0;
    for (let i = 0; i < fileDinhKem.length; i++) {
      if (fileDinhKem[i].Category === "giaybaonhan") {
        count += 1;
        listFile.push(
          <Row key={i} style={{ marginTop: 5 }}>
            <Text style={{ marginRight: 5 }} strong>Giấy báo nhận:</Text>
            <Text style={{ marginRight: 5 }} type="secondary"><PaperClipOutlined /></Text>
            <Link
              onClick={() =>
                viewFile(
                  "/api/tailieu?hoso=" +
                  id +
                  "&user=" +
                  hoSo.UserId +
                  "&filename=" +
                  fileDinhKem[i].FileName +
                  "&guid=" +
                  fileDinhKem[i].FilePath
                )
              }
            >
              {fileDinhKem[i].FileName}
            </Link>
          </Row>
        );
      }
    }
    if (count === 0) {
      if (listUserRole.nghienCuuSinh.includes(userInfo.Role))
        return <Text mark><ExclamationCircleOutlined /> Hãy tải lên giấy báo nhận</Text>
      if (listUserRole.admin.includes(userInfo.Role) || listUserRole.thuKy.includes(userInfo.Role))
        return <Text mark><ExclamationCircleOutlined /> Giấy báo nhận chưa được tải lên</Text>
    } else {
      return listFile;
    }
  }
  // Render up file biên nhận
  function renderBienNhan() {
    if (listUserRole.dev.includes(userInfo.Role)) {
      //setFilesBienNhanView(fileDinhKem.filter(fdk => fdk.Category === "biennhan" ));
      return (
        <Row gutter={6}>
          <Col span={16}>
            <Row>
              <Upload {...propsUploadBienNhan}>
                <Button icon={<UploadOutlined />}>Biên nhận lệ phí</Button>
              </Upload>
            </Row>
            {renderAttachedFiles("biennhan", false)}
          </Col>
          <Col span={8}>
            <Popconfirm
              title="Lưu thông tin biên nhận lệ phí?"
              onConfirm={() => { handleUploadBienNhan(); }}
              okText="OK"
              cancelText="Hủy"
            >
              <Button style={{ marginRight: 10 }} type="primary" icon={<SaveOutlined />}>
                Lưu
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      );
    } else {
      return (
        <Row>
          <Col>
            {renderAttachedFiles("biennhan", false)}
          </Col>
        </Row>
      )
    }
  }
  // Nút xuất file giấy báo nhận
  async function handleXuatGiayBaoNhan() {
    setLoadingXuatGiayBaoNhan(true);
    const fd = new FormData();
    let _hoSo = {
      HoSoId: hoSo.HoSoId,
      TenDeTai: hoSo.TenDeTai,
      MaSoDeTai: hoSo.MaSoDeTai,
      NghienCuuVien: hoSo.NghienCuuVien,
      NhaTaiTro: hoSo.NhaTaiTro,
    }
    fd.append("hoSo", JSON.stringify(_hoSo));
    let listCategory = listLoaiDinhKemView.map(ldk => ldk.category);
    let _fileList = fileDinhKem.filter(fdk => listCategory.includes(fdk.Category));
    fd.append("fileList", JSON.stringify(_fileList));
    await Axios.post(
      urlFile + "/hoso/" + id + "/exportaor/" + userInfo.UserId,
      fd,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      }
    ).then((result) => {
      setLoadingXuatGiayBaoNhan(false);
      if (result.data.Error !== true) {
        message.success(result.data.Message);
        window.open(result.data.FileInfo.path);
      } else {
        if (result.data.Code === 500) {
          showError('System');
        } else {
          message.error(result.data.Message);
        }
      }
    }).catch((error) => {
      setLoadingXuatGiayBaoNhan(false);
      showError('Api');
    });
  }
  // Nút xuất file nhận xét
  async function handleXuatFileNhanXet() {
    setLoadingXuatFileNhanXet(true);
    const fd = new FormData();
    let _hoSo = {
      HoSoId: hoSo.HoSoId,
      TenDeTai: hoSo.TenDeTai,
      MaSoDeTai: hoSo.MaSoDeTai,
      NghienCuuVien: hoSo.NghienCuuVien,
    }
    fd.append("hoSo", JSON.stringify(_hoSo));
    fd.append("nhanXet", JSON.stringify(currentNhanXet));
    fd.append("taiKhoan", JSON.stringify(tatCaUser?.find(x => x.UserId === currentNhanXet.UserId)));
    await Axios.post(
      urlFile + "/hoso/" + id + "/exportnx/" + userInfo.UserId,
      fd,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      }
    ).then((result) => {
      setLoadingXuatFileNhanXet(false);
      if (result.data.Error !== true) {
        message.success(result.data.Message);
        window.open(result.data.FileInfo.path);
      } else {
        if (result.data.Code === 500) {
          showError('System');
        } else {
          message.error(result.data.Message);
        }
      }
    }).catch((error) => {
      setLoadingXuatFileNhanXet(false);
      showError('Api');
    });
  }
  // Nút xuất file danh mục hồ sơ
  async function handleXuatDanhMucHoSo() {
    setLoadingXuatDanhMucHoSo(true);
    const fd = new FormData();
    let _hoSo = {
      HoSoId: hoSo.HoSoId,
      TenDeTai: hoSo.TenDeTai,
      MaSoDeTai: hoSo.MaSoDeTai,
      NghienCuuVien: hoSo.NghienCuuVien,
      NhaTaiTro: hoSo.NhaTaiTro,
      ThoiGianThucHien: hoSo.ThoiGianThucHien,
    }
    fd.append("hoSo", JSON.stringify(_hoSo));
    let listCategory = listLoaiDinhKemView.map(ldk => ldk.category);
    let _fileList = fileDinhKem.filter(fdk => listCategory.includes(fdk.Category));
    fd.append("fileList", JSON.stringify(_fileList));
    await Axios.post(
      urlFile + "/hoso/" + id + "/exportsc/" + userInfo.UserId,
      fd,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      }
    ).then((result) => {
      setLoadingXuatDanhMucHoSo(false);
      if (result.data.Error !== true) {
        message.success(result.data.Message);
        window.open(result.data.FileInfo.path);
      } else {
        if (result.data.Code === 500) {
          showError('System');
        } else {
          message.error(result.data.Message);
        }
      }
    }).catch((error) => {
      setLoadingXuatDanhMucHoSo(false);
      showError('Api');
    });
  }
  // Render các nút xuất file
  function renderButtonExportTableDinhKem(phanLoaiDeTai) {
    return (
      <>
        {listUserRole.admin.includes(userInfo.Role) || listUserRole.nghienCuuSinh.includes(userInfo.Role)
          ?
          <Button
            type="primary"
            size="small"
            icon={<FileWordOutlined />}
            loading={loadingXuatDanhMucHoSo}
            onClick={handleXuatDanhMucHoSo}
          >
            Xuất danh mục hồ sơ
          </Button>
          : <></>
        }
        {listUserRole.admin.includes(userInfo.Role)
          ? <Button
            type="primary"
            size="small"
            icon={<FileWordOutlined />}
            loading={loadingXuatGiayBaoNhan}
            onClick={handleXuatGiayBaoNhan}
            style={{ marginLeft: 4 }}
          >
            Xuất giấy báo nhận
          </Button>
          : <></>
        }
      </>
    );
  }
  // Bảng file đính kèm
  function renderTableDinhKem(phanLoaiDeTai) {
    let _index = 0;
    let _data = listLoaiDinhKemView
      .filter(ldk => ldk.phanLoaiDeTai === phanLoaiDeTai)
      .map((ldk => {
        _index++;
        return {
          index: _index,
          categoryTitle: ldk.title,
          attachments: fileDinhKem.filter(fdk => fdk.Category === ldk.category)
        }
      }));

    let _isThuKy = listUserRole.thuKy.includes(userInfo.Role);
    let _columns = [
      {
        title: 'TT',
        dataIndex: 'index',
        width: 50,
        align: 'center',
        render: value => (<Text>{value}</Text>)
      },
      {
        title: 'Loại tài liệu',
        dataIndex: 'categoryTitle',
        width: 'calc(25% - 50px)',
      },
      {
        title: value => (
          <Row justify="space-between">
            <Text>Đính kèm</Text>
            <Col style={{ textAlign: "right" }}>
              <Switch
                checkedChildren="Đầy đủ"
                unCheckedChildren="Thu gọn"
                checked={!ellipsisHoSoTrinhNop}
                onChange={() => { setEllipsisHoSoTrinhNop(!ellipsisHoSoTrinhNop); }}
                style={{ marginRight: 8 }}
              />
              {renderButtonExportTableDinhKem(hoSo.LoaiDeTai)}
            </Col>
          </Row>
        ),
        dataIndex: 'attachments',
        width: '75%',
        render: atms => atms.length > 0 ? <Text>{atms.length} tài liệu</Text> : <Text type="secondary">Không có tài liệu</Text>,
      }
    ];
    let _table = (
      <Table
        className="tai-lieu-view-table"
        rowKey="index"
        columns={_columns}
        dataSource={_data}
        bordered
        pagination={false}
        size="middle"
        expandable={{
          expandRowByClick: true,
          rowExpandable: record => record.attachments !== null && record.attachments.length > 0,
          expandedRowRender: record =>
            <>
              <List
                size="small"
                dataSource={record.attachments}
                renderItem={attachment => <List.Item>
                  <Row
                    key={attachment.TaiLieuId}
                    style={{ marginTop: 2, marginBottom: 2, width: "100%" }}
                    gutter={4}
                  >
                    <Col span={1} style={{ textAlign: "center" }}>
                      {_isThuKy === true
                        ? <Tooltip placement="left" title="Xác nhận đã nộp bản cứng">
                          <Checkbox
                            style={{ marginRight: 5 }}
                            defaultChecked={attachment.HardCopy === true}
                            onChange={handleMarkHardCopy}
                          >
                          </Checkbox>
                        </Tooltip>
                        : <Tooltip placement="left" title={attachment.HardCopy === true ? "Đã nộp bản cứng" : "Chưa nộp bản cứng"}>
                          <Checkbox
                            style={{ marginRight: 5 }}
                            checked={attachment.HardCopy === true}
                            readOnly
                          >
                          </Checkbox>
                        </Tooltip>
                      }
                    </Col>
                    <Col span={12}>
                      {attachment.DocNameVN !== null
                        ? <Text
                          style={{ width: "100%" }}
                          ellipsis={ellipsisHoSoTrinhNop === true ? { tooltip: attachment.DocNameVN } : false}
                        >
                          {attachment.DocNameVN}
                        </Text>
                        : <Text type="secondary"><ExclamationCircleOutlined /> Thiếu tên tài liệu</Text>
                      }
                    </Col>
                    <Col span={5}>
                      {attachment.VersionAndDate !== null
                        ? <Text
                          style={{ width: "100%" }}
                          ellipsis={ellipsisHoSoTrinhNop === true ? { tooltip: attachment.VersionAndDate } : false}
                        >
                          {attachment.VersionAndDate}
                        </Text>
                        : <Text type="secondary"><ExclamationCircleOutlined /> Thiếu phiên bản/ngày</Text>
                      }
                    </Col>
                    <Col span={6}>
                      {renderAttachedFile(attachment.TaiLieuId, 1, attachment, false, ellipsisHoSoTrinhNop === true ? { tooltip: attachment.FileName } : false)}
                    </Col>
                  </Row>
                </List.Item>}
              />
            </>,
        }}
      />
    );
    return _table;
  }
  // Nội dung duyệt hồ sơ giấy
  function renderDuyetHoSoGiay() {
    return (<Row>
      <Col span={24}>
        <Row
          style={{
            marginTop: 20,
            marginBottom: 20,
            marginLeft: -30,
            marginRight: -30,
            borderTopWidth: 20,
            borderTopColor: "#f0f2f5",
            borderTopStyle: "solid",
          }}
        ></Row>
        <Row>
          <Title style={{ color: colors.title }} level={3}>
            Xét duyệt hồ sơ giấy
          </Title>
        </Row>
        {
          (hoSo.TrangThai === listTrangThaiHoSo.DeNghiSua)
            ? <>
              <Row style={{ marginBottom: 10 }}>
                <Title level={5} type="danger">Hồ sơ đã được đề nghị chỉnh sửa để xét duyệt lại</Title>
              </Row>
              <Row>
                {
                  (userInfo.Role === "admin" || userInfo.Role === "thuky")
                    ? <Popconfirm
                      title="Hoàn tác và tiếp tục xét duyệt hồ sơ này?"
                      onConfirm={handleUndoDuyetHoSoGiay}
                      okText="Xác nhận"
                      cancelText="Hủy"
                    >
                      <Button
                        danger
                        type="primary"
                        style={{ marginRight: 10 }}
                        icon={<UndoOutlined />}
                      >
                        Hoàn tác
                      </Button>
                    </Popconfirm>
                    : <></>
                }
                <Button onClick={() => history.push("/ho-so")}>Quay lại</Button>
              </Row>
            </>
            : (hoSo.DuyetHoSoGiay !== true)
              ? <>
                {hoSo.NgayHenDuyetHoSoGiay && (listUserRole.nghienCuuSinh.includes(userInfo.Role) || userInfo.UserId == hoSo.UserId || listUserRole.admin.includes(userInfo.Role) || listUserRole.thuKy.includes(userInfo.Role)) ?
                  <Row>
                    <Col span={24} style={{ marginBottom: 10 }}>
                      <Title level={5}><CalendarOutlined /> Ngày hẹn duyệt hồ sơ giấy: {moment(hoSo.NgayHenDuyetHoSoGiay).format("DD-MM-YYYY")}</Title>
                    </Col>
                  </Row>
                  : <></>}
                {
                  (listUserRole.nghienCuuSinh.includes(userInfo.Role) || userInfo.UserId == hoSo.UserId)
                    ? <>
                      <Row>
                        <Title level={5}><ClockCircleOutlined /> Chờ duyệt hồ sơ</Title>
                        <Col span={24} style={{ marginBottom: 10 }}>
                          {renderGiayBaoNhan()}
                        </Col>
                      </Row>
                      {!hoSo.NgayHenDuyetHoSoGiay ?
                        <Row>
                          <Col span={24} style={{ marginBottom: 10 }}>
                            <Upload {...propsUploadGiayBaoNhan}>
                              <Button icon={<UploadOutlined />}>Giấy báo nhận</Button>
                            </Upload>
                          </Col>
                          <Col span={24}>
                            <Popconfirm
                              title="Xác nhận gửi giấy báo nhận cho thư ký hội đồng?"
                              onConfirm={() => { handleGuiGiayBaoNhan() }}
                              okText="Xác nhận"
                              cancelText="Hủy"
                            >
                              <Button style={{ marginRight: 10 }} type="primary" icon={<SendOutlined />}>
                                Gửi giấy báo nhận
                              </Button>
                            </Popconfirm>
                          </Col>
                        </Row>
                        : <></>}
                    </>
                    : (listUserRole.admin.includes(userInfo.Role) || listUserRole.thuKy.includes(userInfo.Role))
                      ? <>
                        <Row style={{ marginBottom: 10 }}>
                          {renderGiayBaoNhan()}
                        </Row>
                        <Row>
                          <Col span={24}>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                              Hẹn ngày duyệt hồ sơ giấy với người nộp hồ sơ
                            </Text>
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 20 }}>
                          <DatePicker style={{ marginRight: 2 }}
                            onChange={handleNgayHenDuyetHoSoGiay}
                            placeholder={"Chọn ngày hẹn"}
                            format="DD-MM-YYYY"
                          />
                          <Popconfirm
                            title="Cập nhật ngày hẹn duyệt hồ sơ giấy?"
                            onConfirm={() => { handleHenDuyetHoSoGiay() }}
                            okText="Xác nhận"
                            cancelText="Hủy"
                          >
                            <Button style={{ marginRight: 10 }} type="primary" icon={<SaveOutlined />}>
                              Lưu
                            </Button>
                          </Popconfirm>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                              Ngày duyệt hồ sơ giấy
                            </Text>
                          </Col>
                          <Col span={24} style={{ marginBottom: 5 }}>
                            <DatePicker style={{ marginRight: 2 }}
                              onChange={handleNgayDuyetHoSoGiay}
                              placeholder={"Chọn ngày duyệt"}
                              format="DD-MM-YYYY"
                              defaultValue={moment()}
                            />
                          </Col>
                          <Col span={24}>
                            <Popconfirm
                              title="Xác nhận hồ sơ giấy đã đầy đủ và tiếp tục xét duyệt hồ sơ này?"
                              onConfirm={() => { handleDuyetHoSoGiay(true) }}
                              okText="Xác nhận"
                              cancelText="Hủy"
                            >
                              <Button style={{ marginRight: 10 }} type="primary" icon={<CheckCircleOutlined />}>
                                Duyệt hồ sơ
                              </Button>
                            </Popconfirm>
                            <Popconfirm
                              title="Xác nhận hồ sơ không đầy đủ và Đề nghị sửa chữa để xét duyệt lại hồ sơ này?"
                              onConfirm={() => { handleDuyetHoSoGiay(false) }}
                              okText="Xác nhận"
                              cancelText="Hủy"
                            >
                              <Button style={{ marginRight: 10 }} type="danger" icon={<CloseCircleOutlined />}>
                                Không duyệt hồ sơ
                              </Button>
                            </Popconfirm>
                            <Button onClick={() => history.goBack()}>Quay lại</Button>
                          </Col>
                        </Row>
                      </>
                      :
                      <Row>
                        <Title level={5}>Đang xét duyệt hồ sơ giấy</Title>
                      </Row>
                }
              </>
              : <>
                <Row>
                  <Title level={5}>Hồ sơ đã đầy đủ tài liệu</Title>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                  {renderGiayBaoNhan()}
                </Row>
                {hoSo.NgayDuyetHoSoGiay ?
                  <Row>
                    <Col span={24} style={{ marginBottom: 10 }}>
                      <Title level={5}><CalendarOutlined /> Ngày duyệt hồ sơ giấy: {moment(hoSo.NgayDuyetHoSoGiay).format("DD-MM-YYYY")}</Title>
                    </Col>
                  </Row>
                  : <></>}
                {hoSo.TrangThai === listTrangThaiHoSo.ChoDuyet && (userInfo.Role === "admin" || userInfo.Role === "thuky")
                  ? <Popconfirm
                    title="Hủy việc duyệt hồ sơ giấy?"
                    onConfirm={handleUndoDuyetHoSoGiay}
                    okText="Xác nhận"
                    cancelText="Hủy"
                  >
                    <Button
                      danger
                      type="primary"
                      style={{ marginRight: 10 }}
                      icon={<UndoOutlined />}
                    >
                      Hủy duyệt
                    </Button>
                  </Popconfirm>
                  : <></>
                }
              </>
        }
      </Col>
    </Row>);
  }
  // Lịch sử họp
  function renderLichSuHop() {
    const propsUploadFileThuyetTrinh = {
      name: "file",
      multiple: false,
      maxCount: 1,
      listType: "text",
      beforeUpload(file, fileList) {
        if (
          file.type !== "application/pdf" &&
          file.type !== "application/vnd.ms-powerpoint" &&
          file.type !== "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ) {
          message.error("Vui lòng chọn file có định dạng PDF, PPT hoặc PPTX!");
          return Upload.LIST_IGNORE;
        } else if (file.size / 1024 / 1024 > 20) {
          message.error("Vui lòng chỉ gửi file có kích thước dưới 20 MB.");
          return Upload.LIST_IGNORE;
        }
        return false;
      },
    };
    let columnsHop = [
      {
        title: 'Thời gian diễn ra',
        dataIndex: 'ThoiGian',
        width: 150,
        render: (value, record) => {
          if (value === null) return "-";
          return <div>
            <Text>{moment(value, "YYYY-MM-DD HH:mm:ss").format("HH:mm:ss DD/MM/YYYY")}</Text>
            <br/>
            {moment(value, "YYYY-MM-DD HH:mm:ss").isAfter(moment()) && <Tag color="red">Chưa diễn ra</Tag>}
            {record.IsCurrent === true && <Tag color="green">Sử dụng</Tag>}
          </div>
        }
      },
      {
        title: 'Người tham gia',
        dataIndex: 'ThanhPhan',
        width: 250,
        render: value => {
          if (value === null || value === "[]") return "-";
          let thanhPhanIds = JSON.parse(value);
          let thanhPhan = tatCaUser.filter(x => thanhPhanIds.includes(x.UserId));
          return thanhPhan.map(tk => <Row key={tk.UserId}><Text><Avatar size="small" icon={<UserOutlined />} src={tk.Avatar} /> {tk.DisplayName}</Text></Row>);
        }
      },
      {
        title: 'Đường dẫn cuộc họp',
        dataIndex: 'LinkHop',
        render: value => <Link target="_blank" href={value}><Space size="small"><LinkOutlined /> {value}</Space></Link>
      },
      {
        title: 'File thuyết trình',
        dataIndex: 'FileThuyetTrinh',
        width: 250,
        render: (value, record) => value && renderAttachedFile(1, 1, {
          UserId: record.UserId,
          DisplayName: record.FileThuyetTrinh,
          FileName: record.FileThuyetTrinh,
          FilePath: record.FileThuyetTrinhPath,
        }, false, false)
      },
      {
        title: 'Tác vụ',
        dataIndex: 'Index',
        width: 50,
        align: "center",
        render: (value, record) => <>
          <Popconfirm
            title="Bạn chắc chắn muốn gửi lời nhắc về cuộc họp này tới thành phần cuộc họp?"
            onConfirm={() => handleNhacHop(record)}
            okText={<><BellOutlined /> Nhắc họp</>}
            cancelText="Thoát"
          >
            <Button
              type="warning"
              style={{ margin: 2 }}
              title="Nhắc họp"
              icon={<BellOutlined />}
            >Nhắc họp</Button>
          </Popconfirm>
          <Button
            icon={<EditOutlined />}
            style={{ margin: 2 }}
            title="Sửa"
            onClick={() => editCuocHop(record)}
          ></Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            style={{ margin: 2 }}
            title="Xóa"
            onClick={() => xoaCuocHop(record)}
          ></Button>
        </>
      }
    ]
    return (
      <>
        <Button
          type="lightdark"
          icon={<CalendarOutlined />}
          style={{ marginTop: 5 }}
          onClick={showListCuocHop}
        >
          Quản lý cuộc họp
        </Button>
        <Drawer
          title="Danh sách các cuộc họp của hồ sơ"
          placement="right"
          width={1100}
          className="drawer-responsive"
          visible={isListCuocHopVisible}
          onClose={hideListCuocHop}
          maskClosable={false}
          footer={<Button onClick={hideListCuocHop}>Đóng</Button>}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={addCuocHop}
          >
            Thêm cuộc họp
          </Button>
          <Table
            rowKey="CuocHopId"
            columns={columnsHop}
            dataSource={listCuocHop}
            loading={loadingListCuocHop}
            size="small"
            bordered
            pagination={false}
            style={{ marginTop: 5 }}
          />
          <Drawer
            title={isEditHop ? "Sửa cuộc họp" : "Thêm cuộc họp"}
            width={500}
            onClose={closeDrawerCuocHop}
            visible={isDrawerHopVisible}
            footer={
              <Space size="small">
                <Button
                  type={isEditHop ? "primary" : "success"}
                  icon={isEditHop ? <SaveOutlined /> : <PlusOutlined />}
                  onClick={handleSubmitCuocHop}
                  loading={loadingFormHop}
                >
                  {isEditHop ? "Lưu" : "Thêm mới"}
                </Button>
              </Space>
            }
          >
            <Spin spinning={loadingFormHop}>
              <Form
                form={formHop}
                name="FormHop"
                layout="vertical"
                initialValues={{
                  IsCurrent: true,
                }}
                className="cuoc-hop-form"
              >
                <Form.Item name="CuocHopId" hidden={true} > <Input /> </Form.Item>
                <Form.Item
                  label="Đường dẫn phòng họp online"
                  name="LinkHop"
                  rules={[{ required: true, message: 'Thông tin bắt buộc', },]}
                >
                  <Input maxLength={255} prefix={<LinkOutlined />} />
                </Form.Item>
                <Form.Item
                  label="Thành phần tham gia"
                  name="ThanhPhan"
                  rules={[{ required: true, message: 'Thông tin bắt buộc', },]}
                >
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Chọn danh sách"
                    onChange={handleChonThanPhan}
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    <Option key="Toàn bộ hội đồng" value="Toàn bộ hội đồng">
                      <UsergroupAddOutlined /> CHỌN TOÀN BỘ HỘI ĐỒNG
                    </Option>
                    <Option key="Tất cả người dùng" value="Tất cả người dùng">
                      <UsergroupAddOutlined /> CHỌN TẤT CẢ NGƯỜI DÙNG
                    </Option>
                    {allUserOptions}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Thời gian diễn ra"
                  name="ThoiGian"
                  rules={[{ required: true, message: 'Thông tin bắt buộc', },]}
                >
                  <DatePicker
                    placeholder={"Chọn thời gian"}
                    showTime
                    format="DD-MM-YYYY HH:mm"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item name="FileThuyetTrinh" label="File thuyết trình" valuePropName="file" >
                  <Upload {...propsUploadFileThuyetTrinh}>
                    <Button icon={<UploadOutlined />} title="1 file pdf hoặc PowerPoint (ppt, pptx)">Chọn file</Button>
                  </Upload>
                </Form.Item>
                <Form.Item
                  label="Sử dụng cuộc họp"
                  name="IsCurrent"
                  valuePropName="checked"
                >
                  <Checkbox>Hiển thị cuộc họp ở hồ sơ</Checkbox>
                </Form.Item>
              </Form>
            </Spin>
          </Drawer>
        </Drawer>
      </>
    );
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
                <Text type="secondary"><HistoryOutlined /> {moment(ls.ThoiGian).format("YYYY-MM-DD HH:mm")}</Text>
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

  if (loadingXuLy) {
    return (
      <Spin tip="Đang xử lý...">
        <Alert
          message="Đang xử lý yêu cầu!"
          description="Xin vui lòng chờ trong giây lát..."
          type="info"
        />
      </Spin>
    );
  }

  if (loadingXuLyMsg) {
    message.loading({ content: 'Đang xử lý...', key: 'loadingXuLy' });
  } else {
    message.destroy('loadingXuLy');
  }

  return (
    <Col>
      <Row justify="space-between" style={{ marginBottom: 12 }}>
        <Col>
          <Title style={{ color: colors.title }} level={3}>
            <Tooltip title="Trở lại danh sách hồ sơ">{<ArrowLeftOutlined onClick={() => history.push("/ho-so")} />}</Tooltip> Chi tiết hồ sơ
            {listUserRole.admin.includes(userInfo.Role) && <Button
              icon={<HistoryOutlined />}
              style={{ marginLeft: 10 }}
              onClick={showLichSuHoSo}
            >Lịch sử</Button>}
          </Title>
        </Col>
        <Col>
          {(currentHop?.LinkHop && currentHop?.LinkHop?.length > 0) &&
            <Text strong>
              <Space size="small">Cuộc họp sẽ diễn ra tại <Link target="_blank" href={currentHop?.LinkHop}><LinkOutlined /> {currentHop?.LinkHop}</Link></Space>
              <br />
              {currentHop?.FileThuyetTrinh && <Space size="small">{renderAttachedFile(1, 1, {
                UserId: currentHop?.UserId,
                FileName: currentHop?.FileThuyetTrinh,
                FilePath: currentHop?.FileThuyetTrinhPath,
                LinkText: "Tài liệu thuyết trình"
              }, false, false)}</Space>}
            </Text>
          }
        </Col>
      </Row>
      <Row gutter={[40, 0]}>
        <Col span={12}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Tên đề tài</Text>
          <Tooltip title={hoSo.TenDeTai} placement="bottomLeft" color="blue">
            <Input style={{ marginBottom: 20 }} value={hoSo.TenDeTai} readOnly />
          </Tooltip>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Tên đề tài viết tắt
          </Text>
          <Input
            style={{ marginBottom: 20 }}
            value={hoSo.TenVietTat}
            readOnly
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Tên nghiên cứu viên chính / Chủ nhiệm đề tài
          </Text>
          <Input
            style={{ marginBottom: 20 }}
            value={hoSo.NghienCuuVien}
            readOnly
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Cơ quan thực hiện / Chủ trì đề tài
          </Text>
          <Input
            style={{ marginBottom: 20 }}
            value={hoSo.CoQuanThucHien}
            readOnly
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Cấp quản lý</Text>
          <Input style={{ marginBottom: 20 }} value={hoSo.CapQuanLy} readOnly />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Thời gian thực hiện
          </Text>
          <Input
            style={{ marginBottom: 20 }}
            value={hoSo.ThoiGianThucHien}
            readOnly
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Kinh phí dự kiến
          </Text>
          <Input
            style={{ marginBottom: 20 }}
            value={hoSo.KinhPhiDuKien}
            readOnly
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Mô tả chi tiết
          </Text>
          <TextArea style={{ marginBottom: 20 }} maxLength={500} value={hoSo.MoTa} readOnly />
        </Col>
        <Col span={12}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Mã số đề tài</Text>
          <Input style={{ marginBottom: 20 }} value={hoSo.MaSoDeTai} readOnly />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Nhà tài trợ</Text>
          <Input style={{ marginBottom: 20 }} value={hoSo.NhaTaiTro} readOnly />
          <Row>
            <Col span={showLanBoSung === true ? 12 : 24}>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                Phân loại hồ sơ
              </Text>
              <Input style={{ marginBottom: 20 }} value={hoSo.LoaiHoSo} readOnly />
            </Col>
            <Col span={showLanBoSung === true ? 1 : 0}>
            </Col>
            <Col span={showLanBoSung === true ? 11 : 0}>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                Lần bổ sung
              </Text>
              <Input style={{ width: "100%", marginBottom: 20 }} value={hoSo.LanBoSung} readOnly />
            </Col>
          </Row>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Phân loại đề tài
          </Text>
          <Input style={{ marginBottom: 20 }} value={hoSo.LoaiDeTai} readOnly />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Đề nghị được thử nghiệm lâm sàng giai đoạn
          </Text>
          <Input
            style={{ marginBottom: 20 }}
            value={hoSo.GiaiDoanThuNghiem}
            readOnly
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Ngày hộp hồ sơ giấy tới hội đồng
          </Text>
          <Input
            style={{ marginBottom: 20 }}
            value={hoSo.NgayNopHoSoGiay && moment(hoSo.NgayNopHoSoGiay).format("DD-MM-YYYY")}
            readOnly
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Ngày được hội đồng chấp thuận (ban đầu)
          </Text>
          <Input
            style={{ marginBottom: 20 }}
            value={hoSo.NgayHdddChapThuan && moment(hoSo.NgayHdddChapThuan).format("DD-MM-YYYY")}
            readOnly
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Lệ phí</Text>
          <Row gutter={16}>
            <Col span={12}>
              <Input value={hoSo.LePhi} readOnly />
              {renderAttachedFiles("lephi")}
            </Col>
            <Col span={12}>
              {renderBienNhan()}
            </Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={[40, 0]}>
        <Col span={12}>
          <Text style={{ fontSize: 15, fontWeight: "bold", marginRight: 10 }}>
            Hồ sơ trình nộp
          </Text>
        </Col>
        <Col span={24} style={{ marginBottom: 40 }}>
          {renderTableDinhKem(hoSo.LoaiDeTai)}
        </Col>
      </Row>
      <Row gutter={[40, 0]}>
        <Col span={24}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Thông tin người nộp hồ sơ
          </Text>
        </Col>
        <Col span={12}>
          <Text style={{ fontSize: 14 }}>Họ và tên</Text>
          <Input
            style={{ marginBottom: 20 }}
            value={hoSo.NguoiNopHoTen}
            readOnly
          />
          <Text style={{ fontSize: 14 }}>Địa chỉ email</Text>
          <Input
            style={{ marginBottom: 20 }}
            value={hoSo.NguoiNopEmail}
            readOnly
          />
        </Col>
        <Col span={12}>
          <Text style={{ fontSize: 14 }}>Số điện thoại</Text>
          <Input
            style={{ marginBottom: 20 }}
            value={hoSo.NguoiNopPhone}
            readOnly
          />
          <Text style={{ fontSize: 14 }}>
            Địa chỉ
            <Text style={{ fontSize: 12 }}> (Không bắt buộc)</Text>
          </Text>
          <Input
            style={{ marginBottom: 20 }}
            value={hoSo.NguoiNopDiaChi}
            readOnly
          />
        </Col>
      </Row>
      {renderDuyetHoSoGiay()}
      {hoSo.DuyetHoSoGiay === true
        ? <>
          {renderNghienCuuSinh()}
          {renderAllNhanXetHDDD()}
          {renderThuKy()}
          {renderNhanXetHoiDong()}
        </>
        : <></>
      }
      {drawerLichSuHoSo()}
    </Col>
  );
}

const mapStateToProps = (state) => ({
  token: state.token,
  userInfo: state.userInfo,
});

export default connect(mapStateToProps, null)(XemHoSo);
