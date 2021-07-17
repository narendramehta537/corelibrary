using CoreLibrary.Base.Interfaces;
using CoreLibrary.Globals;
using CoreLibrary.Models;
using CoreLibrary.Utility.Models;
using CoreLibrary.Utility.Services;
using CoreLibrary.Utility.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace CoreLibrary.Services.Social
{
    public interface IInstaServices : IBaseInstaServices
    {
        Task<APIResponse> Posts(SocialQueryModel queryModel);
    }
    public class InstaServices : BaseInstaServices, IInstaServices
    {
        public InstaServices(IHttpClientFactory factory, IMemoryCache memoryCache, IHttpContextAccessor contextAccessor)
            : base(factory, memoryCache, contextAccessor)
        {
        }

        public async Task<APIResponse> Posts(SocialQueryModel queryModel)
        {
            await BaseHeader();
            var apiResponse = new APIResponse();
            var userId = "";
            var url = GlobalConstants.TwtUserIdFromUserName(queryModel.UserName);
            var resp = await HttpClient.GetAsync(url);
            var content = await resp.Content.ReadAsStringAsync();
            if (!resp.IsSuccessStatusCode || string.IsNullOrWhiteSpace(userId = JsonUtility.Value(content, "data", "user", "rest_id")))
                return apiResponse.ReturnDisplayErrors(new List<string> { "Invalid username." });

            var tweets = queryModel.Cursor == null ? await HttpClient.GetAsync(GlobalConstants.TwtTweetsFromUserId(userId))
                : await HttpClient.GetAsync(GlobalConstants.TweetsCursorFromUserId(userId, queryModel.Cursor));
            apiResponse.Data = await tweets.Content.ReadAsStringAsync();
            return apiResponse;
        }
    }
   

    public interface IBaseInstaServices : IHttpClientServices
    {

    }
    public class BaseInstaServices : BaseHttpServices, IBaseTwtServices
    {
        private readonly IMemoryCache _memoryCache;
        private readonly IHttpContextAccessor _contextAccessor;

        public BaseInstaServices(IHttpClientFactory factory, IMemoryCache memoryCache, IHttpContextAccessor contextAccessor) : base(factory)
        {
            HttpClient.BaseAddress = new Uri(GlobalConstants.InstaBaseApiUrl);
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
                var authUrl = GlobalConstants.InstaAuth("1215772298875241", "https://localhost:4200/oauth", "user_profile,user_media", "1");
                var msh = await Get<string>(authUrl);
            }
            else
            {
                var authUrl = GlobalConstants.InstaAuth("1215772298875241", "https://localhost:4200/oauth", "user_profile,user_media", "1");
                var msh = await Get<string>(authUrl);

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
