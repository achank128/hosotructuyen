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
    public class ThongBaoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public ThongBaoController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Lay thong bao cua 1 user
        [HttpGet("user/{id}/role/{role}/{offsetNum}/{nextNum}")]
        public JsonResult Get(int id, string role, int offsetNum, int nextNum)
        {
            string query = @"";
            if (role == "admin")
            {
                query = @"select * from dbo.ThongBao where dbo.ThongBao.NguoiNhanId IN (0, " + id + @") order by dbo.ThongBao.TrangThai desc, dbo.ThongBao.ThongBaoId desc offset " + offsetNum + @" rows fetch next " + nextNum + @" rows only";
            } else if (role == "user")
            {
                query = @"select * from dbo.ThongBao where dbo.ThongBao.NguoiNhanId=" + id + @"order by dbo.ThongBao.TrangThai desc, dbo.ThongBao.ThongBaoId desc offset " + offsetNum + @" rows fetch next " + nextNum + @" rows only";
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
            return new JsonResult(table);
        }

        [HttpPost]
        public JsonResult Post(ThongBao dep)
        {
            string query = @"
                    insert into dbo.ThongBao (NguoiTaoId, NguoiNhanId, LoaiThongBao, NoiDung, HoSoId, NgayTao, TrangThai, NguoiGui) values 
                    (" + dep.NguoiTaoId + @"," + dep.NguoiNhanId + @",N'" + dep.LoaiThongBao + @"',N'" + dep.NoiDung + @"',N'" + dep.HoSoId + @"',N'" + dep.NgayTao + @"',N'" + dep.TrangThai + @"',N'" + dep.NguoiGui + @"')";
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

        [HttpPut]
        public JsonResult Put(ThongBao dep)
        {
            string query = @"update dbo.ThongBao set TrangThai=N'" + dep.TrangThai + @"' where ThongBaoId=" + dep.ThongBaoId;
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
            return new JsonResult("Updated Successfully");
        }

        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            string query = @"delete from dbo.ThongBao where dbo.ThongBao.ThongBaoId=" + id;
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
