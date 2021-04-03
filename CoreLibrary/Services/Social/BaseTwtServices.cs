using CoreLibrary.Base.Interfaces;
using CoreLibrary.Utility.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace CoreLibrary.Services.Social
{
    public interface IBaseTwtServices : IHttpClientServices
    {

    }
    public class BaseTwtServices : BaseHttpServices, IBaseTwtServices
    {
        public BaseTwtServices(IHttpClientFactory factory) : base(factory)
        {
            HttpClient.BaseAddress = new Uri(Globals.GlobalConstants.TwtBaseUrl);
            BaseHeader();
        }

        protected void BaseHeader()
        {
            if (HttpClient.DefaultRequestHeaders.Authorization == null)
            {
                var token = "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";
                HttpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            }
            HttpClient.DefaultRequestHeaders.Add("x-csrf-token", "696b75a6ad8fa424e34a848e5a1f6417");
            HttpClient.DefaultRequestHeaders.Add("x-guest-token", "1378232878832656389");
        }
    }
}
