using System;
using System.Collections.Generic;

#nullable disable

namespace hosotructuyen.Models
{
    public partial class TaiLieu
    {
        public int TaiLieuId { get; set; }
        public int? UserId { get; set; }
        public string HoSoId { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string Category { get; set; }
        public bool? HardCopy { get; set; }
        public string DocNameVn { get; set; }
        public string DocNameEn { get; set; }
        public string VersionAndDate { get; set; }

        public virtual HoSo HoSo { get; set; }
        public virtual TaiKhoan User { get; set; }
    }
}
