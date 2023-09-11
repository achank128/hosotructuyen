export const config = {
  // baseUrl: "http://hoso.bcbc.vn",
  //baseUrl: "http://test.hoso.bcbc.vn",
  baseUrl: window.location.origin,
};

export const notify = {
  errorUpload: "Đã có lỗi xảy ra khi tải file lên! Vui lòng liên hệ để được hỗ trợ.",
  errorRequired: "Xin vui lòng điền đầy đủ thông tin!",
  errorApi: "Phiên đăng nhập của bạn đã hết hạn! Xin vui lòng đăng nhập lại.",
  errorSystem: "Đã có lỗi xảy ra! Vui lòng liên hệ để được hỗ trợ.",
  unauthorized: "Tài khoản không có quyền thực hiện hành động này!",
  requireActive: "Bạn cần kích hoạt tài khoản để truy cập mục này!",
  requireActiveDescription: "Vui lòng kiểm tra lại trạng thái tài khoản hoặc liên hệ với thư ký để được hỗ trợ.",
  emptyData: "Không có dữ liệu",
};

export const colors = {
  inputRequire: "#00000073",
  title: "#069",
  boder: "#f2f2f2",
};

export const info = {
  emptyResult: "Không có kết quả phù hợp",
};

export const listUserRole = {
  dev: ["dev"],
  admin: ["dev", "admin", "thuky"],
  thuKy: ["dev", "admin", "thuky"],
  reviewer: ["reviewer"],
  nghienCuuSinh: ["user1", "user2", "user3", "user4", "hocVien", "nghienCuuVienChinh"],
  sponsor: ["nhaTaiTro"],
  khac: ["khac"]
}

export const listTrangThaiHoSo = {
  ChoDuyet: 'Chờ xét duyệt',
  DangDuyet: 'Đang xét duyệt',
  ChapNhan: 'Chấp thuận thông qua',
  ChapNhanCoSua: 'Chấp thuận thông qua có chỉnh sửa',
  DeNghiSua: 'Đề nghị sửa chữa để xét duyệt lại',
  KhongChapThuan: 'Không chấp thuận',
};

export const listLoaiHoSo = {
  BanDau: 'Nộp ban đầu',
  BoSung: 'Nộp bổ sung',
};

export const listLoaiDinhKem = [
  { phanLoaiDeTai: "Thử nghiệm lâm sàng", category: "hanhchinh", title: "Tài liệu hành chính" },
  { phanLoaiDeTai: "Thử nghiệm lâm sàng", category: "nghiencuu", title: "Tài liệu nghiên cứu" },
  { phanLoaiDeTai: "Thử nghiệm lâm sàng", category: "benhnhan", title: "Tài liệu dành cho bệnh nhân" },
  { phanLoaiDeTai: "Thử nghiệm lâm sàng", category: "khac", title: "Tài liệu hỗ trợ khác" },

  { phanLoaiDeTai: "Nghiên cứu quan sát", category: "hanhchinh", title: "Tài liệu hành chính" },
  { phanLoaiDeTai: "Nghiên cứu quan sát", category: "nghiencuu", title: "Tài liệu nghiên cứu" },
  { phanLoaiDeTai: "Nghiên cứu quan sát", category: "benhnhan", title: "Tài liệu dành cho bệnh nhân" },
  { phanLoaiDeTai: "Nghiên cứu quan sát", category: "khac", title: "Tài liệu hỗ trợ khác" },

  { phanLoaiDeTai: "Khác", category: "hanhchinh", title: "Tài liệu hành chính" },
  { phanLoaiDeTai: "Khác", category: "nghiencuu", title: "Tài liệu nghiên cứu" },
  { phanLoaiDeTai: "Khác", category: "benhnhan", title: "Tài liệu dành cho bệnh nhân" },
  { phanLoaiDeTai: "Khác", category: "khac", title: "Tài liệu hỗ trợ khác" },
];

