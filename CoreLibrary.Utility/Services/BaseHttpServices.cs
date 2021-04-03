using CoreLibrary.Base.Interfaces;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace CoreLibrary.Utility.Services
{
    public class BaseHttpServices : IHttpClientServices
    {
        public HttpClient HttpClient { get; set; }
        public BaseHttpServices(IHttpClientFactory factory)
        {
            HttpClient = factory.CreateClient();
        }
     
    }
}
