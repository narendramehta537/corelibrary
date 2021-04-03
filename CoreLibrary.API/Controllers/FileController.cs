using CoreLibrary.API.Services;
using CoreLibrary.Base.Models;
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
        [HttpGet("[action]")]
        public Task<FileResult> DownloadFile([FromQuery] FileQueryModel queryModel)
        {
            return _fileServices.DownloadFile(queryModel.Url, queryModel.FileName);
        }
    }
}
