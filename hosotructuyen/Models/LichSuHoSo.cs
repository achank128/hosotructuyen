using System;
using System.Collections.Generic;

#nullable disable

namespace hosotructuyen.Models
{
    public partial class LichSuHoSo
    {
        public int Id { get; set; }
        public string HoSoId { get; set; }
        public string Type { get; set; }
        public string Title { get; set; }
        public string ChiTiet { get; set; }
        public int? UserId { get; set; }
        public DateTime? ThoiGian { get; set; }
    }
}
