using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Data;
using Microsoft.AspNetCore.Authorization;
using hosotructuyen.Models;

namespace hosotructuyen.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PhanCongController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public PhanCongController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Tao moi danh sach hoi dong nhan xet
        [HttpPost]
        public JsonResult PhanCong(PhanCong dep)
        {
            string query = @"insert into dbo.PhanCong (UserId, HoSoId, PhanLoai) values (" + dep.UserId + @",N'" + dep.HoSoId + @"',N'" + dep.PhanLoai + @"')";
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
            return new JsonResult("Added Successfully");
        }

        // Xoa danh sach hoi dong cua mot Ho so
        [HttpDelete("hoso/{id}/kieu/{phanloai}")]
        public JsonResult DeleteHoiDong(string id, string phanloai)
        {
            string query = @"";
            if (phanloai == "khachmoi")
            {
                query = @"delete from dbo.PhanCong where HoSoId=N'" + id + @"' and PhanLoai=N'Khách mời'";
            } else if (phanloai == "hoidong")
            {
                query = @"delete from dbo.PhanCong where HoSoId=N'" + id + @"' and PhanLoai=N'Hội đồng'";
            }
            
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
            return new JsonResult("Deleted Successfully");
        }
    }
}
