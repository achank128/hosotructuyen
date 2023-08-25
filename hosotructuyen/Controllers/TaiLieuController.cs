using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using hosotructuyen.Models;
using System.Linq;
using Newtonsoft.Json;
using Syncfusion.DocIO;
using Syncfusion.DocIO.DLS;

namespace hosotructuyen.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TaiLieuController : ControllerBase
    {
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IConfiguration _configuration;

        public TaiLieuController(IConfiguration configuration, IWebHostEnvironment hostEnvironment)
        {
            _hostEnvironment = hostEnvironment;
            _configuration = configuration;
        }

        [HttpGet("hoso/{id}")]
        public JsonResult GetFileAttached(string id)
        {
            string query = @"select dbo.TaiLieu.* from dbo.TaiLieu where dbo.TaiLieu.HoSoId='" + id + @"'";
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

        [HttpPost("hoso/{hoSoId}/{category}/{userId}")]
        public async Task<JsonResult> UploadFile(List<IFormFile> files, string category, string hoSoId, int userId)
        {
            string fileInputQuery = "";
            try
            {
                if (string.IsNullOrWhiteSpace(_hostEnvironment.WebRootPath))
                {
                    _hostEnvironment.WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }
                var fdFilesInfo = Request.Form["filesInfo"];
                List<TaiLieu> filesInfo = !string.IsNullOrEmpty(fdFilesInfo)
                    ? JsonConvert.DeserializeObject<List<TaiLieu>>(fdFilesInfo) ?? new List<TaiLieu>()
                    : new List<TaiLieu>();
                fileInputQuery = @"insert into dbo.TaiLieu (UserId, FileName, HoSoId, FilePath, Category, DocNameVN, DocNameEN, VersionAndDate) values ";
                foreach (var file in files)
                {
                    var guid = Guid.NewGuid();
                    var shortUrl = @"hoso\" + hoSoId + @"\" + userId + @"\" + guid;
                    var fullUrl = _hostEnvironment.WebRootPath + @"\hoso\" + hoSoId + @"\" + userId + @"\" + guid;
                    if (!Directory.Exists(fullUrl))
                    {
                        Directory.CreateDirectory(fullUrl);
                    }
                    var path = Path.Combine(_hostEnvironment.WebRootPath, shortUrl, file.FileName);
                    var stream = new FileStream(path, FileMode.Create);
                    await file.CopyToAsync(stream);
                    //fileInputQuery += @"(" + userId + @",N'" + file.FileName + @"'," + hoSoId + @",N'" + "Path" + @"',N'" + category + @"'),";
                    if (filesInfo.Count() > 0)
                    {
                        var fileInfo = filesInfo.FirstOrDefault(x => x.FileName == file.FileName);
                        if (fileInfo != null)
                        {
                            fileInputQuery += $"({userId},N'{fileInfo.FileName}','{hoSoId}',N'{guid}',N'{category}',N'{fileInfo.DocNameVn}',N'{fileInfo.DocNameEn}',N'{fileInfo.VersionAndDate}'),";
                        }
                        else
                        {
                            fileInputQuery += $"({userId},N'{file.FileName}','{hoSoId}',N'{guid}',N'{category}',NULL,NULL,NULL),";
                        }
                    }
                    else
                    {
                        fileInputQuery += $"({userId},N'{file.FileName}','{hoSoId}',N'{guid}',N'{category}',NULL,NULL,NULL),";
                    }
                    stream.Close();
                }
                string query = fileInputQuery.Substring(0, fileInputQuery.Length - 1);
                DataTable table = new DataTable();
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
                return new JsonResult(new
                {
                    Error = false,
                    Message = "Upload file thành công",
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
                    Query = fileInputQuery,
                    FileCount = files?.Count() ?? -1,
                });
            }
        }

        [HttpPost("hoso/{hoSoId}/{category}/{userId}/single")]
        public async Task<JsonResult> UploadOneFile(List<IFormFile> files, string category, string hoSoId, int userId)
        {
            string fileInputQuery = "";
            try
            {
                var fdFileInfo = Request.Form["fileInfo"];
                TaiLieu fileInfo = JsonConvert.DeserializeObject<TaiLieu>(fdFileInfo) ?? new TaiLieu();
                fileInputQuery = @"insert into dbo.TaiLieu (UserId, FileName, HoSoId, FilePath, Category, DocNameVN, DocNameEN, VersionAndDate) values ";
                foreach (var file in files)
                {
                    var guid = Guid.NewGuid();
                    var shortUrl = @"hoso\" + hoSoId + @"\" + userId + @"\" + guid;
                    var fullUrl = _hostEnvironment.WebRootPath + @"\hoso\" + hoSoId + @"\" + userId + @"\" + guid;
                    if (!Directory.Exists(fullUrl))
                    {
                        Directory.CreateDirectory(fullUrl);
                    }
                    var path = Path.Combine(_hostEnvironment.WebRootPath, shortUrl, file.FileName);
                    var stream = new FileStream(path, FileMode.Create);
                    await file.CopyToAsync(stream);
                    fileInputQuery += $"({userId},N'{fileInfo.FileName}','{hoSoId}',N'{guid}',N'{category}',N'{fileInfo.DocNameVn}',N'{fileInfo.DocNameEn}',N'{fileInfo.VersionAndDate}'),";
                    stream.Close();
                }
                string query = fileInputQuery.Substring(0, fileInputQuery.Length - 1);
                DataTable table = new DataTable();
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
                return new JsonResult(new
                {
                    Error = false,
                    Message = "Upload file thành công",
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
                    Query = fileInputQuery,
                });
            }
        }


        [HttpPost("hoso/{hoSoId}/DeleteCategoryFiles/{userId}")]
        public JsonResult DeleteByCategory(TaiLieu info)
        {
            string eTitle = "Xóa file";
            try
            {
                string sqlDataSource = _configuration.GetConnectionString("HoSoNCLSDataContext");
                using (SqlConnection conn = new SqlConnection(sqlDataSource))
                {
                    conn.Open();
                    // Delete files on disk
                    var fileNames = new List<string>();
                    string selectQuery = $"select FileName from dbo.TaiLieu where HoSoId = {info.HoSoId} and Category = '{info.Category}'";
                    using (SqlCommand cmd = new SqlCommand(selectQuery, conn))
                    {
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                fileNames.Add(reader["FileName"].ToString());
                            }
                        }
                    }
                    var folderPath = $"{_hostEnvironment.WebRootPath}\\hoso\\{info.HoSoId}\\{info.UserId}";
                    foreach (var fileName in fileNames)
                    {
                        var filePath = Path.Combine(folderPath, fileName);
                        System.IO.File.Delete(filePath);
                    }
                    // Delete SQL data
                    string deleteQuery = $"delete from dbo.TaiLieu where HoSoId = {info.HoSoId} and Category = '{info.Category}'";
                    DataTable table = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(deleteQuery, conn))
                    {
                        cmd.ExecuteNonQuery();
                        conn.Close();
                    }
                }
                return new JsonResult(new
                {
                    Error = false,
                    Message = eTitle + " thành công",
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    Error = true,
                    Message = eTitle + " không thành công",
                    Exception = new
                    {
                        Message = ex.Message,
                        InnerException = ex.InnerException?.Message ?? "None"
                    }
                });
            }
        }

        [HttpPost("hoso/{hoSoId}/MarkHardCopy/{userId}")]
        public JsonResult MarkHardCopy(TaiLieu info)
        {
            string eTitle = "Đánh dấu bản cứng";
            try
            {
                var hardCopyBit = info.HardCopy == true ? 1 : 0;
                string query = $"update dbo.TaiLieu set HardCopy = {hardCopyBit} where TaiLieuId = {info.TaiLieuId}";
                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("HoSoNCLSDataContext");
                using (SqlConnection conn = new SqlConnection(sqlDataSource))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.ExecuteNonQuery();
                        conn.Close();
                    }
                }
                return new JsonResult(new
                {
                    Error = false,
                    Message = eTitle + " thành công",
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    Error = true,
                    Message = eTitle + " không thành công",
                    Exception = new
                    {
                        Message = ex.Message,
                        InnerException = ex.InnerException?.Message ?? "None"
                    }
                });
            }
        }

        // Download tai lieu
        [HttpGet()]
        public async Task<IActionResult> Download(string hoso, int user, string filename, string guid = "Path")
        {
            if (filename == null)
                return Content("Không tồn tại file này!");
            string folder;
            if (user == 0)
            {
                folder = @"hoso\" + hoso;
            }
            else
            {
                folder = @"hoso\" + hoso + @"\" + user;
            }
            if (guid.Length > 0 && guid != "Path") folder = folder + @"\" + guid;
            string path = "";
            if (guid.Length > 0 && guid.Contains(filename))
                path = Path.Combine(_hostEnvironment.WebRootPath, guid);
            else
                path = Path.Combine(_hostEnvironment.WebRootPath, folder, filename);

            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(path), Path.GetFileName(path));
        }

        [HttpPost("hoso/{hoSoId}/exportAoR/{userId}")]
        public object ExportAoR(string hoSoId, int userId)
        {
            try
            {
                var fdHoSo = Request.Form["hoSo"];
                HoSo hoSo = !string.IsNullOrEmpty(fdHoSo)
                    ? JsonConvert.DeserializeObject<HoSo>(fdHoSo) ?? new HoSo() { HoSoId = "" }
                    : new HoSo() { HoSoId = "" };
                var fdFileList = Request.Form["fileList"];
                List<TaiLieu> fileList = !string.IsNullOrEmpty(fdFileList)
                    ? JsonConvert.DeserializeObject<List<TaiLieu>>(fdFileList) ?? new List<TaiLieu>()
                    : new List<TaiLieu>();
                if (string.IsNullOrEmpty(hoSo.HoSoId)) return new JsonResult(new
                {
                    Error = true,
                    Code = 400,
                    Message = "Hệ thống không nhận được thông tin hồ sơ, vui lòng kiểm tra lại.",
                });
                if (fileList.Count == 0) return new JsonResult(new
                {
                    Error = true,
                    Code = 400,
                    Message = "Hồ sơ không có tài liệu nào.",
                });
                string templatePath = _hostEnvironment.ContentRootPath + "\\ClientApp\\build\\files\\templates\\GiayBaoNhan.docx";
                string contentType = "application/vnd.ms-word.document.12";
                string fileName = "GiayBaoNhan_" + hoSo.HoSoId + ".docx";
                FormatType formatType = FormatType.Docx;
                FileStream inputStream = new FileStream(templatePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
                WordDocument doc = new WordDocument(inputStream, formatType);
                inputStream.Flush();
                inputStream.Dispose();
                string[] fieldNames = new string[] {
                    "TenNghienCuuVN",
                    "TenNghienCuuEN",
                    "MaSoNghienCuu",
                    "ChuNhiemDeTai",
                    "NhaTaiTro",
                };
                string[] fieldValues = new string[] {
                    hoSo.TenDeTai,
                    "",
                    hoSo.MaSoDeTai,
                    hoSo.NghienCuuVien,
                    hoSo.NhaTaiTro,
                };
                doc.MailMerge.Execute(fieldNames, fieldValues);
                doc.MailMerge.RemoveEmptyGroup = true;
                var wtable = doc.Sections[0].Tables[1]; //NOTE: Danh sách là table 2, index = 1
                if (fileList.Count() > 0)
                {
                    wtable.Rows.RemoveAt(1); //NOTE: Xóa row mẫu để loop lại, row 0 là header
                    int stt = 1;
                    foreach (var _file in fileList)
                    {
                        var wtrow = wtable.AddRow(isCopyFormat: true, autoPopulateCells: true);
                        //STT
                        var text0 = wtrow.Cells[0].AddParagraph().AppendText(stt.ToString());
                        text0.CharacterFormat.FontName = "Times New Roman";
                        text0.CharacterFormat.FontSize = 13;
                        text0.CharacterFormat.Bold = true;
                        wtrow.Cells[0].LastParagraph.ParagraphFormat.HorizontalAlignment = HorizontalAlignment.Center;
                        wtrow.Cells[0].CellFormat.VerticalAlignment = VerticalAlignment.Middle;
                        //Tên tài liệu
                        var text1 = wtrow.Cells[1].AddParagraph().AppendText(_file.DocNameVn ?? "");
                        wtrow.Cells[1].CellFormat.VerticalAlignment = VerticalAlignment.Middle;
                        text1.CharacterFormat.FontName = "Times New Roman";
                        text1.CharacterFormat.FontSize = 13;
                        //Phiên bản/ngày
                        var text2 = wtrow.Cells[2].AddParagraph().AppendText(_file.VersionAndDate ?? "");
                        wtrow.Cells[2].CellFormat.VerticalAlignment = VerticalAlignment.Middle;
                        text2.CharacterFormat.FontName = "Times New Roman";
                        text2.CharacterFormat.FontSize = 13;
                        stt++;
                    }
                }
                ////OPTION 1: Trực tiếp trả về file////
                //MemoryStream ms = new MemoryStream();
                //doc.Save(ms, formatType);
                //doc.Close();
                //ms.Position = 0;
                //return File(ms, contentType, fileName);
                ////OPTION 2: Lưu vào server và trả về đường dẫn////
                string savePath = _hostEnvironment.WebRootPath + "\\open\\" + fileName;
                FileStream outputStream = new FileStream(savePath, FileMode.Create, FileAccess.ReadWrite, FileShare.ReadWrite);
                doc.Save(outputStream, formatType);
                doc.Close();
                outputStream.Flush();
                outputStream.Dispose();
                var result = new JsonResult(new
                {
                    Error = false,
                    Code = 200,
                    Message = "Xuất file thành công",
                    FileInfo = new
                    {
                        name = fileName,
                        type = contentType,
                        path = "/open/" + fileName + "?v=" + DateTime.Now.Ticks,
                    },
                });
                return result;
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    Error = true,
                    Code = 500,
                    Message = ex.Message,
                    InnerException = ex.InnerException?.Message ?? "None",
                });
            }
        }

        [HttpPost("hoso/{hoSoId}/exportNX/{userId}")]
        public object ExportNX(string hoSoId, int userId)
        {
            try
            {
                var fdNhanXet = Request.Form["nhanXet"];
                NhanXet nhanXet = !string.IsNullOrEmpty(fdNhanXet)
                    ? JsonConvert.DeserializeObject<NhanXet>(fdNhanXet) ?? new NhanXet() { NhanXetId = 0 }
                    : new NhanXet() { NhanXetId = 0 };
                var fdHoSo = Request.Form["hoSo"];
                HoSo hoSo = JsonConvert.DeserializeObject<HoSo>(fdHoSo) ?? new HoSo() { HoSoId = "" };
                if (!(nhanXet.NhanXetId > 0)) return new JsonResult(new
                {
                    Error = true,
                    Code = 400,
                    Message = "Hệ thống không nhận được thông tin nhận xét, vui lòng kiểm tra lại.",
                });
                var fdTaiKhoan = Request.Form["taiKhoan"];
                TaiKhoan currentUser = JsonConvert.DeserializeObject<TaiKhoan>(fdTaiKhoan);

                bool isTNLS = nhanXet.MauBaoCao == "Thử nghiệm lâm sàng";
                string templatePath = _hostEnvironment.ContentRootPath + "\\ClientApp\\build\\files\\templates\\" +
                    (isTNLS ? "NhanXetTNLS.docx" : "NhanXetNCQS.docx");
                string contentType = "application/vnd.ms-word.document.12";
                string fileName = $"Nhận xét đề tài - {currentUser.DisplayName}.docx";
                FormatType formatType = FormatType.Docx;
                FileStream inputStream = new FileStream(templatePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
                WordDocument doc = new WordDocument(inputStream, formatType);
                inputStream.Flush();
                inputStream.Dispose();
                // Các MergeField
                List<string> fieldNamesList = new List<string>();
                List<string> fieldValuesList = new List<string>();
                if (isTNLS)
                {
                    fieldNamesList = new List<string>() {
                        "TenDeTai",
                        "MaSoDeTai",
                        "ChuNhiemDeTai",
                        "NgayNhanXet",
                        "NhanXet1",
                        "NhanXet2",
                        "NhanXet3",
                        "NhanXet4",
                        "NhanXet5",
                        "NhanXet611",
                        "NhanXet612",
                        "NhanXet613",
                        "NhanXet621",
                        "NhanXet622",
                        "NhanXet623",
                        "NhanXet624",
                        "NhanXet625",
                        "NhanXet631",
                        "NhanXet632",
                        "NhanXet641",
                        "NhanXet642",
                        "NhanXet643",
                        "NhanXet644",
                        "NhanXet651",
                        "NhanXet652",
                        "NhanXet653",
                        "NhanXet66",
                        "NhanXet7",
                        "NhanXet8",
                        "NhanXet9",
                        "NgayThangNam",
                        "NguoiNhanXet",
                    };
                    fieldValuesList = new List<string>() {
                        hoSo.TenDeTai,
                        hoSo.MaSoDeTai,
                        hoSo.NghienCuuVien,
                        nhanXet.NgayGui,
                        nhanXet.Mau21,
                        nhanXet.Mau22,
                        nhanXet.Mau23,
                        nhanXet.Mau24,
                        nhanXet.Mau25,
                        nhanXet.Mau2611,
                        nhanXet.Mau2612,
                        nhanXet.Mau2613,
                        nhanXet.Mau2621,
                        nhanXet.Mau2622,
                        nhanXet.Mau2623,
                        nhanXet.Mau2624,
                        nhanXet.Mau2625,
                        nhanXet.Mau2631,
                        nhanXet.Mau2632,
                        nhanXet.Mau2641,
                        nhanXet.Mau2642,
                        nhanXet.Mau2643,
                        nhanXet.Mau2644,
                        nhanXet.Mau2651,
                        nhanXet.Mau2652,
                        nhanXet.Mau2653,
                        nhanXet.Mau266,
                        nhanXet.Mau27,
                        nhanXet.Mau28,
                        nhanXet.Mau29,
                        DateTime.Today.ToString("'Ngày 'dd' tháng 'MM' năm 'yyyy"),
                        currentUser.DisplayName,
                    };
                }
                else // Nghiên cứu quan sát
                {
                    fieldNamesList = new List<string>() {
                        "TenDeTai",
                        "MaSoDeTai",
                        "ChuNhiemDeTai",
                        "NgayNhanXet",
                        "NhanXet1",
                        "NhanXet2",
                        "NhanXet3",
                        "NhanXet4",
                        "NhanXet5",
                        "NgayThangNam",
                        "NguoiNhanXet",
                    };
                    fieldValuesList = new List<string>() {
                        hoSo.TenDeTai,
                        hoSo.MaSoDeTai,
                        hoSo.NghienCuuVien,
                        nhanXet.NgayGui,
                        nhanXet.Mau11,
                        nhanXet.Mau12,
                        nhanXet.Mau13,
                        nhanXet.Mau14,
                        nhanXet.Mau15,
                        DateTime.Today.ToString("'Ngày 'dd' tháng 'MM' năm 'yyyy"),
                        currentUser.DisplayName,
                    };
                }
                string[] fieldNames = fieldNamesList.ToArray();
                string[] fieldValues = fieldValuesList.ToArray();
                doc.MailMerge.Execute(fieldNames, fieldValues);
                doc.MailMerge.RemoveEmptyGroup = true;
                // Checkbox
                var ketLuan = "KL4";
                switch (nhanXet.KetQua)
                {
                    case "Chấp thuận thông qua":
                        ketLuan = "KL1"; break;
                    case "Chấp thuận thông qua có chỉnh sửa":
                        ketLuan = "KL2"; break;
                    case "Đề nghị sửa chữa để xét duyệt lại":
                        ketLuan = "KL3"; break;
                    case "Không chấp thuận":
                    default:
                        ketLuan = "KL4"; break;
                }
                foreach (ParagraphItem item in doc.LastParagraph.ChildEntities)
                {
                    if (item is WCheckBox)
                    {
                        WCheckBox checkbox = item as WCheckBox;
                        //Modifies check box properties
                        if (checkbox.Name == ketLuan)
                            checkbox.Checked = true;
                        else
                            checkbox.Checked = false;
                    }
                }
                ////OPTION 1: Trực tiếp trả về file////
                //MemoryStream ms = new MemoryStream();
                //doc.Save(ms, formatType);
                //doc.Close();
                //ms.Position = 0;
                //return File(ms, contentType, fileName);
                ////OPTION 2: Lưu vào server và trả về đường dẫn////
                string savePath = _hostEnvironment.WebRootPath + "\\open\\" + fileName;
                FileStream outputStream = new FileStream(savePath, FileMode.Create, FileAccess.ReadWrite, FileShare.ReadWrite);
                doc.Save(outputStream, formatType);
                doc.Close();
                outputStream.Flush();
                outputStream.Dispose();
                var result = new JsonResult(new
                {
                    Error = false,
                    Code = 200,
                    Message = "Xuất file thành công",
                    FileInfo = new
                    {
                        name = fileName,
                        type = contentType,
                        path = "/open/" + fileName + "?v=" + DateTime.Now.Ticks,
                    },
                });
                return result;
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    Error = true,
                    Code = 500,
                    Message = ex.Message,
                    InnerException = ex.InnerException?.Message ?? "None",
                });
            }
        }

        [HttpPost("hoso/{hoSoId}/exportSC/{userId}")]
        public object ExportSC(string hoSoId, int userId)
        {
            try
            {
                var fdHoSo = Request.Form["hoSo"];
                HoSo hoSo = !string.IsNullOrEmpty(fdHoSo)
                    ? JsonConvert.DeserializeObject<HoSo>(fdHoSo) ?? new HoSo() { HoSoId = "" }
                    : new HoSo() { HoSoId = "" };
                var fdFileList = Request.Form["fileList"];
                List<TaiLieu> fileList = !string.IsNullOrEmpty(fdFileList)
                    ? JsonConvert.DeserializeObject<List<TaiLieu>>(fdFileList) ?? new List<TaiLieu>()
                    : new List<TaiLieu>();
                if (string.IsNullOrEmpty(hoSo.HoSoId)) return new JsonResult(new
                {
                    Error = true,
                    Code = 400,
                    Message = "Hệ thống không nhận được thông tin hồ sơ, vui lòng kiểm tra lại.",
                });
                if (fileList.Count == 0) return new JsonResult(new
                {
                    Error = true,
                    Code = 400,
                    Message = "Hồ sơ không có tài liệu nào.",
                });
                string templatePath = _hostEnvironment.ContentRootPath + "\\ClientApp\\build\\files\\templates\\SubmissionChecklist.docx";
                string contentType = "application/vnd.ms-word.document.12";
                string fileName = "SubmissionChecklist_" + hoSo.HoSoId + ".docx";
                FormatType formatType = FormatType.Docx;
                FileStream inputStream = new FileStream(templatePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
                WordDocument doc = new WordDocument(inputStream, formatType);
                inputStream.Flush();
                inputStream.Dispose();
                string[] fieldNames = new string[] {
                    "TenDeTai",
                    "MaSoDeTai",
                    "NhaTaiTro",
                    "ChuNhiemDeTai",
                    "ThoiGianNghienCuu",
                    "NgayThangNam",
                    "DaiDienHoiDong",
                };
                var today = DateTime.Today;
                string[] fieldValues = new string[] {
                    hoSo.TenDeTai,
                    hoSo.MaSoDeTai,
                    hoSo.NhaTaiTro,
                    hoSo.NghienCuuVien,
                    hoSo.ThoiGianThucHien,
                    $"ngày {today.Day.ToString("00")} tháng {today.Month} năm {today.Year}",
                    string.Empty,
                };
                doc.MailMerge.Execute(fieldNames, fieldValues);
                doc.MailMerge.RemoveEmptyGroup = true;
                var wtable = doc.Sections[0].Tables[0]; //NOTE: Danh sách là table 2, index = 1
                if (fileList.Count() > 0)
                {
                    wtable.Rows.RemoveAt(1); //NOTE: Xóa row mẫu để loop lại, row 0 là header
                    int stt = 1;
                    foreach (var _file in fileList)
                    {
                        var wtrow = wtable.AddRow(isCopyFormat: true, autoPopulateCells: true);
                        //STT
                        var text0 = wtrow.Cells[0].AddParagraph().AppendText(stt.ToString());
                        text0.CharacterFormat.FontName = "Times New Roman";
                        text0.CharacterFormat.FontSize = 13;
                        wtrow.Cells[0].LastParagraph.ParagraphFormat.HorizontalAlignment = HorizontalAlignment.Center;
                        wtrow.Cells[0].CellFormat.VerticalAlignment = VerticalAlignment.Middle;
                        //Tên tài liệu
                        var text1 = wtrow.Cells[1].AddParagraph().AppendText(_file.DocNameVn ?? "");
                        wtrow.Cells[1].CellFormat.VerticalAlignment = VerticalAlignment.Middle;
                        text1.CharacterFormat.FontName = "Times New Roman";
                        text1.CharacterFormat.FontSize = 13;
                        //Phiên bản/ngày
                        var text2 = wtrow.Cells[2].AddParagraph().AppendText(_file.VersionAndDate ?? "");
                        wtrow.Cells[2].CellFormat.VerticalAlignment = VerticalAlignment.Middle;
                        text2.CharacterFormat.FontName = "Times New Roman";
                        text2.CharacterFormat.FontSize = 13;
                        stt++;
                    }
                }
                //Lưu vào server và trả về đường dẫn
                string savePath = _hostEnvironment.WebRootPath + "\\open\\" + fileName;
                FileStream outputStream = new FileStream(savePath, FileMode.Create, FileAccess.ReadWrite, FileShare.ReadWrite);
                doc.Save(outputStream, formatType);
                doc.Close();
                outputStream.Flush();
                outputStream.Dispose();
                var result = new JsonResult(new
                {
                    Error = false,
                    Code = 200,
                    Message = "Xuất file thành công",
                    FileInfo = new
                    {
                        name = fileName,
                        type = contentType,
                        path = "/open/" + fileName + "?v=" + DateTime.Now.Ticks,
                    },
                });
                return result;
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    Error = true,
                    Code = 500,
                    Message = ex.Message,
                    InnerException = ex.InnerException?.Message ?? "None",
                });
            }
        }

        #region Helpers
        // Get content type
        private string GetContentType(string path)
        {
            var types = GetMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types[ext];
        }

        // Get mime types
        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
            {
                {".txt", "text/plain"},
                {".pdf", "application/pdf"},
                {".doc", "application/vnd.ms-word"},
                {".docx", "application/vnd.ms-word"},
                {".xls", "application/vnd.ms-excel"},
                {".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
                {".png", "image/png"},
                {".jpg", "image/jpeg"},
                {".jpeg", "image/jpeg"},
                {".gif", "image/gif"},
                {".csv", "text/csv"}
            };
        }
        #endregion Helpers
    }
}