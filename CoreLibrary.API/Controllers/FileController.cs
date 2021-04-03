using CoreLibrary.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreLibrary.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IFileServices _fileServices;
        public FileController(IFileServices fileServices)
        {
            _fileServices = fileServices;

        }
        [HttpGet("[action]/{url}/{fileName}")]
        public Task<FileResult> DownloadFile(string url,string? fileName)
        {
            return _fileServices.DownloadFile(url, fileName);
        }
    }
}