export const listLoaiDinhKemBoSung = [
  { phanLoaiDeTai: "Thử nghiệm lâm sàng", category: "bosung", title: "Tài liệu bổ sung" },
  { phanLoaiDeTai: "Thử nghiệm lâm sàng", category: "hanhchinh", title: "Tài liệu hành chính" },
  { phanLoaiDeTai: "Thử nghiệm lâm sàng", category: "nghiencuu", title: "Tài liệu nghiên cứu" },
  { phanLoaiDeTai: "Thử nghiệm lâm sàng", category: "benhnhan", title: "Tài liệu dành cho bệnh nhân" },
  { phanLoaiDeTai: "Thử nghiệm lâm sàng", category: "khac", title: "Tài liệu hỗ trợ khác" },

  { phanLoaiDeTai: "Nghiên cứu quan sát", category: "bosung", title: "Tài liệu bổ sung" },
  { phanLoaiDeTai: "Nghiên cứu quan sát", category: "hanhchinh", title: "Tài liệu hành chính" },
  { phanLoaiDeTai: "Nghiên cứu quan sát", category: "nghiencuu", title: "Tài liệu nghiên cứu" },
  { phanLoaiDeTai: "Nghiên cứu quan sát", category: "benhnhan", title: "Tài liệu dành cho bệnh nhân" },
  { phanLoaiDeTai: "Nghiên cứu quan sát", category: "khac", title: "Tài liệu hỗ trợ khác" },

  { phanLoaiDeTai: "Khác", category: "bosung", title: "Tài liệu bổ sung" },
  { phanLoaiDeTai: "Khác", category: "hanhchinh", title: "Tài liệu hành chính" },
  { phanLoaiDeTai: "Khác", category: "nghiencuu", title: "Tài liệu nghiên cứu" },
  { phanLoaiDeTai: "Khác", category: "benhnhan", title: "Tài liệu dành cho bệnh nhân" },
  { phanLoaiDeTai: "Khác", category: "khac", title: "Tài liệu hỗ trợ khác" },
];

export const listLoaiDinhKemNghiemThu = [
  { phanLoaiDeTai: "Thử nghiệm lâm sàng", category: "nghiemthu", title: "Tài liệu nghiệm thu" },
  { phanLoaiDeTai: "Thử nghiệm lâm sàng", category: "khac", title: "Tài liệu hỗ trợ khác" },

  { phanLoaiDeTai: "Nghiên cứu quan sát", category: "nghiemthu", title: "Tài liệu nghiệm thu" },
  { phanLoaiDeTai: "Nghiên cứu quan sát", category: "khac", title: "Tài liệu hỗ trợ khác" },

  { phanLoaiDeTai: "Khác", category: "nghiemthu", title: "Tài liệu nghiệm thu" },
  { phanLoaiDeTai: "Khác", category: "khac", title: "Tài liệu hỗ trợ khác" },
];

export const listLoaiDinhKemView = [
  { phanLoaiDeTai: "Thử nghiệm lâm sàng", category: "hanhchinh", title: "Tài liệu hành chính" },
  { phanLoaiDeTai: "Thử nghiệm lâm sàng", category: "nghiencuu", title: "Tài liệu nghiên cứu" },
  { phanLoaiDeTai: "Thử nghiệm lâm sàng", category: "benhnhan", title: "Tài liệu dành cho bệnh nhân" },
  { phanLoaiDeTai: "Thử nghiệm lâm sàng", category: "khac", title: "Tài liệu hỗ trợ khác" },
  { phanLoaiDeTai: "Thử nghiệm lâm sàng", category: "bosung", title: "Tài liệu bổ sung" },
  { phanLoaiDeTai: "Thử nghiệm lâm sàng", category: "nghiemthu", title: "Tài liệu nghiệm thu" },

  { phanLoaiDeTai: "Nghiên cứu quan sát", category: "hanhchinh", title: "Tài liệu hành chính" },
  { phanLoaiDeTai: "Nghiên cứu quan sát", category: "nghiencuu", title: "Tài liệu nghiên cứu" },
  { phanLoaiDeTai: "Nghiên cứu quan sát", category: "benhnhan", title: "Tài liệu dành cho bệnh nhân" },
  { phanLoaiDeTai: "Nghiên cứu quan sát", category: "khac", title: "Tài liệu hỗ trợ khác" },
  { phanLoaiDeTai: "Nghiên cứu quan sát", category: "bosung", title: "Tài liệu bổ sung" },
  { phanLoaiDeTai: "Nghiên cứu quan sát", category: "nghiemthu", title: "Tài liệu nghiệm thu" },

  { phanLoaiDeTai: "Khác", category: "hanhchinh", title: "Tài liệu hành chính" },
  { phanLoaiDeTai: "Khác", category: "nghiencuu", title: "Tài liệu nghiên cứu" },
  { phanLoaiDeTai: "Khác", category: "benhnhan", title: "Tài liệu dành cho bệnh nhân" },
  { phanLoaiDeTai: "Khác", category: "khac", title: "Tài liệu hỗ trợ khác" },
  { phanLoaiDeTai: "Khác", category: "bosung", title: "Tài liệu bổ sung" },
  { phanLoaiDeTai: "Khác", category: "nghiemthu", title: "Tài liệu nghiệm thu" },
];

export const listLoaiFileHoSo = {
  LePhi: "lephi",
  BienNhanLePhi: "biennhan",
  GiayBaoNhan: "giaybaonhan",
  KetQuaXetDuyet: "ketquaxetduyet",
}