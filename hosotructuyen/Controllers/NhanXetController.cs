using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

using Newtonsoft.Json;

using System;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

using hosotructuyen.Models;

namespace hosotructuyen.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class NhanXetController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly hosotructuyenContext db;
        public NhanXetController(IConfiguration configuration, IWebHostEnvironment hostEnvironment, hosotructuyenContext context)
        {
            _configuration = configuration;
            _hostEnvironment = hostEnvironment;
            db = context;
        }

        // Lay tat ca cac nhan xet cua 1 ho so
        [HttpGet("hoso/{id}")]
        public JsonResult Get(string id)
        {
            string query = @"
                select dbo.NhanXet.*, dbo.TaiKhoan.DisplayName, dbo.TaiKhoan.VaiTro from dbo.NhanXet inner join dbo.TaiKhoan on dbo.TaiKhoan.UserId=dbo.NhanXet.UserId where dbo.NhanXet.HoSoId='" + id + @"'";
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

        // Lay nhan xet 1 ho so cua 1 thanh vien hoi dong
        [HttpGet("hoso/{hoSoId}/user/{userId}")]
        public JsonResult Get(string hoSoId, int userId)
        {
            string query = @"select * from dbo.NhanXet where dbo.NhanXet.HoSoId='" + hoSoId + @"' and dbo.NhanXet.UserId=" + userId;
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

        [HttpPost]
        public JsonResult Post(NhanXet dep)
        {
            string query = @"
                insert into dbo.NhanXet (UserId, HoSoId, KetQua, FileNhanXet, GhiChu, NgayGui, MauBaoCao, Mau11, Mau12, Mau13, Mau14, Mau15, Mau21, Mau22, Mau23, Mau24, Mau25, Mau2611, Mau2612, Mau2613, 
                Mau2621, Mau2622, Mau2623, Mau2624, Mau2625, Mau2631, Mau2632, Mau2641, Mau2642, Mau2643, Mau2644, Mau2651, Mau2652, Mau2653, Mau266, Mau267, Mau27, Mau28, Mau29) values 
                (" + dep.UserId + @",'" + dep.HoSoId + @"',N'" + dep.KetQua + @"',N'" + dep.FileNhanXet + @"',N'" + dep.GhiChu + @"',N'" + dep.NgayGui + @"',N'" + dep.MauBaoCao 
                + @"',N'" + dep.Mau11 + @"',N'" + dep.Mau12 + @"',N'" + dep.Mau13 + @"',N'" + dep.Mau14 + @"',N'" + dep.Mau15 + @"',N'" + dep.Mau21 + @"',N'" + dep.Mau22 + @"',N'" + dep.Mau23
                + @"',N'" + dep.Mau24 + @"',N'" + dep.Mau25 + @"',N'" + dep.Mau2611 + @"',N'" + dep.Mau2612 + @"',N'" + dep.Mau2613 + @"',N'" + dep.Mau2621 + @"',N'" + dep.Mau2622 + @"',N'" + dep.Mau2623
                + @"',N'" + dep.Mau2624 + @"',N'" + dep.Mau2625 + @"',N'" + dep.Mau2631 + @"',N'" + dep.Mau2632 + @"',N'" + dep.Mau2641 + @"',N'" + dep.Mau2642 + @"',N'" + dep.Mau2643 + @"',N'" + dep.Mau2644
                + @"',N'" + dep.Mau2651 + @"',N'" + dep.Mau2652 + @"',N'" + dep.Mau2653 + @"',N'" + dep.Mau266 + @"',N'" + dep.Mau267 + @"',N'" + dep.Mau27 + @"',N'" + dep.Mau28 + @"',N'" + dep.Mau29 + @"')";
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
            var currentUser = db.TaiKhoans.AsNoTracking().FirstOrDefault(x => x.UserId == dep.UserId) ?? new TaiKhoan() { DisplayName = "Thành viên hội dồng" };
            var lichSu = new LichSuHoSo()
            {
                HoSoId = dep.HoSoId,
                Type = "NhanXet",
                Title = "Hồ sơ được nhận xét",
                ChiTiet = currentUser.DisplayName + " đã thêm nhận xét",
                UserId = dep.UserId,
                ThoiGian = DateTime.Now,
            };
            db.LichSuHoSos.Add(lichSu);
            db.SaveChanges();
            return new JsonResult("Added Successfully");
        }


        [HttpPut]
        public JsonResult Put(NhanXet dep)
        {
            string query = @"update dbo.NhanXet set GhiChu=N'" + dep.GhiChu + @"', KetQua=N'" + dep.KetQua + @"', FileNhanXet=N'" + dep.FileNhanXet + @"', NgayGui=N'" + dep.NgayGui + @"', Mau11=N'" + dep.Mau11 
                + @"', Mau12=N'" + dep.Mau12 + @"', Mau13=N'" + dep.Mau13 + @"', Mau14=N'" + dep.Mau14 + @"', Mau15=N'" + dep.Mau15 + @"', Mau21=N'" + dep.Mau21 + @"', Mau22=N'" + dep.Mau22 
                + @"', Mau23=N'" + dep.Mau23 + @"', Mau24=N'" + dep.Mau24 + @"', Mau25=N'" + dep.Mau25 + @"', Mau2611=N'" + dep.Mau2611 + @"', Mau2612=N'" + dep.Mau2612 + @"', Mau2613=N'" + dep.Mau2613 
                + @"', Mau2621=N'" + dep.Mau2621 + @"', Mau2622=N'" + dep.Mau2622 + @"', Mau2623=N'" + dep.Mau2623 + @"', Mau2624=N'" + dep.Mau2624 + @"', Mau2625=N'" + dep.Mau2625 
                + @"', Mau2631=N'" + dep.Mau2631 + @"', Mau2632=N'" + dep.Mau2632 + @"', Mau2641=N'" + dep.Mau2641 + @"', Mau2642=N'" + dep.Mau2642 + @"', Mau2643=N'" + dep.Mau2643 
                + @"', Mau2644=N'" + dep.Mau2644 + @"', Mau2651=N'" + dep.Mau2651 + @"', Mau2652=N'" + dep.Mau2652 + @"', Mau2653=N'" + dep.Mau2653 + @"', Mau266=N'" + dep.Mau266 
                + @"', Mau267=N'" + dep.Mau267 + @"', Mau27=N'" + dep.Mau27 + @"', Mau28=N'" + dep.Mau28 + @"', Mau29=N'" + dep.Mau29 + @"', MauBaoCao=N'" + dep.MauBaoCao + @"' where NhanXetId=" + dep.NhanXetId;
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
            var currentUser = db.TaiKhoans.AsNoTracking().FirstOrDefault(x => x.UserId == dep.UserId) ?? new TaiKhoan() { DisplayName = "Thành viên hội dồng" };
            var lichSu = new LichSuHoSo()
            {
                HoSoId = dep.HoSoId,
                Type = "NhanXet",
                Title = "Nhận xét được cập nhật",
                ChiTiet = currentUser.DisplayName + " đã cập nhật nhận xét",
                UserId = dep.UserId,
                ThoiGian = DateTime.Now,
            };
            db.SaveChanges();
            return new JsonResult("Updated Successfully");
        }


        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            var nhanXet = db.NhanXets.FirstOrDefault(x => x.NhanXetId == id);
            var taiKhoan = db.TaiKhoans.AsNoTracking().FirstOrDefault(x => x.UserId == nhanXet.UserId) ?? new TaiKhoan() { DisplayName = "Thành viên hội dồng" };
            var lichSu = new LichSuHoSo()
            {
                HoSoId = nhanXet.HoSoId,
                Type = "NhanXet",
                Title = "Nhận xét được xóa",
                ChiTiet = taiKhoan.DisplayName + " đã xóa nhận xét",
                UserId = nhanXet.UserId,
                ThoiGian = DateTime.Now,
            };
            db.NhanXets.Remove(nhanXet);
            db.SaveChanges();
            return new JsonResult("Deleted Successfully");
        }
    }
}
