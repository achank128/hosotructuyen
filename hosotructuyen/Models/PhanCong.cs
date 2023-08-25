using System;
using System.Collections.Generic;

#nullable disable

namespace hosotructuyen.Models
{
    public partial class PhanCong
    {
        public int PhanCongId { get; set; }
        public int? UserId { get; set; }
        public string HoSoId { get; set; }
        public string PhanLoai { get; set; }

        public virtual HoSo HoSo { get; set; }
        public virtual TaiKhoan User { get; set; }
    }
}
