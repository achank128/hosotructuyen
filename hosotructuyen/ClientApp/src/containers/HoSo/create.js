import React, { useState } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  AutoComplete,
  Alert,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Spin,
  Table,
  Tooltip,
  Typography,
  Upload,
  InputNumber,
  Progress,
  Card,
  Result,
  Tag,
  Checkbox,
} from "antd";
import {
  ExperimentOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  SendOutlined,
  StarFilled,
  UploadOutlined,
} from "@ant-design/icons";
import Button from "antd-button-color"
import {
  notify,
  listLoaiDinhKem,
} from "../../utils";
import { listGoiYHoSo } from "../../data/goiyhoso";
import moment from "moment";
import Login from "../Login";
import { ButtonGoiYLePhi } from "../../utils/components";
import TaiLieuDynamicItem from "./components/TaiLieuDynamicItem";
import TaiLieuStaticItem from "./components/TaiLieuStaticItem";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const urlHoSo = `/api/hoso`;
const urlFile = `/api/tailieu`;
const urlThongBao = `/api/thongbao`;

function NopHoSo({ token, userInfo }) {
  let history = useHistory();
  const [idCreateNowStr] = useState(moment().format("YYYYMMDDHHmmss")); // WORKAROUND: Để không bị update theo moment
  const idCreate = userInfo.UserId + idCreateNowStr;
  const [hoSoForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [showLanBoSung, setShowLanBoSung] = useState(false);
  const [loaiHoSo, setLoaiHoSo] = useState("Nộp ban đầu");
  const [loaiDeTai, setLoaiDeTai] = useState("Thử nghiệm lâm sàng");
  const [filesLePhi, setFilesLePhi] = useState([]);
  const [filesLePhiView, setFilesLePhiView] = useState([]);

  const showError = () => {
    message.error(notify.errorApi);
  };

  const [lanBoSungRules, setLanBoSungRules] = useState([{ required: false }]);
  function handleLoaiHoSo(value) {
    setLoaiHoSo(value);
    setShowLanBoSung(value === "Nộp bổ sung");
    setLanBoSungRules(value === "Nộp bổ sung"
      ? [{ required: true, message: 'Thông tin bắt buộc', }]
      : [{ required: false }]
    );
  }

  function handleLoaiDeTai(value) {
    setLoaiDeTai(value);
  }

  async function uploadFile(hoSoID, category, filePending) {
    if (filePending.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < filePending.length; i++) {
        formData.append("files", filePending[i]);
      }
      await Axios.post(
        urlFile + "/hoso/" + hoSoID + "/" + category + "/" + userInfo.UserId,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      ).catch(() => {
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
  async function uploadFileWithFormData(url, fd, successFunc) {
    await Axios.post(
      url,
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
  async function uploadFileWithInfoOneByOne(hoSoID, _fileList, successFunc = function () { }) {
    if (_fileList.length > 0) {
      let works = [];
      await _fileList.forEach(currentFile => {
        const fd = new FormData();
        let currentFileData = currentFile.FileData.shift();
        fd.append("files", currentFileData.originFileObj);
        let fileInfo = {
          FileName: currentFileData.name,
          Category: currentFile.Category,
          DocNameVN: currentFile.DocNameVN,
          DocNameEN: currentFile.DocNameEN,
          VersionAndDate: currentFile.VersionAndDate,
        };
        fd.append("fileInfo", JSON.stringify(fileInfo));
        works.push(uploadFileWithFormData(`${urlFile}/hoso/${hoSoID}/${currentFile.Category}/${userInfo.UserId}/single`, fd, successFunc));
      });
      Promise.all(works).then(() => { return true });
    }
  }
  async function handleUploadFile(hoSoData) {
    let uploads = [
      uploadFile(idCreate, "lephi", filesLePhi),
      //uploadFile(idCreate, "hanhchinh", filesHanhChinh),
      //uploadFile(idCreate, "nghiencuu", filesNghienCuu),
      //uploadFile(idCreate, "benhnhan", filesBenhNhan),
      //uploadFile(idCreate, "khac", filesKhac),
      handleUploadFileTrinhNop(hoSoData),
    ];
    Promise.all(uploads).then(() => {
      return true;
    }, (ex) => {
      console.debug("Error on handleUploadFile", ex);
      return false;
    });
  }
  // Xử lý data và upload các file trong bảng “Hồ sơ trình nộp” (HSTN)
  async function getFilesTrinhNop(hoSoData) {
    let _allFiles = [];
    let filesArray = [];
    let result = [];
    return new Promise(resolve => {
      hoSoForm
        .validateFields()
        .then(() => {
          let _allFieldKeys = Object.keys(hoSoData);
          _allFieldKeys.forEach((fieldKey) => {
            if (fieldKey.indexOf("FormList") >= 0) {
              if (hoSoData[fieldKey]) {
                _allFiles.push(hoSoData[fieldKey]);
              }
            }
          });
        }).then(() => {
          // Flat các array thành 1 array chung
          filesArray = _allFiles.flat().filter((x) => {
            return x !== undefined && x !== null && x.IsChecked;
          });
          console.debug(
            "Dữ liệu file trình nộp (flat)",
            filesArray
          );
        }).then(() => {
          setTotalFilesCount(filesArray?.length);
          console.debug("getFilesTrinhNop done", filesArray);
          resolve(filesArray);
        }).catch((ex) => {
          console.debug("Error in getFilesTrinhNop", ex);
          resolve(result);
        });
    })
  }
  async function handleUploadFileTrinhNop(hoSoData) {
    const filesArray = await getFilesTrinhNop(hoSoData);
    console.debug("handleUploadFileTrinhNop filesArray", filesArray);
    let result = await uploadFileWithInfoOneByOne(
      idCreate,
      filesArray,
      function () {
        setUploadedFilesCount(uploadedFilesCount => uploadedFilesCount + 1);
      }
    );
    return result;
    //.then(() => {
    //  console.debug("handleUploadFileTrinhNop done");
    //  return result;
    //}).catch((ex) => {
    //  console.debug("Error in handleUploadFileTrinhNop", ex);
    //  return result;
    //});
  };
  // Xử lý tạo thông báo
  function handleCreateNotification(hosoId, detai) {
    Axios({
      method: "POST",
      url: urlThongBao,
      data: JSON.stringify({
        NguoiTaoId: userInfo.UserId,
        NguoiNhanId: 0, // 0 tuong duong voi admin
        NgayTao: moment().format("DD-MM-YYYY HH:mm:ss"),
        HoSoId: hosoId,
        NoiDung: "Vừa có người nộp hồ sơ mới: " + detai,
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
  // Xử lý nộp hồ sơ
  async function handleNopHoSo(idCreate) {
    await hoSoForm
      .validateFields()
      .then(hoSoData => {
        setLoading(true);
        //console.debug(hoSoData);
        let fd = new FormData();
        // Hồ sơ
        let hoSo = {
          HoSoId: idCreate,
          UserId: userInfo.UserId,
          TenDeTai: hoSoData.TenDeTai,
          MaSoDeTai: hoSoData.MaSoDeTai,
          TenVietTat: hoSoData.TenVietTat,
          NhaTaiTro: hoSoData.NhaTaiTro,
          NghienCuuVien: hoSoData.NghienCuuVien,
          CoQuanThucHien: hoSoData.CoQuanThucHien,
          CapQuanLy: hoSoData.CapQuanLy,
          LoaiHoSo: hoSoData.LoaiHoSo,
          LanBoSung: hoSoData.LanBoSung,
          LoaiDeTai: hoSoData.LoaiDeTai,
          ThoiGianThucHien: hoSoData.ThoiGianThucHien,
          KinhPhiDuKien: hoSoData.KinhPhiDuKien,
          GiaiDoanThuNghiem: hoSoData.GiaiDoanThuNghiem,
          NgayNopHoSoGiay: hoSoData.NgayNopHoSoGiay,
          NgayHdddChapThuan: hoSoData.NgayHdddChapThuan,
          NgayTaoHoSo: moment().format("DD-MM-YYYY HH:mm"),
          LePhi: hoSoData.LePhi,
          NguoiNopHoTen: hoSoData.NguoiNopHoTen,
          NguoiNopEmail: hoSoData.NguoiNopEmail,
          NguoiNopPhone: hoSoData.NguoiNopPhone,
          NguoiNopDiaChi: hoSoData.NguoiNopDiaChi,
          MoTa: hoSoData.MoTa,
          TrangThai: "Chờ xét duyệt",
          FileKetQua: "",
          LinkHop: "",
          GioHop: "",
          ParentId: ""
        };
        fd.append("hoSo", JSON.stringify(hoSo));
        //Files
        //let _allFiles = [];
        //let _allFieldKeys = Object.keys(hoSoData);
        //_allFieldKeys.forEach((fieldKey) => {
        //  if (fieldKey.indexOf("FormList") >= 0) {
        //    if (hoSoData[fieldKey]) _allFiles.push(hoSoData[fieldKey]);
        //  }
        //});
        //let _allFilesFlatArray = _allFiles.flat();
        //let filesInfo = [];
        //for (let i = 0; i < _allFilesFlatArray.length; i++) {
        //  let currentFile = _allFilesFlatArray[i];
        //  let currentFileData = currentFile.FileData.shift();
        //  fd.append("files", currentFileData.originFileObj);
        //  filesInfo.push({
        //    FileName: currentFileData.name,
        //    Category: currentFile.Category,
        //    DocNameVN: currentFile.DocNameVN,
        //    DocNameEN: currentFile.DocNameEN,
        //    VersionAndDate: currentFile.VersionAndDate,
        //  });
        //}
        //fd.append("filesInfo", JSON.stringify(filesInfo));
        let preWorks = [
          handleUploadFile(hoSoData),
        ];
        Promise.all(preWorks).then(() => {
          var nopHoSoWaiter = setInterval(() => {
            if (uploadedFilesCount === totalFilesCount) {
              Axios({
                method: "POST",
                url: urlHoSo,
                data: fd,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token,
                },
              })
                .then((result) => {
                  console.debug('handleNopHoSo POST success', result);
                  if (result.data.Error !== true) {
                    handleCreateNotification(idCreate, hoSoData.TenDeTai);
                    //history.goBack();
                    setTimeout(() => {
                      setLoading(false);
                      setIsDone(true);
                      message.success(result.data.Message);
                    }, 2000);
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
                  setUploadedFilesCount(0);
                  setTotalFilesCount(0);
                  idCreate = userInfo.UserId + moment().format("YYYYMMDDHHmmss");
                });
              clearInterval(nopHoSoWaiter);
            }
            else {
              clearInterval(nopHoSoWaiter);
            }
          }, 1000);
        }, (ex) => {
          message.error("Có lỗi khi upload file");
          console.debug("Error while execution preWorks", ex);
          setLoading(false);
        });
      })
      .catch(info => {
        message.error(notify.errorRequired);
        console.debug('Validate failed:', info);
      });
  }
  // Test data
  async function handleLogHoSoData() {
    let _allFilesFlat = [];

    await hoSoForm
      .validateFields()
      .then(hoSoData => {
        console.debug(hoSoData);
        let _allFiles = [];
        let _allFieldKeys = Object.keys(hoSoData);
        _allFieldKeys.forEach((fieldKey) => {
          console.debug(fieldKey, hoSoData[fieldKey]);
          if (fieldKey.indexOf("FormList") >= 0) {
            if (hoSoData[fieldKey]) _allFiles.push(hoSoData[fieldKey]);
          }
        });
        _allFilesFlat = _allFiles.flat().filter((x) => {
          return x !== undefined && x !== null && x.IsChecked;
        });
        //console.debug("All files", _allFiles);
        console.debug("Flat all files", _allFilesFlat);
        message.info("OK");
      })
      .catch(info => {
        message.error(notify.errorRequired);
        console.debug('Validate failed:', info);
      });
  }
  // Fill data
  function fillTestData() {
    hoSoForm.setFieldsValue({
      TenDeTai: "TenDeTai " + idCreate,
      MaSoDeTai: "MaSoDeTai " + idCreate,
      TenVietTat: "TenVietTat " + idCreate,
      NhaTaiTro: "NhaTaiTro " + idCreate,
      NghienCuuVien: "NghienCuuVien " + idCreate,
      CoQuanThucHien: "CoQuanThucHien " + idCreate,
      CapQuanLy: "CapQuanLy " + idCreate,
      LoaiHoSo: "Nộp ban đầu",
      //LanBoSung: "LanBoSung " + idCreate,
      LoaiDeTai: "Thử nghiệm lâm sàng",
      ThoiGianThucHien: "ThoiGianThucHien " + idCreate,
      KinhPhiDuKien: "KinhPhiDuKien " + idCreate,
      GiaiDoanThuNghiem: "Giai đoạn 1",
      NgayNopHoSoGiay: moment().endOf("month"),
      //NgayHdddChapThuan: "NgayHdddChapThuan " + idCreate,
      //NgayTaoHoSo: moment().format("DD-MM-YYYY HH:mm"),
      LePhi: "Mức 1",
      NguoiNopHoTen: "NguoiNopHoTen " + idCreate,
      NguoiNopEmail: "NguoiNopEmail " + idCreate,
      NguoiNopPhone: "NguoiNopPhone " + idCreate,
      NguoiNopDiaChi: "NguoiNopDiaChi " + idCreate,
      MoTa: "MoTa " + idCreate,
    });
  }
  // Upload progress
  const [totalFilesCount, setTotalFilesCount] = useState(0);
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);
  function UploadProgress() {
    return (
      <>
        <Progress
          percent={Math.round(uploadedFilesCount / totalFilesCount * 100)}
          status={uploadedFilesCount > 0 && uploadedFilesCount === totalFilesCount ? "" : "active"}
          strokeWidth={10}
        />
        <div><Text type={uploadedFilesCount > 0 && uploadedFilesCount === totalFilesCount ? "success" : ""}>Đã tải lên {uploadedFilesCount}/{totalFilesCount} file đính kèm ({Math.round(uploadedFilesCount / totalFilesCount * 100)}%)</Text></div>
      </>
    );
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
  function TaiLieuTable({ phanLoaiDeTai, phanLoaiHoSo }) {
    let rowIndex = 0;
    let tableData = listLoaiDinhKem
      .filter((ldk) => ldk.phanLoaiDeTai === phanLoaiDeTai)
      .map((ldk) => {
        rowIndex++;
        return {
          index: rowIndex,
          categoryCode: ldk.category,
          categoryTitle: ldk.title,
          attachments: ldk.category,
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
        render: (value) =>
          <>
            <TaiLieuStaticFormList loaiTaiLieu={value}/>
            <TaiLieuDynamicFormList loaiTaiLieu={value} />
          </>
      }
    ];
    return (
      <Table
        columns={tableColumns}
        dataSource={tableData}
        bordered
        pagination={false}
        size="middle"
        rowKey={(rowData) => rowData.categoryCode}
      />
    );
  }
  // Event data của upload trong form
  const normFile = (e) => {
    //console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  // Form List file đính kèm (cố định)
  function TaiLieuStaticFormList({ loaiTaiLieu }) {
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
    const autoCompleteData = listGoiYHoSo.find(gy => gy.category === loaiTaiLieu).goiY.filter(g => g.IsRequired === true);
    return (
      <Form.List
        key={loaiTaiLieu + "Static"}
        name={loaiTaiLieu + "StaticFormList"}
        initialValue={autoCompleteData}
      >
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <TaiLieuStaticItem 
              key={key} 
              name={name} 
              fieldKey={fieldKey} 
              restField={restField} 
              IsRequired={false} 
              loaiTaiLieu={loaiTaiLieu} 
              propsUploadTaiLieu={propsUploadTaiLieu}
              />
          ))}
          </>
        )}
      </Form.List>
    );
  }
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
              <TaiLieuDynamicItem 
              key={key} 
              name={name} 
              fieldKey={fieldKey} 
              restField={restField} 
              IsRequired={true} 
              loaiTaiLieu={loaiTaiLieu} 
              propsUploadTaiLieu={propsUploadTaiLieu}
              autoCompleteData={autoCompleteData}
              />
            ))}
            <Form.Item style={{ marginTop: 4, marginBottom: 4 }}>
              <Button
                type="lightdark"
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
      <Card>
        <Spin tip="Đang nộp hồ sơ...">
          <Alert
            message="Hệ thống đang xử lý!"
            description="Xin vui lòng chờ trong giây lát..."
            type="info"
          />
        </Spin>
        <UploadProgress />
      </Card>
    );
  }

  if (isDone) {
    return (
      <Result
        status="success"
        title="Nộp hồ sơ thành công"
        subTitle="Hồ sơ đã được gửi lên Hội đồng đạo đức và đang chờ xét duyệt"
        extra={[
          <Button type="primary" key="goToHoSo" onClick={() => { history.push(`/ho-so/${idCreate}`); }}>
            Xem hồ sơ
          </Button>,
          <Button  key="goBack" onClick={() => { history.goBack(); }}>
            Quay lại
          </Button>,
        ]}
      />
    );
  }

  return (
    <Col>
      <Row style={{ marginBottom: 20 }}>
        <Title level={3}>Nộp hồ sơ trực tuyến</Title>
        {userInfo.UserName === "kieuanh" && <span style={{ marginLeft: 10 }}>
          <Tag color="#cd201f">{idCreate}</Tag>
          <Button type="primary" ghost
            icon={<ExperimentOutlined />}
            onClick={() => { fillTestData() }}
            title="Điền nhanh dữ liệu test"
          >Điền dữ liệu</Button>
        </span>}
      </Row>
      <Form
        className="ho-so-form"
        name="HoSoForm"
        form={hoSoForm}
        layout="vertical"
        initialValues={{
          "LoaiDeTai": "Thử nghiệm lâm sàng",
        }}
      >
        <Row gutter={[40, 40]}>
          <Col span={12}>
            <Form.Item name="TenDeTai" label="Tên đề tài"
              rules={[{ required: true, message: 'Thông tin bắt buộc', },]}
              hasFeedback
            >
              <Input maxLength="1000" />
            </Form.Item>
            <Form.Item name="TenVietTat" label="Tên đề tài viết tắt"
              rules={[{ required: true, message: 'Thông tin bắt buộc', },]}
              hasFeedback
            >
              <Input />
            </Form.Item>
            <Form.Item name="NghienCuuVien" label="Tên nghiên cứu viên chính / Chủ nhiệm đề tài"
              rules={[{ required: true, message: 'Thông tin bắt buộc', },]}
              hasFeedback
            >
              <Input />
            </Form.Item>
            <Form.Item name="CoQuanThucHien" label="Cơ quan thực hiện / Chủ trì đề tài"
              rules={[{ required: true, message: 'Thông tin bắt buộc', },]}
              hasFeedback
            >
              <Input />
            </Form.Item>
            <Form.Item name="CapQuanLy" label="Cấp quản lý"
              rules={[{ required: true, message: 'Thông tin bắt buộc', },]}
              hasFeedback
            >
              <Input />
            </Form.Item>
            <Form.Item name="ThoiGianThucHien" label="Thời gian thực hiện dự kiến"
              rules={[{ required: true, message: 'Thông tin bắt buộc', },]}
              hasFeedback
            >
              <Input />
            </Form.Item>
            <Form.Item name="KinhPhiDuKien" label="Kinh phí dự kiến"
              rules={[{ required: true, message: 'Thông tin bắt buộc', },]}
              hasFeedback
            >
              <Input />
            </Form.Item>
            <Form.Item name="MoTa" label={<>Mô tả chi tiết <Text type="secondary" style={{ fontWeight: "500", fontSize: 12, marginLeft: 2 }}>(Không bắt buộc)</Text></>}>
              <Input.TextArea maxLength={500} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="MaSoDeTai" label="Mã số đề tài"
              rules={[{ required: true, message: 'Thông tin bắt buộc', },]}
              hasFeedback
            >
              <Input />
            </Form.Item>
            <Form.Item name="NhaTaiTro" label="Nhà tài trợ"
              rules={[{ required: true, message: 'Thông tin bắt buộc', },]}
              hasFeedback
            >
              <Input />
            </Form.Item>
            <Row>
              <Col span={showLanBoSung === true ? 12 : 24}>
                <Form.Item name="LoaiHoSo" label="Phân loại hồ sơ"
                  rules={[{ required: true, message: 'Thông tin bắt buộc', },]}
                  hasFeedback
                >
                  <Select
                    onChange={handleLoaiHoSo}
                    placeholder="Chọn phân loại hồ sơ"
                  >
                    <Option value="Nộp ban đầu">Nộp ban đầu</Option>
                    <Option value="Nộp bổ sung">Nộp bổ sung</Option>
                    <Option value="Nghiệm thu">Nghiệm thu</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={showLanBoSung === true ? 1 : 0}>
              </Col>
              <Col span={showLanBoSung === true ? 11 : 0}>
                <Form.Item
                  name="LanBoSung"
                  label="Lần bổ sung"
                  rules={lanBoSungRules}
                  hasFeedback>
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="LoaiDeTai" label="Phân loại đề tài"
              rules={[{ required: true, message: 'Thông tin bắt buộc', },]}
              hasFeedback
            >
              <Select
                placeholder="Chọn phân loại đề tài"
                onChange={handleLoaiDeTai}
              >
                <Option value="Thử nghiệm lâm sàng">Thử nghiệm lâm sàng</Option>
                <Option value="Nghiên cứu quan sát">Nghiên cứu quan sát</Option>
                <Option value="Khác">Khác</Option>
              </Select>
            </Form.Item>
            <Form.Item name="GiaiDoanThuNghiem" label="Đề nghị được thử nghiệm lâm sàng giai đoạn" >
              <Select
                placeholder="Chọn giai đoạn"
                allowClear={true}
              >
                <Option value="Giai đoạn 1">Giai đoạn 1</Option>
                <Option value="Giai đoạn 2">Giai đoạn 2</Option>
                <Option value="Giai đoạn 3">Giai đoạn 3</Option>
              </Select>
            </Form.Item>
            <Form.Item name="NgayNopHoSoGiay" label="Ngày hộp hồ sơ giấy tới hội đồng"
              rules={[{ required: true, message: 'Thông tin bắt buộc', },]}
              hasFeedback
            >
              <DatePicker
                placeholder={"Chọn thời gian"}
                format="DD-MM-YYYY"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item name="NgayHdddChapThuan" label={<>Ngày được hội đồng chấp thuận lần đầu <Text type="secondary" style={{ fontWeight: "500", fontSize: 12, marginLeft: 2 }}>(Với hồ sơ nộp bổ sung)</Text></>} >
              <DatePicker
                placeholder={"Chọn thời gian"}
                format="DD-MM-YYYY"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Row>
              <Col span={8} style={{ marginRight: 10 }}>
                <Form.Item name="LePhi" label={<>Lệ phí &nbsp; <ButtonGoiYLePhi /></>} >
                  <Select
                    allowClear
                    placeholder="Chọn mức"
                  >
                    <Option value="Mức 1">Mức 1</Option>
                    <Option value="Mức 2">Mức 2</Option>
                    <Option value="Mức 3">Mức 3</Option>
                    <Option value="Mức 4">Mức 4</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="HoaDonLePhi" label=" " valuePropName="file" >
                  <Upload {...propsUploadLePhi}>
                    <Button icon={<UploadOutlined />}>Hóa đơn nộp lệ phí/Ủy nhiệm chi</Button>
                  </Upload>
                </Form.Item>
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
            <Form.Item name="TaiLieuTrinhNop" autoComplete="off">
              <TaiLieuTable phanLoaiDeTai={loaiDeTai} phanLoaiHoSo={loaiHoSo}/>
            </Form.Item>
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
            <Form.Item name="NguoiNopHoTen" label="Họ và tên"
              rules={[{ required: true, message: 'Thông tin bắt buộc', },]}
              hasFeedback
            >
              <Input />
            </Form.Item>
            <Form.Item name="NguoiNopEmail" label="Địa chỉ email"
              rules={[{ required: true, message: 'Thông tin bắt buộc', },]}
              hasFeedback
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="NguoiNopPhone" label="Số điện thoại"
              rules={[{ required: true, message: 'Thông tin bắt buộc', },]}
              hasFeedback
            >
              <Input />
            </Form.Item>
            <Form.Item name="NguoiNopDiaChi" label={<>Địa chỉ <Text type="secondary" style={{ fontWeight: "500", fontSize: 12, marginLeft: 2 }}>(Không bắt buộc)</Text></>}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="space-between">
          <Col>
            {userInfo.UserName === "kieuanh" && <Button style={{ marginRight: 10 }} type="danger" icon={<ExperimentOutlined />} onClick={() => { handleLogHoSoData(); }}>
              Log data
            </Button>}
            <Popconfirm
              title="Bạn chắc chắn đã kiểm tra kỹ và sẽ gửi hồ sơ mới này đi?"
              onConfirm={() => {
                handleNopHoSo(idCreate);
              }}
              okText="Nộp hồ sơ"
              icon={<SendOutlined />}
              cancelText="Thoát"
            >
              <Button style={{ marginRight: 10 }} type="primary" icon={<SendOutlined />}>
                Gửi ngay
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Bạn chắc chắn muốn hủy thông tin hồ sơ mới này?"
              onConfirm={() => history.goBack()}
              okText="OK"
              cancelText="Thoát"
            >
              <Button danger>Hủy bỏ</Button>
            </Popconfirm>
          </Col>
          <Col></Col>
        </Row>
      </Form>
    </Col>
  );
}

const mapStateToProps = (state) => ({
  token: state.token,
  userInfo: state.userInfo,
});

export default connect(mapStateToProps, null)(NopHoSo);
