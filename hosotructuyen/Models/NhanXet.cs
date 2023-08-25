using System;
using System.Collections.Generic;

#nullable disable

namespace hosotructuyen.Models
{
    public partial class NhanXet
    {
        public int NhanXetId { get; set; }
        public int? UserId { get; set; }
        public string HoSoId { get; set; }
        public string KetQua { get; set; }
        public string GhiChu { get; set; }
        public string NgayGui { get; set; }
        public string FileNhanXet { get; set; }
        public string MauBaoCao { get; set; }
        public string Mau11 { get; set; }
        public string Mau12 { get; set; }
        public string Mau13 { get; set; }
        public string Mau14 { get; set; }
        public string Mau15 { get; set; }
        public string Mau21 { get; set; }
        public string Mau22 { get; set; }
        public string Mau23 { get; set; }
        public string Mau24 { get; set; }
        public string Mau25 { get; set; }
        public string Mau2611 { get; set; }
        public string Mau2612 { get; set; }
        public string Mau2613 { get; set; }
        public string Mau2621 { get; set; }
        public string Mau2622 { get; set; }
        public string Mau2623 { get; set; }
        public string Mau2624 { get; set; }
        public string Mau2625 { get; set; }
        public string Mau2631 { get; set; }
        public string Mau2632 { get; set; }
        public string Mau2641 { get; set; }
        public string Mau2642 { get; set; }
        public string Mau2643 { get; set; }
        public string Mau2644 { get; set; }
        public string Mau2651 { get; set; }
        public string Mau2652 { get; set; }
        public string Mau2653 { get; set; }
        public string Mau266 { get; set; }
        public string Mau267 { get; set; }
        public string Mau27 { get; set; }
        public string Mau28 { get; set; }
        public string Mau29 { get; set; }

        public virtual HoSo HoSo { get; set; }
        public virtual TaiKhoan User { get; set; }
    }
}
