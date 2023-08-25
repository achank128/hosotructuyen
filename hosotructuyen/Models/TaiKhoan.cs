using System;
using System.Collections.Generic;

#nullable disable

namespace hosotructuyen.Models
{
    public partial class TaiKhoan
    {
        public TaiKhoan()
        {
            NhanXets = new HashSet<NhanXet>();
            PhanCongs = new HashSet<PhanCong>();
            TaiLieus = new HashSet<TaiLieu>();
        }

        public int UserId { get; set; }
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string ChucVu { get; set; }
        public string VaiTro { get; set; }
        public string Avatar { get; set; }
        public string NgayCapNhat { get; set; }
        public string TrangThai { get; set; }
        public string NgayHetHan { get; set; }

        public virtual ICollection<NhanXet> NhanXets { get; set; }
        public virtual ICollection<PhanCong> PhanCongs { get; set; }
        public virtual ICollection<TaiLieu> TaiLieus { get; set; }
    }
}
