using System;
using System.Collections.Generic;

#nullable disable

namespace hosotructuyen.Models
{
    public partial class CuocHop
    {
        public int CuocHopId { get; set; }
        public int? UserId { get; set; }
        public string HoSoId { get; set; }
        public string LinkHop { get; set; }
        public DateTime? ThoiGian { get; set; }
        public string ThanhPhan { get; set; }
        public string FileThuyetTrinh { get; set; }
        public string FileThuyetTrinhPath { get; set; }
        public bool? IsCurrent { get; set; }

        public virtual HoSo HoSo { get; set; }
    }
}
