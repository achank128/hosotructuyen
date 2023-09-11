using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

using hosotructuyen.Models;
using System.IO;

namespace hosotructuyen.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class HoSoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly hosotructuyenContext db;
        public HoSoController(IConfiguration configuration, IWebHostEnvironment hostEnvironment, hosotructuyenContext context)
        {
            _configuration = configuration;
            _hostEnvironment = hostEnvironment;
            db = context;
        }

        // Lay danh sach ho so cua nghien cuu sinh
        [HttpGet("user/{id}")]
        public JsonResult UserGet(int id)
        {
            var result = db.HoSos.AsNoTracking().Where(x => x.UserId == id).OrderByDescending(x => x.ThoiGianTaoHoSo);
            return new JsonResult(result);
        }
        // Lay danh sach ho so cua thu ky (admin)
        [HttpGet("admin")]
        public JsonResult AdminGet()
        {
            var result = db.HoSos.AsNoTracking().OrderByDescending(x => x.ThoiGianTaoHoSo);
            return new JsonResult(result);
        }
        // Lay danh sach ho so cua 1 thanh vien hoi dong
        // id: UserId
        [HttpGet("reviewer/{id}")]
        public JsonResult ReviewerGet(int id)
        {
            // Lấy các hồ sơ được phân công và các hồ sơ gốc (để hiển thị đề tài)
            string query = "select hoso.* from dbo.HoSo hoso where " +
                $"hoso.HoSoId in (select hoso1.HoSoId from dbo.HoSo hoso1 inner join dbo.PhanCong on hoso1.HoSoId = dbo.PhanCong.HoSoId  where dbo.PhanCong.UserId = {id})" +
                $" or hoso.HoSoId in (select hoso1.ParentId from dbo.HoSo hoso1 inner join dbo.PhanCong on hoso1.HoSoId = dbo.PhanCong.HoSoId  where dbo.PhanCong.UserId = {id})" +
                " order by hoSo.ThoiGianTaoHoSo desc";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("HoSoNCLSDataContext");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);

                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }

        // Lay thong tin chi tiet 1 ho so
        [HttpGet("{id}")]
        public JsonResult GetDetail(string id)
        {
            var result = db.HoSos.AsNoTracking().Where(x => x.HoSoId == id);
            return new JsonResult(result);
        }

        // Lấy lịch sử hồ sơ
        [HttpGet("{hoSoId}/history")]
        public JsonResult GetHistory(string hoSoId)
        {
            var result = db.LichSuHoSos.AsNoTracking().Where(x => x.HoSoId == hoSoId)?.OrderByDescending(x => x.Id)?.ToList() ?? new List<LichSuHoSo>();
            return new JsonResult(result);
        }

        // Lay danh sach hoi dong nhan xet cua 1 ho so
        [HttpGet("{id}/hoidong")]
        public JsonResult GetHoiDong(string id)
        {
            string query = @"select dbo.TaiKhoan.*, dbo.PhanCong.PhanLoai from dbo.TaiKhoan inner join dbo.PhanCong on dbo.TaiKhoan.UserId=dbo.PhanCong.UserId where dbo.PhanCong.HoSoId='" + id + @"'";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("HoSoNCLSDataContext");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);

                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }

        // Lay toan bo danh sach hoi dong
        [HttpGet("hoidong")]
        public JsonResult GetHoiDongAll()
        {
            string query = @"select dbo.TaiKhoan.* from dbo.TaiKhoan where dbo.TaiKhoan.Role='reviewer'";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("HoSoNCLSDataContext");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);

                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }

        // Lấy lần bổ sung cuối
        [HttpGet("{id}/lanbosungcuoi")]
        public int GetLanBoSungGanNhat(string id)
        {
            int lanBoSungCuoi = 0;
            string sqlDataSource = _configuration.GetConnectionString("HoSoNCLSDataContext");
            using (SqlConnection conn = new SqlConnection(sqlDataSource))
            {
                conn.Open();
                string checkQuery = "select top 1 LanBoSung from dbo.HoSo where ParentId = @parentId and TrangThai != @trangThaiExcluded order by LanBoSung desc";
                using (SqlCommand cmd = new SqlCommand(checkQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@parentId", id);
                    cmd.Parameters.AddWithValue("@trangThaiExcluded", "Đề nghị sửa chữa để xét duyệt lại");
                    lanBoSungCuoi = Convert.ToInt32(cmd.ExecuteScalar()); //Convert.ToInt32(null) = 0 tránh lỗi ép kiểu
                    conn.Close();
                }
            }
            return lanBoSungCuoi;
        }

        // Tao moi 1 ho so
        [HttpPost]
        public JsonResult Post()
        {
            string insertQuery = "";
            try
            {
                var fdHoSo = Request.Form["hoSo"];
                HoSo hoSo = JsonConvert.DeserializeObject<HoSo>(fdHoSo) ?? new HoSo();
                string sqlDataSource = _configuration.GetConnectionString("HoSoNCLSDataContext");
                if (!string.IsNullOrEmpty(hoSo.ParentId) && hoSo.LoaiHoSo == "Nộp bổ sung")
                {
                    // Check trùng lần bổ sung
                    var lanBoSung = hoSo.LanBoSung;
                    var lanBoSungCuoi = GetLanBoSungGanNhat(hoSo.ParentId);
                    if (lanBoSung - lanBoSungCuoi != 1)
                    {
                        return new JsonResult(new
                        {
                            Error = true,
                            Code = 400,
                            Message = $"Hãy kiểm tra lại số lần bổ sung. Lần bổ sung gần nhất là {lanBoSungCuoi}.",
                        });
                    }
                }
                string nowString = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                insertQuery = $"insert into dbo.HoSo (UserId, HoSoId, TenDeTai, MaSoDeTai, TenVietTat, NhaTaiTro, NghienCuuVien, FileKetQua, CoQuanThucHien, CapQuanLy, LoaiHoSo, LoaiDeTai, ThoiGianThucHien, KinhPhiDuKien, GiaiDoanThuNghiem, NgayNopHoSoGiay, NgayHdddChapThuan, NgayTaoHoSo, ThoiGianTaoHoSo, LePhi, MoTa, TrangThai, NguoiNopHoTen, NguoiNopEmail, NguoiNopPhone, NguoiNopDiaChi, LinkHop, GioHop, ParentId, LanBoSung) values ('{hoSo.UserId}',N'{hoSo.HoSoId}',N'{hoSo.TenDeTai}',N'{hoSo.MaSoDeTai}',N'{hoSo.TenVietTat}',N'{hoSo.NhaTaiTro}',N'{hoSo.NghienCuuVien}',N'{hoSo.FileKetQua}',N'{hoSo.CoQuanThucHien}',N'{hoSo.CapQuanLy}',N'{hoSo.LoaiHoSo}',N'{hoSo.LoaiDeTai}',N'{hoSo.ThoiGianThucHien}',N'{hoSo.KinhPhiDuKien}',N'{hoSo.GiaiDoanThuNghiem}',N'{hoSo.NgayNopHoSoGiay}',N'{hoSo.NgayHdddChapThuan}',N'{hoSo.NgayTaoHoSo}',N'{nowString}',N'{hoSo.LePhi}',N'{hoSo.MoTa}',N'{hoSo.TrangThai}',N'{hoSo.NguoiNopHoTen}',N'{hoSo.NguoiNopEmail}',N'{hoSo.NguoiNopPhone}',N'{hoSo.NguoiNopDiaChi}',N'{hoSo.LinkHop}',N'{hoSo.GioHop}',N'{hoSo.ParentId}',{hoSo.LanBoSung?.ToString() ?? "NULL"})";
                using (SqlConnection conn = new SqlConnection(sqlDataSource))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(insertQuery, conn))
                    {
                        cmd.ExecuteNonQuery();
                    }
                    conn.Close();
                }
                var lichSu = new LichSuHoSo()
                {
                    HoSoId = hoSo.HoSoId,
                    Type = "HoSo",
                    Title = "Hồ sơ được nộp",
                    ChiTiet = "Nghiên cứu sinh nộp hồ sơ",
                    UserId = hoSo.UserId,
                    ThoiGian = DateTime.Now,
                };
                db.LichSuHoSos.Add(lichSu);
                if (hoSo.ParentId != "" && hoSo.ParentId.Length > 1 && hoSo.LanBoSung > 0)
                {
                    var lichSuParent = new LichSuHoSo()
                    {
                        HoSoId = hoSo.ParentId,
                        Type = "CreateChild",
                        Title = "Hồ sơ bổ sung được nộp",
                        ChiTiet = $"Nghiên cứu sinh nộp hồ sơ bổ sung lần thứ {hoSo.LanBoSung} cho hồ sơ này",
                        UserId = hoSo.UserId,
                        ThoiGian = DateTime.Now,
                    };
                    db.LichSuHoSos.Add(lichSuParent);
                }
                db.SaveChanges();
                return new JsonResult(new
                {
                    Error = false,
                    Message = "Đã nộp hồ sơ thành công!",
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    Error = true,
                    Code = 500,
                    Message = ex.Message,
                    InnerException = ex.InnerException?.Message ?? "None",
                    Query = new
                    {
                        Insert = insertQuery,
                    }
                });
            }
        }

        // Thư ký đặt ngày hẹn duyệt hồ sơ giấy
        [HttpPost("{hoSoId}/HenNgayDuyetHoSoGiay/{userId}")]
        public JsonResult HenNgayDuyetHoSoGiay(HoSo hoSo, int userId = 0)
        {
            try
            {
                string ngayHenStr = hoSo.NgayHenDuyetHoSoGiay != null
                    ? $"'{hoSo.NgayHenDuyetHoSoGiay?.ToString("yyyy-MM-dd HH:mm:ss") ?? ""}'"
                    : "NULL";
                string query = $"update dbo.HoSo set NgayHenDuyetHoSoGiay = {ngayHenStr} where HoSoId = '{hoSo.HoSoId}'";
                RunSqlQuery(query);
                var lichSu = new LichSuHoSo()
                {
                    HoSoId = hoSo.HoSoId,
                    Type = "Update",
                    Title = "Hồ sơ được cập nhật",
                    ChiTiet = "Hồ sơ được hẹn ngày duyệt hồ sơ giấy",
                    UserId = userId,
                    ThoiGian = DateTime.Now,
                };
                db.LichSuHoSos.Add(lichSu);
                db.SaveChanges();
                return new JsonResult(new
                {
                    Error = false,
                    Message = "Cập nhật ngày hẹn xét duyệt hồ sơ giấy thành công",
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    Error = true,
                    Code = 500,
                    Message = ex.Message,
                    InnerException = ex.InnerException?.Message ?? "None"
                });
            }
        }
        
        // Thư ký duyệt hồ sơ giấy
        [HttpPost("{hoSoId}/DuyetHoSoGiay/{userId}")]
        public JsonResult DuyetHoSoGiay(HoSo hoSo, int userId = 0)
        {
            try
            {
                string ngayDuyetStr = hoSo.NgayDuyetHoSoGiay?.ToString("yyyy-MM-dd HH:mm:ss");
                string updateQuery = hoSo.DuyetHoSoGiay == true
                    ? $"update dbo.HoSo set DuyetHoSoGiay = 1, NgayDuyetHoSoGiay = '{ngayDuyetStr}' where HoSoId = '{hoSo.HoSoId}'"
                    : $"update dbo.HoSo set DuyetHoSoGiay = 0, NgayDuyetHoSoGiay = NULL, TrangThai = N'{hoSo.TrangThai}' where HoSoId = '{hoSo.HoSoId}'";
                string sqlDataSource = _configuration.GetConnectionString("HoSoNCLSDataContext");
                using (SqlConnection conn = new SqlConnection(sqlDataSource))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
                    {
                        cmd.ExecuteNonQuery();
                    }
                    // Xóa giấy báo nhận
                    //if (hoSo.DuyetHoSoGiay != true)
                    //{
                    //    string deleteQuery = $"delete from dbo.TaiLieu where HoSoId = '{hoSo.HoSoId}' and Category = 'giaybaonhan'";
                    //    using (SqlCommand cmd = new SqlCommand(deleteQuery, conn))
                    //    {
                    //        cmd.ExecuteNonQuery();
                    //    }
                    //}
                    conn.Close();
                }
                var lichSu = new LichSuHoSo()
                {
                    HoSoId = hoSo.HoSoId,
                    Type = "Update",
                    Title = "Hồ sơ được cập nhật",
                    ChiTiet = "Hồ sơ được duyệt hồ sơ giấy",
                    UserId = userId,
                    ThoiGian = DateTime.Now,
                };
                db.LichSuHoSos.Add(lichSu);
                db.SaveChanges();
                return new JsonResult(new
                {
                    Error = false,
                    Message = "Cập nhật thông tin xét duyệt hồ sơ giấy thành công",
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    Error = true,
                    Code = 500,
                    Message = ex.Message,
                    InnerException = ex.InnerException?.Message ?? "None"
                });
            }
        }

        // Cap nhat ho so
        [HttpPut]
        public JsonResult Put(HoSo hoSo, int userId = 0)
        {
            string ngayRaQuyetDinhStr = hoSo.NgayRaQuyetDinh != null
                    ? $"'{hoSo.NgayRaQuyetDinh?.ToString("yyyy-MM-dd HH:mm:ss") ?? ""}'"
                    : "NULL";
            string query = $"update dbo.HoSo set TrangThai=N'{hoSo.TrangThai}', FileKetQua=N'{hoSo.FileKetQua}', LinkHop=N'{hoSo.LinkHop}', GioHop=N'{hoSo.GioHop}', NgayRaQuyetDinh={ngayRaQuyetDinhStr} where HoSoId='{hoSo.HoSoId}'";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("HoSoNCLSDataContext");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);

                    myReader.Close();
                    myCon.Close();
                }
            }
            var lichSu = new LichSuHoSo()
            {
                HoSoId = hoSo.HoSoId,
                Type = "Update",
                Title = "Hồ sơ được cập nhật",
                ChiTiet = "Thư ký hội đồng cập nhật thông tin hồ sơ",
                UserId = userId,
                ThoiGian = DateTime.Now,
            };
            db.LichSuHoSos.Add(lichSu);
            db.SaveChanges();
            return new JsonResult("Updated Successfully");
        }

        // Xoa 1 ho so
        [HttpDelete("{id}")]
        public JsonResult Delete(string id)
        {
            string query = @"delete from dbo.HoSo where HoSoId'='" + id + @"'";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("HoSoNCLSDataContext");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);

                    myReader.Close();
                    myCon.Close();
                }
            }
            var lichSu = new LichSuHoSo()
            {
                HoSoId = id,
                Type = "Delete",
                Title = "Hồ sơ đã bị xóa",
                UserId = 0,
                ThoiGian = DateTime.Now,
            };
            db.LichSuHoSos.Add(lichSu);
            db.SaveChanges();
            return new JsonResult("Deleted Successfully");
        }

        #region Cuộc họp
        // Lấy danh sách cuộc họp
        [HttpGet("{hoSoId}/cuocHop")]
        public JsonResult GetCuocHop(string hoSoId)
        {
            var result = db.CuocHops.AsNoTracking().Where(x => x.HoSoId == hoSoId)?.ToList() ?? new List<CuocHop>();
            return new JsonResult(result);
        }

        // Thêm cuộc họp mới
        [HttpPost("{hoSoId}/cuocHop/add")]
        public async Task<JsonResult> AddCuocHop(string hoSoId)
        {
            var fdCuocHop = Request.Form["cuocHop"];
            CuocHop hopInfo = JsonConvert.DeserializeObject<CuocHop>(fdCuocHop) ?? new CuocHop();
            var cuocHop = new CuocHop()
            {
                UserId = hopInfo.UserId,
                HoSoId = hopInfo.HoSoId,
                LinkHop = hopInfo.LinkHop,
                ThoiGian = hopInfo.ThoiGian,
                ThanhPhan = hopInfo.ThanhPhan,
                IsCurrent = hopInfo.IsCurrent,
            };
            db.CuocHops.Add(cuocHop);
            var cacCuocHopKhac = db.CuocHops.Where(x => x.HoSoId == hopInfo.HoSoId);
            if (cacCuocHopKhac != null)
            {
                foreach (var chk in cacCuocHopKhac)
                {
                    chk.IsCurrent = false;
                }
            }
            db.SaveChanges();
            if (Request.Form.Files != null && Request.Form.Files.Count > 0)
            {
                var files = Request.Form.Files.ToList();
                if (string.IsNullOrWhiteSpace(_hostEnvironment.WebRootPath))
                {
                    _hostEnvironment.WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }
                var folderPath = $"hoso\\{hopInfo.HoSoId}\\hop\\{cuocHop.CuocHopId}\\";
                var fullFolderPath = $"{_hostEnvironment.WebRootPath}\\{folderPath}";
                if (!Directory.Exists(fullFolderPath))
                {
                    Directory.CreateDirectory(fullFolderPath);
                }
                foreach (var file in files)
                {
                    var path = Path.Combine(_hostEnvironment.WebRootPath, folderPath, file.FileName);
                    var stream = new FileStream(path, FileMode.Create);
                    await file.CopyToAsync(stream);
                    stream.Close();
                    cuocHop.FileThuyetTrinh = file.FileName;
                    cuocHop.FileThuyetTrinhPath = Path.Combine(folderPath, file.FileName);
                }
            }
            db.SaveChanges();
            return new JsonResult(new
            {
                Error = false,
                Message = "Thêm cuộc họp thành công",
            });
        }

        // Update cuộc họp
        [HttpPost("{hoSoId}/cuocHop/update")]
        public async Task<JsonResult> UpdateCuocHop(string hoSoId)
        {
            var fdCuocHop = Request.Form["cuocHop"];
            CuocHop hopInfo = JsonConvert.DeserializeObject<CuocHop>(fdCuocHop) ?? new CuocHop();
            var cuocHop = db.CuocHops.FirstOrDefault(x => x.CuocHopId == hopInfo.CuocHopId);
            if (cuocHop == null) return new JsonResult(new { Error = false, Message = "Không tìm thấy cuộc họp cần cập nhật", });
            cuocHop.UserId = hopInfo.UserId;
            cuocHop.HoSoId = hopInfo.HoSoId;
            cuocHop.LinkHop = hopInfo.LinkHop;
            cuocHop.ThoiGian = hopInfo.ThoiGian;
            cuocHop.ThanhPhan = hopInfo.ThanhPhan;
            if (cuocHop.IsCurrent != true && hopInfo.IsCurrent == true)
            {
                // Nếu set cuộc họp này là cuộc học hiện tại khi đang không phải
                // Thì set các cuộc họp khác là hiện tại
                var cacCuocHopKhac = db.CuocHops.Where(x => x.HoSoId == cuocHop.HoSoId);
                if (cacCuocHopKhac != null)
                {
                    foreach(var chk in cacCuocHopKhac)
                    {
                        chk.IsCurrent = false;
                    }
                }
            }
            cuocHop.IsCurrent = hopInfo.IsCurrent;
            if (Request.Form.Files != null && Request.Form.Files.Count > 0)
            {
                var files = Request.Form.Files.ToList();
                if (string.IsNullOrWhiteSpace(_hostEnvironment.WebRootPath))
                {
                    _hostEnvironment.WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }
                var folderPath = $"hoso\\{hopInfo.HoSoId}\\hop\\{cuocHop.CuocHopId}\\";
                var fullFolderPath = $"{_hostEnvironment.WebRootPath}\\{folderPath}";
                if (!Directory.Exists(fullFolderPath))
                {
                    Directory.CreateDirectory(fullFolderPath);
                }
                foreach (var file in files)
                {
                    var path = Path.Combine(_hostEnvironment.WebRootPath, folderPath, file.FileName);
                    var stream = new FileStream(path, FileMode.Create);
                    await file.CopyToAsync(stream);
                    stream.Close();
                    cuocHop.FileThuyetTrinh = file.FileName;
                    cuocHop.FileThuyetTrinhPath = Path.Combine(folderPath, file.FileName);
                }
            }
            await db.SaveChangesAsync();
            return new JsonResult(new
            {
                Error = false,
                Message = "Cập nhật cuộc họp thành công",
            });
        }

        // Xóa cuộc họp
        [HttpPost("{hoSoId}/cuocHop/delete")]
        public async Task<JsonResult> DeleteCuocHop(string hoSoId, int cuocHopId)
        {
            var cuocHop = db.CuocHops.FirstOrDefault(x => x.CuocHopId == cuocHopId);
            if (cuocHop == null) return new JsonResult(new { Error = false, Message = "Không tìm thấy cuộc họp cần xóa", });
            db.CuocHops.Remove(cuocHop);
            await db.SaveChangesAsync();
            return new JsonResult(new
            {
                Error = false,
                Message = "Xóa cuộc họp thành công",
            });
        }
        #endregion Cuộc họp

        #region Helpers
        private Task RunSqlQuery(string query)
        {
            string sqlDataSource = _configuration.GetConnectionString("HoSoNCLSDataContext");
            using (SqlConnection conn = new SqlConnection(sqlDataSource))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.ExecuteNonQuery();
                }
                conn.Close();
            }
            return Task.CompletedTask;
        }
        #endregion Helpers
    }
}
