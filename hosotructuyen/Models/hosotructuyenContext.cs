using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace hosotructuyen.Models
{
    public partial class hosotructuyenContext : DbContext
    {
        public hosotructuyenContext()
        {
        }

        public hosotructuyenContext(DbContextOptions<hosotructuyenContext> options)
            : base(options)
        {
        }

        public virtual DbSet<CuocHop> CuocHops { get; set; }
        public virtual DbSet<HoSo> HoSos { get; set; }
        public virtual DbSet<LichSuHoSo> LichSuHoSos { get; set; }
        public virtual DbSet<NhanXet> NhanXets { get; set; }
        public virtual DbSet<PhanCong> PhanCongs { get; set; }
        public virtual DbSet<TaiKhoan> TaiKhoans { get; set; }
        public virtual DbSet<TaiLieu> TaiLieus { get; set; }
        public virtual DbSet<ThongBao> ThongBaos { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=.;Database=hosotructuyen;uid=ungdungonline;password=yenbai@123;MultipleActiveResultSets=true");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<CuocHop>(entity =>
            {
                entity.ToTable("CuocHop");

                entity.Property(e => e.FileThuyetTrinh).HasMaxLength(500);

                entity.Property(e => e.FileThuyetTrinhPath).HasMaxLength(1000);

                entity.Property(e => e.HoSoId).HasMaxLength(50);

                entity.Property(e => e.LinkHop).HasMaxLength(255);

                entity.Property(e => e.ThanhPhan).HasMaxLength(255);

                entity.Property(e => e.ThoiGian).HasColumnType("datetime");

                entity.HasOne(d => d.HoSo)
                    .WithMany(p => p.CuocHops)
                    .HasForeignKey(d => d.HoSoId)
                    .HasConstraintName("FK_CuocHop_HoSo");
            });

            modelBuilder.Entity<HoSo>(entity =>
            {
                entity.ToTable("HoSo");

                entity.Property(e => e.HoSoId).HasMaxLength(50);

                entity.Property(e => e.CapQuanLy).HasMaxLength(200);

                entity.Property(e => e.CoQuanThucHien).HasMaxLength(200);

                entity.Property(e => e.FileKetQua)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.GiaiDoanThuNghiem).HasMaxLength(200);

                entity.Property(e => e.GioHop)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.KinhPhiDuKien).HasMaxLength(50);

                entity.Property(e => e.LePhi).HasMaxLength(50);

                entity.Property(e => e.LinkHop)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.LoaiDeTai).HasMaxLength(200);

                entity.Property(e => e.LoaiHoSo).HasMaxLength(200);

                entity.Property(e => e.MaSoDeTai).HasMaxLength(50);

                entity.Property(e => e.MoTa)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.NgayDuyetHoSoGiay).HasColumnType("datetime");

                entity.Property(e => e.NgayHdddChapThuan).HasMaxLength(50);

                entity.Property(e => e.NgayHenDuyetHoSoGiay).HasColumnType("datetime");

                entity.Property(e => e.NgayNopHoSoGiay).HasMaxLength(50);

                entity.Property(e => e.NgayRaQuyetDinh).HasColumnType("datetime");

                entity.Property(e => e.NgayTaoHoSo).HasMaxLength(50);

                entity.Property(e => e.NghienCuuVien).HasMaxLength(200);

                entity.Property(e => e.NguoiNopDiaChi)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.NguoiNopEmail).HasMaxLength(100);

                entity.Property(e => e.NguoiNopHoTen).HasMaxLength(100);

                entity.Property(e => e.NguoiNopPhone).HasMaxLength(100);

                entity.Property(e => e.NhaTaiTro).HasMaxLength(200);

                entity.Property(e => e.ParentId).HasMaxLength(50);

                entity.Property(e => e.TenDeTai).HasMaxLength(1000);

                entity.Property(e => e.TenVietTat).HasMaxLength(50);

                entity.Property(e => e.ThoiGianTaoHoSo).HasColumnType("datetime");

                entity.Property(e => e.ThoiGianThucHien).HasMaxLength(50);

                entity.Property(e => e.TrangThai).HasMaxLength(50);
            });

            modelBuilder.Entity<LichSuHoSo>(entity =>
            {
                entity.ToTable("LichSuHoSo");

                entity.Property(e => e.ChiTiet).HasMaxLength(2500);

                entity.Property(e => e.HoSoId).HasMaxLength(50);

                entity.Property(e => e.ThoiGian)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Title).HasMaxLength(500);

                entity.Property(e => e.Type).HasMaxLength(50);
            });

            modelBuilder.Entity<NhanXet>(entity =>
            {
                entity.ToTable("NhanXet");

                entity.Property(e => e.FileNhanXet).HasMaxLength(200);

                entity.Property(e => e.GhiChu).HasMaxLength(2000);

                entity.Property(e => e.HoSoId).HasMaxLength(50);

                entity.Property(e => e.KetQua).HasMaxLength(50);

                entity.Property(e => e.Mau11)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau12)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau13)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau14)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau15)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau21)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau22)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau23)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau24)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau25)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau2611)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau2612)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau2613)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau2621)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau2622)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau2623)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau2624)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau2625)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau2631)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau2632)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau2641)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau2642)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau2643)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau2644)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau2651)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau2652)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau2653)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau266)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau267)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau27)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau28)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Mau29)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.MauBaoCao).HasMaxLength(100);

                entity.Property(e => e.NgayGui).HasMaxLength(100);

                entity.HasOne(d => d.HoSo)
                    .WithMany(p => p.NhanXets)
                    .HasForeignKey(d => d.HoSoId)
                    .HasConstraintName("FK_NhanXet_HoSo");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.NhanXets)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_NhanXet_User");
            });

            modelBuilder.Entity<PhanCong>(entity =>
            {
                entity.ToTable("PhanCong");

                entity.Property(e => e.HoSoId).HasMaxLength(50);

                entity.Property(e => e.PhanLoai).HasMaxLength(50);

                entity.HasOne(d => d.HoSo)
                    .WithMany(p => p.PhanCongs)
                    .HasForeignKey(d => d.HoSoId)
                    .HasConstraintName("FK_PhanCong_HoSo");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.PhanCongs)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_PhanCong_TaiKhoan");
            });

            modelBuilder.Entity<TaiKhoan>(entity =>
            {
                entity.HasKey(e => e.UserId)
                    .HasName("PK_User");

                entity.ToTable("TaiKhoan");

                entity.Property(e => e.Address)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Avatar)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.ChucVu)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.DisplayName).HasMaxLength(100);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.NgayCapNhat).HasMaxLength(100);

                entity.Property(e => e.NgayHetHan)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Password).HasMaxLength(200);

                entity.Property(e => e.Phone)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Role).HasMaxLength(50);

                entity.Property(e => e.TrangThai).HasMaxLength(100);

                entity.Property(e => e.UserName).HasMaxLength(50);

                entity.Property(e => e.VaiTro)
                    .IsRequired()
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<TaiLieu>(entity =>
            {
                entity.ToTable("TaiLieu");

                entity.Property(e => e.Category).HasMaxLength(50);

                entity.Property(e => e.DocNameEn)
                    .HasMaxLength(1000)
                    .HasColumnName("DocNameEN");

                entity.Property(e => e.DocNameVn)
                    .HasMaxLength(1000)
                    .HasColumnName("DocNameVN");

                entity.Property(e => e.FileName).HasMaxLength(100);

                entity.Property(e => e.FilePath).HasMaxLength(200);

                entity.Property(e => e.HoSoId).HasMaxLength(50);

                entity.Property(e => e.VersionAndDate).HasMaxLength(500);

                entity.HasOne(d => d.HoSo)
                    .WithMany(p => p.TaiLieus)
                    .HasForeignKey(d => d.HoSoId)
                    .HasConstraintName("FK_TaiLieu_HoSo");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.TaiLieus)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_TaiLieu_TaiKhoan");
            });

            modelBuilder.Entity<ThongBao>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("ThongBao");

                entity.Property(e => e.HoSoId)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.LoaiThongBao).HasMaxLength(50);

                entity.Property(e => e.NgayTao).HasMaxLength(100);

                entity.Property(e => e.NguoiGui).HasMaxLength(50);

                entity.Property(e => e.NoiDung).HasMaxLength(500);

                entity.Property(e => e.ThongBaoId).ValueGeneratedOnAdd();

                entity.Property(e => e.TrangThai).HasMaxLength(50);

                entity.HasOne(d => d.NguoiTao)
                    .WithMany()
                    .HasForeignKey(d => d.NguoiTaoId)
                    .HasConstraintName("FK_ThongBao_TaiKhoan");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
