using System;
using System.Collections.Generic;

#nullable disable

namespace hosotructuyen.Models
{
    public partial class HoSo
    {
        public HoSo()
        {
            CuocHops = new HashSet<CuocHop>();
            NhanXets = new HashSet<NhanXet>();
            PhanCongs = new HashSet<PhanCong>();
            TaiLieus = new HashSet<TaiLieu>();
        }

        public string HoSoId { get; set; }
        public int? UserId { get; set; }
        public string TenDeTai { get; set; }
        public string MaSoDeTai { get; set; }
        public string TenVietTat { get; set; }
        public string NhaTaiTro { get; set; }
        public string NghienCuuVien { get; set; }
        public string CoQuanThucHien { get; set; }
        public string CapQuanLy { get; set; }
        public string LoaiHoSo { get; set; }
        public string LoaiDeTai { get; set; }
        public string ThoiGianThucHien { get; set; }
        public string KinhPhiDuKien { get; set; }
        public string GiaiDoanThuNghiem { get; set; }
        public string NgayNopHoSoGiay { get; set; }
        public string NgayHdddChapThuan { get; set; }
        public string NgayTaoHoSo { get; set; }
        public DateTime? ThoiGianTaoHoSo { get; set; }
        public string LePhi { get; set; }
        public string MoTa { get; set; }
        public string TrangThai { get; set; }
        public string FileKetQua { get; set; }
        public string NguoiNopHoTen { get; set; }
        public string NguoiNopEmail { get; set; }
        public string NguoiNopPhone { get; set; }
        public string NguoiNopDiaChi { get; set; }
        public string LinkHop { get; set; }
        public string GioHop { get; set; }
        public string ParentId { get; set; }
        public int? LanBoSung { get; set; }
        public bool? DuyetHoSoGiay { get; set; }
        public DateTime? NgayHenDuyetHoSoGiay { get; set; }
        public DateTime? NgayDuyetHoSoGiay { get; set; }
        public DateTime? NgayRaQuyetDinh { get; set; }

        public virtual ICollection<CuocHop> CuocHops { get; set; }
        public virtual ICollection<NhanXet> NhanXets { get; set; }
        public virtual ICollection<PhanCong> PhanCongs { get; set; }
        public virtual ICollection<TaiLieu> TaiLieus { get; set; }
    }
}
