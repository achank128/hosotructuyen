using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Data;
using BC = BCrypt.Net.BCrypt;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using System.Text;
using hosotructuyen.Models;

namespace hosotructuyen.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaiKhoanController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public TaiKhoanController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Lay danh sach tat ca cac tai khoan
        [Authorize]
        [HttpGet("filter/{keyword}")]
        public JsonResult Get(string keyword)
        {
            string query = @"";
            if (keyword == "all")
            {
                query = @"select * from dbo.TaiKhoan";
            }
            else if (keyword == "reviewer")
            {
                query = @"select * from dbo.TaiKhoan where dbo.TaiKhoan.Role IN (N'admin', N'reviewer')";
            }
            else if (keyword == "user")
            {
                query = @"select * from dbo.TaiKhoan where dbo.TaiKhoan.Role IN (N'user1', N'user2', N'user3', N'user4')";
            }
            System.Diagnostics.Debug.WriteLine(keyword);
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

        // Lay thong tin chi tiet 1 tai khoan
        [Authorize]
        [HttpGet("{userId}")]
        public JsonResult Get(int userId)
        {
            string query = @"select * from dbo.TaiKhoan where dbo.TaiKhoan.UserId=" + userId;
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

        // Admin tao tai khoan moi
        [Authorize]
        [HttpPost]
        public JsonResult AdminTao(TaiKhoan dep)
        {
            string passwordHash = BC.HashPassword(dep.Password);
            string query = @"insert into dbo.TaiKhoan (UserName, DisplayName, Password, Role, Email, Phone, Address, TrangThai, VaiTro, ChucVu, Avatar, NgayCapNhat, NgayHetHan) values 
                (N'" + dep.UserName + @"',N'" + dep.DisplayName + @"',N'" + passwordHash + @"',N'" + dep.Role + @"',N'" + dep.Email + @"',N'" + dep.Phone + @"',N'" + dep.Address + @"',N'"
                + dep.TrangThai + @"',N'" + dep.VaiTro + @"',N'" + dep.ChucVu + @"',N'" + dep.Avatar + @"',N'" + dep.NgayCapNhat + @"',N'" + dep.NgayHetHan + @"')";
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

        // Nguoi dung dang ky tai khoan moi
        [HttpPost("dangky")]
        public JsonResult DangKy(TaiKhoan dep)
        {
            string passwordHash = BC.HashPassword(dep.Password);
            string query = @"insert into dbo.TaiKhoan (UserName, DisplayName, Password, Role, Email, Phone, Address, TrangThai, VaiTro, ChucVu, Avatar, NgayCapNhat, NgayHetHan) values 
                (N'" + dep.UserName + @"',N'" + dep.DisplayName + @"',N'" + passwordHash + @"',N'" + dep.Role + @"',N'" + dep.Email + @"',N'" + dep.Phone + @"',N'" + dep.Address + @"',N'"
                + dep.TrangThai + @"',N'" + dep.VaiTro + @"',N'" + dep.ChucVu + @"',N'" + dep.Avatar + @"',N'" + dep.NgayCapNhat + @"',N'" + dep.NgayHetHan + @"')";
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

        // Cap nhat thong tin 1 tai khoan
        [Authorize]
        [HttpPut]
        public JsonResult Put(TaiKhoan dep)
        {
            string query = "";
            if (dep.Password == "")
            {
                query = @"update dbo.TaiKhoan set UserName=N'" + dep.UserName + @"', DisplayName=N'" + dep.DisplayName + @"', Role=N'" + dep.Role + @"', Email=N'" + dep.Email + @"', Phone=N'" + dep.Phone
                    + @"', Address=N'" + dep.Address + @"', TrangThai=N'" + dep.TrangThai + @"', VaiTro=N'" + dep.VaiTro + @"', ChucVu=N'" + dep.ChucVu 
                    + @"', Avatar=N'" + dep.Avatar + @"', NgayCapNhat=N'" + dep.NgayCapNhat + @"', NgayHetHan=N'" + dep.NgayHetHan + @"' where UserId=" + dep.UserId;
            } else {
                string passwordHash = BC.HashPassword(dep.Password);
                query = @"update dbo.TaiKhoan set UserName=N'" + dep.UserName + @"', DisplayName=N'" + dep.DisplayName + @"', Password=N'" + passwordHash + @"', Role=N'" + dep.Role + @"', Email=N'" + dep.Email 
                    + @"', Phone=N'" + dep.Phone + @"', Address=N'" + dep.Address + @"', TrangThai=N'" + dep.TrangThai + @"', VaiTro=N'" + dep.VaiTro + @"', ChucVu=N'" + dep.ChucVu 
                    + @"', Avatar=N'" + dep.Avatar + @"', NgayCapNhat=N'" + dep.NgayCapNhat + @"', NgayHetHan=N'" + dep.NgayHetHan + @"' where UserId=" + dep.UserId;
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
            return new JsonResult("Updated Successfully");
        }

        // Xoa 1 tai khoan
        [Authorize]
        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            string query = @"delete from dbo.TaiKhoan where dbo.TaiKhoan.UserId=" + id;
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

        // Login
        [HttpPost("login")]
        public JsonResult CheckLogin(TaiKhoan dep)
        {
            bool checkLogin = false;
            string queryPass = @"select dbo.TaiKhoan.Password from dbo.TaiKhoan where dbo.TaiKhoan.UserName=N'" + dep.UserName + @"'";
            string queryUser = @"select * from dbo.TaiKhoan where dbo.TaiKhoan.UserName=N'" + dep.UserName + @"'";
            string sqlDataSource = _configuration.GetConnectionString("HoSoNCLSDataContext");
            DataTable table = new DataTable();
            SqlDataReader readerPass, readerUser;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(queryPass, myCon))
                {
                    readerPass = myCommand.ExecuteReader();
                    if (!readerPass.HasRows)
                    {
                        checkLogin = false;
                    }
                    else
                    {
                        while (readerPass.Read())
                        {
                            checkLogin = BC.Verify(dep.Password, readerPass.GetValue(0).ToString());
                            if (checkLogin)
                            {
                                using (SqlCommand myCommand2 = new SqlCommand(queryUser, myCon))
                                {
                                    readerUser = myCommand2.ExecuteReader();
                                    table.Load(readerUser);
                                    readerUser.Close();
                                }
                            }
                        }
                        
                    }
                    readerPass.Close();
                }
                myCon.Close();
            }

            if (checkLogin) { 
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var tokenTmp = new JwtSecurityToken(_configuration["Jwt:Issuer"], _configuration["Jwt:Audience"], null, expires: DateTime.UtcNow.AddDays(7), signingCredentials: signIn);
                return new JsonResult(new { token = new JwtSecurityTokenHandler().WriteToken(tokenTmp), userInfo = table });
            } else
            {
                return new JsonResult(new { token = "", userInfo = table });
            }
        }
    }
}
