using CoreLibrary.Base.Interfaces;
using CoreLibrary.Utility.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace CoreLibrary.API.Services
{
    public interface IFileServices : IHttpClientServices
    {
        Task<FileResult> DownloadFile(string url, string fileName);
    }

    public class FileServices : BaseHttpServices, IFileServices
    {

        public FileServices(IHttpClientFactory factory) : base(factory)
        {
            HttpClient = factory.CreateClient();
        }

        public async Task<FileResult> DownloadFile(string url, string fileName)
        {
            if (string.IsNullOrWhiteSpace(url) || !url.StartsWith("http"))
                throw new Exception("Invalid Url");

            string ext = url.Substring(url.LastIndexOf('.') + 1);
            fileName = string.IsNullOrWhiteSpace(fileName) ? url.Substring(url.LastIndexOf('/') + 1) : $"{fileName}.{ext}";
           
            var response = await HttpClient.GetAsync(new Uri(url));
            var result = new FileContentResult(await response.Content.ReadAsByteArrayAsync(), "application/xlsx")
            {
                FileDownloadName = $"{fileName}"
            };

            return result;
        }
    }
}
