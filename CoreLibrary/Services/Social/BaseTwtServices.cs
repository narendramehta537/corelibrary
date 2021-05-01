using CoreLibrary.Base.Interfaces;
using CoreLibrary.Globals;
using CoreLibrary.Models;
using CoreLibrary.Utility.Services;
using CoreLibrary.Utility.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace CoreLibrary.Services.Social
{
    public interface IBaseTwtServices : IHttpClientServices
    {

    }
    public class BaseTwtServices : BaseHttpServices, IBaseTwtServices
    {
        private readonly IMemoryCache _memoryCache;
        private readonly IHttpContextAccessor _contextAccessor;

        public BaseTwtServices(IHttpClientFactory factory, IMemoryCache memoryCache, IHttpContextAccessor contextAccessor) : base(factory)
        {
            HttpClient.BaseAddress = new Uri(GlobalConstants.TwtBaseApiUrl);
            HttpClient.DefaultRequestHeaders.UserAgent.ParseAdd(GlobalConstants.UserAgent);
            _contextAccessor = contextAccessor;
            _memoryCache = memoryCache;
        }

        protected async Task BaseHeader()
        {
            var key = _contextAccessor.HttpContext.User.Identity.Name;
            var token = "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";
            if (_memoryCache.TryGetValue(key, out SocialCacheModel sc))
            {
                var msh = await Get<string>(GlobalConstants.TwtGuestActivateUrl);
            }
            else
            {
                sc = new SocialCacheModel();
                var firstHit = await Get<string>("");
                sc.Cookie = Newtonsoft.Json.JsonConvert.SerializeObject(firstHit.Headers.GetValues("Set-Cookie"));
                HttpClient.DefaultRequestHeaders.Add("sec-ch-ua-mobile", "?0");
                if (HttpClient.DefaultRequestHeaders.Authorization == null)
                    HttpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

                var activateResponse = await Post(GlobalConstants.TwtGuestActivateUrl, "");

                sc.GuestToken = JsonUtility.Value(await activateResponse.Content.ReadAsStringAsync(), "guest_token");
                HttpClient.DefaultRequestHeaders.Remove("sec-ch-ua-mobile");
                _memoryCache.Set(key, sc);
            }
            var cookieContainer = new System.Net.CookieContainer();

            if (HttpClient.DefaultRequestHeaders.Authorization == null)
            {
                HttpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            }

            HttpClient.DefaultRequestHeaders.Add("x-guest-token", sc.GuestToken);



        }
    }
}
