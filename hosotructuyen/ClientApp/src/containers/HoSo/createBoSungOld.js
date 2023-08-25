import React, { useState, useEffect } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Button,
  Popconfirm,
  Select,
  Input,
  DatePicker,
  Upload,
  Spin,
  Alert,
  Table,
  message,
  InputNumber,
  Tooltip,
  Form,
  Modal,
  AutoComplete,
} from "antd";
import {
  MinusCircleOutlined,
  PlusCircleOutlined,
  SendOutlined,
  UploadOutlined
} from "@ant-design/icons";
import {
  config,
  notify,
  listLoaiDinhKem,
} from "../../utils";
import { listGoiYHoSo } from "../../data/goiyhoso";
import moment from "moment";
import Login from "../Login";
import { ButtonGoiYLePhi } from "../../utils/components";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const urlHoSo = `${config.baseUrl}/api/hoso`;
const urlFile = `${config.baseUrl}/api/tailieu`;
const urlThongBao = `${config.baseUrl}/api/thongbao`;

function NopHoSoBoSungOld({ token, userInfo }) {
  let history = useHistory();
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingHoSo, setLoadingHoSo] = useState(false);
  const [hoSoGoc, setHoSoGoc] = useState({});
  const [tenDeTai, setTenDeTai] = useState("");
  const [maSoDeTai, setMaSoDeTai] = useState("");
  const [tenVietTat, setTenVietTat] = useState("");
  const [nhaTaiTro, setNhaTaiTro] = useState("");
  const [nghienCuuVien, setNghienCuuVien] = useState("");
  const [coQuanThucHien, setCoQuanThucHien] = useState("");
  const [capQuanLy, setCapQuanLy] = useState("");
  const [loaiHoSo, setLoaiHoSo] = useState("Nộp bổ sung");
  const [lanBoSung, setLanBoSung] = useState("");
  const [showLanBoSung, setShowLanBoSung] = useState(true);
  const [loaiDeTai, setLoaiDeTai] = useState("");
  const [thoiGianThucHien, setThoiGianThucHien] = useState("");
  const [kinhPhiDuKien, setKinhPhiDuKien] = useState("");
  const [giaiDoanThuNghiem, setGiaiDoanThuNghiem] = useState("");
  const [ngayNopHoSoGiay, setNgayNopHoSoGiay] = useState("");
  const [ngayHdddChapThuan, setNgayHdddChapThuan] = useState("");
  const [moTa, setMoTa] = useState("");
  const [nguoiNopHoTen, setNguoiNopHoTen] = useState("");
  const [nguoiNopEmail, setNguoiNopEmail] = useState("");
  const [nguoiNopPhone, setNguoiNopPhone] = useState("");
  const [nguoiNopDiaChi, setNguoiNopDiaChi] = useState("");
  const [lePhi, setLePhi] = useState("");
  const [filesLePhi, setFilesLePhi] = useState([]);
  const [filesLePhiView, setFilesLePhiView] = useState([]);
  //const [filesHanhChinh, setFilesHanhChinh] = useState([]);
  //const [filesHanhChinhView, setFilesHanhChinhView] = useState([]);
  //const [filesNghienCuu, setFilesNghienCuu] = useState([]);
  //const [filesNghienCuuView, setFilesNghienCuuView] = useState([]);
  //const [filesBenhNhan, setFilesBenhNhan] = useState([]);
  //const [filesBenhNhanView, setFilesBenhNhanView] = useState([]);
  //const [filesKhac, setFilesKhac] = useState([]);
  //const [filesKhacView, setFilesKhacView] = useState([]);
  const [taiLieuForm] = Form.useForm();
  const showError = () => {
    message.error(notify.errorApi);
  };

  //function handleLoaiHoSo(value) {
  //  setLoaiHoSo(value);
  //  setShowLanBoSung(value === "Nộp bổ sung");
  //}
  function handleLanBoSung(value) {
    setLanBoSung(value);
  }
  //function handleLoaiDeTai(value) {
  //  setLoaiDeTai(value);
  //}
  function handleGiaiDoanThuNghiem(value) {
    setGiaiDoanThuNghiem(value);
  }
  function handleLePhi(value) {
    setLePhi(value);
  }
  //function handleTenDeTai({ target: { value } }) {
  //  setTenDeTai(value);
  //}
  //function handleMaSoDeTai({ target: { value } }) {
  //  setMaSoDeTai(value);
  //}
  //function handleTenVietTat({ target: { value } }) {
  //  setTenVietTat(value);
  //}
  //function handleNhaTaiTro({ target: { value } }) {
  //  setNhaTaiTro(value);
  //}
  //function handleNghienCuuVien({ target: { value } }) {
  //  setNghienCuuVien(value);
  //}
  //function handleCoQuanThucHien({ target: { value } }) {
  //  setCoQuanThucHien(value);
  //}
  //function handleCapQuanLy({ target: { value } }) {
  //  setCapQuanLy(value);
  //}
  function handleKinhPhiDuKien({ target: { value } }) {
    setKinhPhiDuKien(value);
  }
  function handleNguoiNopHoTen({ target: { value } }) {
    setNguoiNopHoTen(value);
  }
  function handleNguoiNopEmail({ target: { value } }) {
    setNguoiNopEmail(value);
  }
  function handleNguoiNopPhone({ target: { value } }) {
    setNguoiNopPhone(value);
  }
  function handleNguoiNopDiaChi({ target: { value } }) {
    setNguoiNopDiaChi(value);
  }
  function handleThoiGianThucHien({ target: { value } }) {
    setThoiGianThucHien(value);
  }
  function handleNgayNopHoSoGiay(date, dateString) {
    setNgayNopHoSoGiay(dateString);
  }
  function handleNgayHdddChapThuan(date, dateString) {
    setNgayHdddChapThuan(dateString);
  }
  const handleMoTa = (e) => {
    setMoTa(e.target.value);
  };

  async function uploadFile(hoSoID, category, filePending) {
    if (filePending.length > 0) {
      const fd = new FormData();
      for (let i = 0; i < filePending.length; i++) {
        fd.append("files", filePending[i]);
      }
      fd.append("filesInfo", JSON.stringify([]));
      await Axios.post(
        urlFile + "/hoso/" + hoSoID + "/" + category + "/" + userInfo.UserId,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((result) => {
        if (result.data.Error === true) {
          message.error(notify.errorUpload);
        }
      })
      .catch(() => {
        message.error(notify.errorUpload);
      });
    }
  }
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
        console.debug(currentFile);
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
  async function handleUploadFile(idCreate) {
    let uploads = [
      uploadFile(idCreate, "lephi", filesLePhi),
      //uploadFile(idCreate, "hanhchinh", filesHanhChinh),
      //uploadFile(idCreate, "nghiencuu", filesNghienCuu),
      //uploadFile(idCreate, "benhnhan", filesBenhNhan),
      //uploadFile(idCreate, "khac", filesKhac),
      handleUploadFileTrinhNop(idCreate),
    ];
    Promise.all(uploads).then(() => {
      return true;
    }, (ex) => {
      console.debug("Error on handleUploadFile", ex);
      return false;
    });
  }
  // Xử lý data và upload các file trong bảng “Hồ sơ trình nộp” (HSTN)
  async function handleUploadFileTrinhNop(idCreate) {
    let filesArray = [];
    let result = [];
    taiLieuForm
      .validateFields()
      .then((formData) => {
        console.debug("Dữ liệu form trình nộp:", formData);
        // Flat các array thành 1 array chung
        filesArray = Object.values(formData).flat();
        console.debug(
          "Dữ liệu flat trình nộp Object.values(formData).flat():",
          filesArray
        );
      }).then(() => {
        // Gỡ các item null hoặc undefined
        filesArray = filesArray.filter((x) => {
          return x !== undefined && x !== null;
        });
      }).then(() => {
        // Upload các file, loop qua array loại đính kèm (dùng cho bảng HSTN)
        listLoaiDinhKem.filter(_ldk => _ldk.phanLoaiDeTai === loaiDeTai).forEach(_ldk => {
          let resultX = uploadFileWithInfo(idCreate, _ldk.category, filesArray.filter(_file => _file.Category === _ldk.category));
          result.push(resultX);
        });
      }).then(() => {
        return result;
      }).catch((ex) => {
        console.debug("Error in handleUploadFileTrinhNop", ex);
        return result;
      });
  };
  // Xử lý tạo thông báo
  function handelCreateNotification(hosoId, detai) {
    Axios({
      method: "POST",
      url: urlThongBao,
      data: JSON.stringify({
        NguoiTaoId: userInfo.UserId,
        NguoiNhanId: 0, // 0 tuong duong voi admin
        NgayTao: moment().format("DD-MM-YYYY HH:mm:ss"),
        HoSoId: hosoId,
        NoiDung: "Vừa có người nộp hồ sơ bổ sung: " + detai,
        LoaiThongBao: "hoso",
        TrangThai: "Mới",
        NguoiGui: userInfo.DisplayName + " - " + userInfo.UserName,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
  }
  // Thông tin hồ sơ
  async function getHoSo() {
    setLoadingHoSo(true);
    await Axios({
      method: "GET",
      url: "/api/hoso/" + id,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        let hoSoGoc = res.data[0];
        setHoSoGoc(hoSoGoc);
        setTenDeTai(hoSoGoc.TenDeTai);
        setMaSoDeTai(hoSoGoc.MaSoDeTai);
        setTenVietTat(hoSoGoc.TenVietTat);
        setNhaTaiTro(hoSoGoc.NhaTaiTro);
        setNghienCuuVien(hoSoGoc.NghienCuuVien);
        setLoaiHoSo("Nộp bổ sung");
        setLoaiDeTai(hoSoGoc.LoaiDeTai);
        setCoQuanThucHien(hoSoGoc.CoQuanThucHien);
        setCapQuanLy(hoSoGoc.CapQuanLy);
        setNguoiNopHoTen(hoSoGoc.NguoiNopHoTen);
        setNguoiNopPhone(hoSoGoc.NguoiNopPhone);
        setNguoiNopEmail(hoSoGoc.NguoiNopEmail);
        setNguoiNopDiaChi(hoSoGoc.NguoiNopDiaChi);
      })
      .then(() => {
        setLoadingHoSo(false);
      })
      .catch(() => {
        setLoadingHoSo(false);
        showError();
      });
  }
  // Số lần bổ sung
  async function getLanBoSungCuoi() {
    await Axios({
      method: "GET",
      url: "/api/hoso/" + id + "/lanbosungcuoi",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        let lanBoSungCuoi = res.data || 0;
        lanBoSungCuoi++;
        setLanBoSung(lanBoSungCuoi);
      })
      .catch(() => {
        showError();
      });
  }

  useEffect(() => {
    if (token) {
      getHoSo();
      getLanBoSungCuoi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  // Xử lý nộp hồ sơ
  async function handleNopHoSo(idCreate) {
    if (
      tenDeTai === "" ||
      maSoDeTai === "" ||
      tenVietTat === "" ||
      nhaTaiTro === "" ||
      nghienCuuVien === "" ||
      coQuanThucHien === "" ||
      capQuanLy === "" ||
      loaiHoSo === "" ||
      (loaiHoSo === "Nộp bổ sung" && lanBoSung === "") ||
      thoiGianThucHien === "" ||
      kinhPhiDuKien === "" ||
      //giaiDoanThuNghiem === "" ||
      ngayNopHoSoGiay === "" ||
      nguoiNopHoTen === "" ||
      nguoiNopEmail === "" ||
      nguoiNopPhone === ""
      //|| lePhi === ""
      //|| filesLePhi.length < 1
    ) {
      message.error(notify.errorRequired);
      //console.table({ tenDeTai, maSoDeTai, tenVietTat, nhaTaiTro, nghienCuuVien, coQuanThucHien, capQuanLy, loaiHoSo, lanBoSung, thoiGianThucHien, kinhPhiDuKien, giaiDoanThuNghiem, ngayNopHoSoGiay, nguoiNopHoTen, nguoiNopEmail, nguoiNopPhone });
    } else {
      setLoading(true);
      let preWorks = [
        handleUploadFile(idCreate),
      ];
      await Promise.all(preWorks).then(() => {
        Axios({
        method: "POST",
        url: urlHoSo,
        data: JSON.stringify({
          HoSoId: idCreate,
          ParentId: hoSoGoc.HoSoId,
          UserId: userInfo.UserId,
          TenDeTai: hoSoGoc.TenDeTai,
          MaSoDeTai: hoSoGoc.MaSoDeTai,
          TenVietTat: hoSoGoc.TenVietTat,
          NhaTaiTro: hoSoGoc.NhaTaiTro,
          NghienCuuVien: hoSoGoc.NghienCuuVien,
          CoQuanThucHien: hoSoGoc.CoQuanThucHien,
          CapQuanLy: hoSoGoc.CapQuanLy,
          LoaiHoSo: loaiHoSo,
          LanBoSung: lanBoSung,
          LoaiDeTai: hoSoGoc.LoaiDeTai,
          ThoiGianThucHien: thoiGianThucHien,
          KinhPhiDuKien: kinhPhiDuKien,
          GiaiDoanThuNghiem: giaiDoanThuNghiem,
          NgayNopHoSoGiay: ngayNopHoSoGiay,
          NgayHdddChapThuan: ngayHdddChapThuan,
          NgayTaoHoSo: moment().format("DD-MM-YYYY HH:mm"),
          LePhi: lePhi,
          NguoiNopHoTen: nguoiNopHoTen,
          NguoiNopEmail: nguoiNopEmail,
          NguoiNopPhone: nguoiNopPhone,
          NguoiNopDiaChi: nguoiNopDiaChi,
          MoTa: moTa,
          TrangThai: "Chờ xét duyệt",
          FileKetQua: "",
          LinkHop: "",
          GioHop: "",
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((result) => {
          console.debug('handleNopHoSo POST success', result);
          if (result.data.Error !== true) {
              handelCreateNotification(idCreate, tenDeTai);
              history.goBack();
              message.success(result.data.Message);
              setLoading(false);
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
          console.debug('handleNopHoSo POST error', error);
          setLoading(false);
          showError('Api');
        });
      }, (ex) => {
        message.error("Có lỗi khi upload file");
        console.debug("Error while executing preWorks", ex);
        setLoading(false);
      });
    }
  }

  const propsUploadLePhi = {
    name: "file",
    multiple: true,
    listType: "text",
    fileList: filesLePhiView,
    onChange({ fileList }) {
      setFilesLePhiView(fileList);
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
        const newList = filesLePhi.concat(fileList);
        setFilesLePhi(newList);
      }
      return false;
    },
    onRemove(file) {
      const index = filesLePhiView.indexOf(file);
      const newFileList = filesLePhi.slice();
      newFileList.splice(index, 1);
      setFilesLePhi(newFileList);
    },
  };
  //const propsUploadHanhChinh = {
  //  name: "file",
  //  multiple: true,
  //  listType: "text",
  //  fileList: filesHanhChinhView,
  //  onChange({ fileList }) {
  //    setFilesHanhChinhView(fileList);
  //  },
  //  beforeUpload(file, fileList) {
  //    if (file.type !== "application/pdf") {
  //      message.error("Vui lòng chọn đúng định dạng file pdf!");
  //    } else if (file.size / 1024 / 1024 > 20) {
  //      message.error("Vui lòng chỉ gửi file có kích thước dưới 20 MB.");
  //    } else {
  //      const newList = filesHanhChinh.concat(fileList);
  //      setFilesHanhChinh(newList);
  //    }
  //    return file.type === "application/pdf" ? false : Upload.LIST_IGNORE;
  //  },
  //  onRemove(file) {
  //    const index = filesHanhChinhView.indexOf(file);
  //    const newFileList = filesHanhChinh.slice();
  //    newFileList.splice(index, 1);
  //    setFilesHanhChinh(newFileList);
  //  },
  //};
  //const propsUploadNghienCuu = {
  //  name: "file",
  //  multiple: true,
  //  listType: "text",
  //  fileList: filesNghienCuuView,
  //  onChange({ fileList }) {
  //    setFilesNghienCuuView(fileList);
  //  },
  //  beforeUpload(file, fileList) {
  //    if (file.type !== "application/pdf") {
  //      message.error("Vui lòng chọn đúng định dạng file pdf!");
  //    } else if (file.size / 1024 / 1024 > 20) {
  //      message.error("Vui lòng chỉ gửi file có kích thước dưới 20 MB.");
  //    } else {
  //      const newList = filesNghienCuu.concat(fileList);
  //      setFilesNghienCuu(newList);
  //    }
  //    return file.type === "application/pdf" ? false : Upload.LIST_IGNORE;
  //  },
  //  onRemove(file) {
  //    const index = filesNghienCuuView.indexOf(file);
  //    const newFileList = filesNghienCuu.slice();
  //    newFileList.splice(index, 1);
  //    setFilesNghienCuu(newFileList);
  //  },
  //};
  //const propsUploadBenhNhan = {
  //  name: "file",
  //  multiple: true,
  //  listType: "text",
  //  fileList: filesBenhNhanView,
  //  onChange({ fileList }) {
  //    setFilesBenhNhanView(fileList);
  //  },
  //  beforeUpload(file, fileList) {
  //    if (file.type !== "application/pdf") {
  //      message.error("Vui lòng chọn đúng định dạng file pdf!");
  //    } else if (file.size / 1024 / 1024 > 20) {
  //      message.error("Vui lòng chỉ gửi file có kích thước dưới 20 MB.");
  //    } else {
  //      const newList = filesBenhNhan.concat(fileList);
  //      setFilesBenhNhan(newList);
  //    }
  //    return file.type === "application/pdf" ? false : Upload.LIST_IGNORE;
  //  },
  //  onRemove(file) {
  //    const index = filesBenhNhanView.indexOf(file);
  //    const newFileList = filesBenhNhan.slice();
  //    newFileList.splice(index, 1);
  //    setFilesBenhNhan(newFileList);
  //  },
  //};
  //const propsUploadKhac = {
  //  name: "file",
  //  multiple: true,
  //  listType: "text",
  //  fileList: filesKhacView,
  //  onChange({ fileList }) {
  //    setFilesKhacView(fileList);
  //  },
  //  beforeUpload(file, fileList) {
  //    if (file.type !== "application/pdf") {
  //      message.error("Vui lòng chọn đúng định dạng file pdf!");
  //    } else if (file.size / 1024 / 1024 > 20) {
  //      message.error("Vui lòng chỉ gửi file có kích thước dưới 20 MB.");
  //    } else {
  //      const newList = filesKhac.concat(fileList);
  //      setFilesKhac(newList);
  //    }
  //    return file.type === "application/pdf" ? false : Upload.LIST_IGNORE;
  //  },
  //  onRemove(file) {
  //    const index = filesKhacView.indexOf(file);
  //    const newFileList = filesKhac.slice();
  //    newFileList.splice(index, 1);
  //    setFilesKhac(newFileList);
  //  },
  //};

  // Bảng tài liệu trình nộp
  function TaiLieuTable({ phanLoaiDeTai }) {
    let rowIndex = 0;
    let tableData = listLoaiDinhKem
      .filter((ldk) => ldk.phanLoaiDeTai === phanLoaiDeTai)
      .map((ldk) => {
        rowIndex++;
        return {
          index: rowIndex,
          categoryCode: ldk.category,
          categoryTitle: ldk.title,
          attachments: ldk.category
        };
      });
    let tableColumns = [
      {
        title: "TT",
        dataIndex: "index",
        width: 50,
        align: "center",
        render: (value) => <Typography.Text>{value}</Typography.Text>
      },
      {
        title: "Loại tài liệu",
        dataIndex: "categoryTitle",
        width: "calc(25% - 50px)",
        render: (value, rowData) => (
          <>
            <Row>
              <Typography.Text>{value}</Typography.Text>
            </Row>
            <Row>
              <Button
                size="small"
                type="dashed"
                onClick={() => handleModalGoiY(rowData, true)}
              >
                Gợi ý
              </Button>
            </Row>
          </>
        )
      },
      {
        title: "Đính kèm",
        key: "attachments",
        dataIndex: "categoryCode",
        width: "75%",
        render: (value) => <TaiLieuDynamicFormList loaiTaiLieu={value} />
      }
    ];
    return (
      <Form name="TaiLieuTrinhNopForm" autoComplete="off" form={taiLieuForm}>
        <Table
          columns={tableColumns}
          dataSource={tableData}
          bordered
          pagination={false}
          size="middle"
          rowKey={(rowData) => rowData.index}
        />
      </Form>
    );
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
    const autoCompleteData = listGoiYHoSo.find(gy => gy.category === loaiTaiLieu).goiY.map(gy => ({ value: gy.DocNameVN }));
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
                    <AutoComplete
                      options={autoCompleteData}
                      filterOption={(inputValue, option) =>
                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                      }
                    >
                      <Input placeholder="Tên tài liệu" />
                    </AutoComplete>
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
  // Modal gợi ý
  const [modalGoiYVisible, setModalGoiYVisible] = useState(false);
  const [modalGoiYTitle, setModalGoiYTitle] = useState("");
  const [modalGoiYContent, setModalGoiYContent] = useState("");
  function handleModalGoiY(data, visible) {
    if (data !== null) {
      setModalGoiYTitle(data.categoryTitle);
      let goiYList = listGoiYHoSo.find(x => x.category === data.categoryCode).goiY;
      let tableGoiYColumns = [
        {
          title: "Tài liệu",
          dataIndex: "DocNameVN",
          render: (value, rowData) => (
            <Paragraph
              copyable
              ellipsis={{ rows: 2, expandable: true, symbol: "Thêm..." }}
              style={{ marginBottom: 0 }}
              type={rowData.IsRequired === true ? "primary" : ""}
            >
              {value}
            </Paragraph>
          )
        }
      ];
      setModalGoiYContent(
        <Table
          columns={tableGoiYColumns}
          dataSource={goiYList}
          bordered
          size="small"
          pagination={false}
          showHeader={false}
        />
      );
    }
    setModalGoiYVisible(visible);
  };
  function ModalGoiY() {
    return (
      <Modal
        visible={modalGoiYVisible}
        title={modalGoiYTitle}
        width={1000}
        onCancel={() => handleModalGoiY(null, false)}
        footer={null}
      >
        {modalGoiYContent}
      </Modal>
    );
  }

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
      <Spin tip="Đang nộp hồ sơ bổ sung...">
        <Alert
          message="Hệ thống đang xử lý!"
          description="Xin vui lòng chờ trong giây lát..."
          type="info"
        />
      </Spin>
    );
  }
  if (loadingHoSo) {
    return (
      <Spin tip="Đang tải dữ liệu...">
        <Alert
          message="Hệ thống đang xử lý!"
          description="Xin vui lòng chờ trong giây lát..."
          type="info"
        />
      </Spin>
    );
  }

  return (
    <Col>
      <Row style={{ marginBottom: 20 }}>
        <Title level={3}>Nộp hồ sơ bổ sung</Title>
      </Row>
      <Row gutter={[40, 40]}>
        <Col span={12}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Tên đề tài</Text>
          <Input style={{ marginBottom: 20 }} value={hoSoGoc.TenDeTai} disabled />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Tên đề tài viết tắt
          </Text>
          <Input style={{ marginBottom: 20 }} value={hoSoGoc.TenVietTat} disabled />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Tên nghiên cứu viên chính / Chủ nhiệm đề tài
          </Text>
          <Input style={{ marginBottom: 20 }} value={hoSoGoc.NghienCuuVien} disabled />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Cơ quan thực hiện / Chủ trì đề tài
          </Text>
          <Input style={{ marginBottom: 20 }} value={hoSoGoc.CoQuanThucHien} disabled />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Cấp quản lý</Text>
          <Input style={{ marginBottom: 20 }} value={hoSoGoc.CapQuanLy} disabled />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Thời gian thực hiện dự kiến
          </Text>
          <Input
            style={{ marginBottom: 20 }}
            onChange={handleThoiGianThucHien}
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Kinh phí dự kiến
          </Text>
          <Input style={{ marginBottom: 20 }} onChange={handleKinhPhiDuKien} />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Mô tả chi tiết
            <Text style={{ fontSize: 12, fontWeight: "normal" }}>
              {" "}
              (Không bắt buộc)
            </Text>
          </Text>
          <TextArea showCount maxLength={500} onChange={handleMoTa} />
        </Col>
        <Col span={12}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Mã số đề tài</Text>
          <Input style={{ marginBottom: 20 }} value={hoSoGoc.MaSoDeTai} disabled />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Nhà tài trợ</Text>
          <Input style={{ marginBottom: 20 }} value={hoSoGoc.NhaTaiTro} disabled />
          <Row>
            <Col span={showLanBoSung === true ? 12 : 24}>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                Phân loại hồ sơ
              </Text>
              <Input style={{ marginBottom: 20 }} value="Nộp bổ sung" disabled />
            </Col>
            <Col span={showLanBoSung === true ? 1 : 0}>
            </Col>
            <Col span={showLanBoSung === true ? 11 : 0}>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                Lần bổ sung
              </Text>
              <InputNumber style={{ width: "100%", marginBottom: 20 }}
                min={0}
                max={99}
                value={lanBoSung}
                onChange={handleLanBoSung} />
            </Col>
          </Row>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Phân loại đề tài
          </Text>
          <Input style={{ marginBottom: 20 }} value={hoSoGoc.LoaiDeTai} disabled />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Đề nghị được thử nghiệm lâm sàng giai đoạn
          </Text>
          <Select
            style={{ width: "100%", marginBottom: 20 }}
            onChange={handleGiaiDoanThuNghiem}
            placeholder="Chọn giai đoạn"
            allowClear={true}
          >
            <Option value="Giai đoạn 1">Giai đoạn 1</Option>
            <Option value="Giai đoạn 2">Giai đoạn 2</Option>
            <Option value="Giai đoạn 3">Giai đoạn 3</Option>
          </Select>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Ngày hộp hồ sơ giấy tới hội đồng
          </Text>
          <DatePicker
            style={{ marginBottom: 20, width: "100%" }}
            onChange={handleNgayNopHoSoGiay}
            placeholder={"Chọn thời gian"}
            format="DD-MM-YYYY"
          />
          <Text style={{ fontSize: 15, fontWeight: "bold", display: "none" }}>
            Ngày được hội đồng chấp thuận
            <Text style={{ fontSize: 12, fontWeight: "normal" }}>
              {" "}
              (Với hồ sơ nộp bổ sung)
            </Text>
          </Text>
          <DatePicker
            style={{ marginBottom: 20, width: "100%", display: "none" }}
            onChange={handleNgayHdddChapThuan}
            placeholder={"Chọn thời gian"}
            format="DD-MM-YYYY"
          />
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Lệ phí <ButtonGoiYLePhi/></Text>
          <Row>
            <Col span={8} style={{ marginRight: 10 }}>
              <Select style={{ width: "100%" }}
                onChange={handleLePhi}
                allowClear
                placeholder="Chọn mức"
              >
                <Option value="Mức 1">Mức 1</Option>
                <Option value="Mức 2">Mức 2</Option>
                <Option value="Mức 3">Mức 3</Option>
                <Option value="Mức 4">Mức 4</Option>
              </Select>
            </Col>
            <Col>
              <Row>
                <Upload {...propsUploadLePhi}>
                  <Button icon={<UploadOutlined />}>Hóa đơn nộp lệ phí</Button>
                </Upload>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={[40, 0]} style={{ marginBottom: 20 }}>
        <Col span={24}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Hồ sơ trình nộp
          </Text>
        </Col>
        <Col span={24}>
          <TaiLieuTable phanLoaiDeTai={loaiDeTai} />
          <ModalGoiY />
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }} gutter={[40, 0]}>
        <Col span={24}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Thông tin người nộp hồ sơ
          </Text>
        </Col>
        <Col span={12}>
          <Text style={{ fontSize: 14 }}>Họ và tên</Text>
          <Input style={{ marginBottom: 20 }} onChange={handleNguoiNopHoTen} value={nguoiNopHoTen} />
          <Text style={{ fontSize: 14 }}>Địa chỉ email</Text>
          <Input style={{ marginBottom: 20 }} onChange={handleNguoiNopEmail} value={nguoiNopEmail} />
        </Col>
        <Col span={12}>
          <Text style={{ fontSize: 14 }}>Số điện thoại</Text>
          <Input style={{ marginBottom: 20 }} onChange={handleNguoiNopPhone} value={nguoiNopPhone} />
          <Text style={{ fontSize: 14 }}>
            Địa chỉ
            <Text style={{ fontSize: 12 }}> (Không bắt buộc)</Text>
          </Text>
          <Input style={{ marginBottom: 20 }} onChange={handleNguoiNopDiaChi} value={nguoiNopDiaChi} />
        </Col>
      </Row>
      <Row justify="space-between">
        <Col>
          <Popconfirm
            title="Bạn chắc chắn đã kiểm tra kỹ và sẽ gửi nộp hồ sơ bổ sung này?"
            onConfirm={() => {
              const idCreate =
                userInfo.UserId + moment().format("YYYYMMDDhhmmss");
              handleNopHoSo(idCreate);
            }}
            okText="OK"
            cancelText="Thoát"
          >
            <Button style={{ marginRight: 10 }} type="primary" icon={<SendOutlined />}>
              Gửi ngay
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Bạn chắc chắn muốn hủy việc gửi hồ sơ bổ sung này?"
            onConfirm={() => history.goBack()}
            okText="OK"
            cancelText="Thoát"
          >
            <Button danger>Hủy bỏ</Button>
          </Popconfirm>
        </Col>
        <Col></Col>
      </Row>
    </Col>
  );
}

const mapStateToProps = (state) => ({
  token: state.token,
  userInfo: state.userInfo,
});

export default connect(mapStateToProps, null)(NopHoSoBoSungOld);
