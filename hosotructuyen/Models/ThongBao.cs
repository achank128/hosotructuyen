using System;
using System.Collections.Generic;

#nullable disable

namespace hosotructuyen.Models
{
    public partial class ThongBao
    {
        public int ThongBaoId { get; set; }
        public int? NguoiTaoId { get; set; }
        public int? NguoiNhanId { get; set; }
        public string LoaiThongBao { get; set; }
        public string NoiDung { get; set; }
        public string HoSoId { get; set; }
        public string NgayTao { get; set; }
        public string TrangThai { get; set; }
        public string NguoiGui { get; set; }

        public virtual TaiKhoan NguoiTao { get; set; }
    }
}
