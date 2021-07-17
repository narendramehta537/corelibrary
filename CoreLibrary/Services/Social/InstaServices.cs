using CoreLibrary.Base.Interfaces;
using CoreLibrary.Globals;
using CoreLibrary.Models;
using CoreLibrary.Utility.Models;
using CoreLibrary.Utility.Services;
using CoreLibrary.Utility.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace CoreLibrary.Services.Social
{

    public interface IInstaServices : IBaseInstaServices
    {
        Task<APIResponse> Request(QueryModel queryModel);

    }
    public class InstaServices : BaseInstaServices, IInstaServices
    {
        public InstaServices(IHttpClientFactory factory, IMemoryCache memoryCache, IHttpContextAccessor contextAccessor)
            : base(factory, memoryCache, contextAccessor)
        {
        }

        public async Task<APIResponse> Request(QueryModel queryModel)
        {
            return queryModel.RequestType switch
            {
               "PUT" => await Put(queryModel),
               "POST" => await Post(queryModel),
               "POSTFORM" => await PostForm(queryModel),
               "DELETE" => await Delete(queryModel),
               "GET" => await Get(queryModel),
                _ => await Get(queryModel),
            };
        }

        private async Task<APIResponse> Get(QueryModel queryModel)
        {
            var loginResponse = await HttpClient.GetAsync(queryModel.Url);
            var apiResponse = new APIResponse(loginResponse.StatusCode)
            {
                Data = loginResponse.Content.ReadAsStringAsync()
            };
            return apiResponse;
        }
        private async Task<APIResponse> Post(QueryModel queryModel)
        {
            var content = new StringContent(JsonConvert.SerializeObject(queryModel.Body), Encoding.UTF8, "application/json");
            var loginResponse = await HttpClient.PostAsync(queryModel.Url, content);
            var apiResponse = new APIResponse(loginResponse.StatusCode)
            {
                Data = loginResponse.Content.ReadAsStringAsync()
            };
            return apiResponse;
        }

        private async Task<APIResponse> PostForm(QueryModel queryModel)
        {
            var keyValues = new List<KeyValuePair<string, string>>();
            keyValues.AddRange(queryModel.Form);
            keyValues.Add(new KeyValuePair<string, string>("Content-Type", "application/x-www-form-urlencoded"));
            var formContent = new FormUrlEncodedContent(keyValues);
           
            var loginResponse = await HttpClient.PostAsync(queryModel.Url, formContent);
            var apiResponse = new APIResponse(loginResponse.StatusCode)
            {
                Data = loginResponse.Content.ReadAsStringAsync()
            };
            return apiResponse;
        }
        private async Task<APIResponse> Put(QueryModel queryModel)
        {

            var content = new StringContent(JsonConvert.SerializeObject(queryModel.Body), Encoding.UTF8, "application/json");
            var loginResponse = await HttpClient.PutAsync(queryModel.Url, content);
            var apiResponse = new APIResponse(loginResponse.StatusCode)
            {
                Data = loginResponse.Content.ReadAsStringAsync()
            };
            return apiResponse;
        }
        private async Task<APIResponse> Delete(QueryModel queryModel)
        {
            var loginResponse = await HttpClient.DeleteAsync(queryModel.Url);
            var apiResponse = new APIResponse(loginResponse.StatusCode)
            {
                Data = loginResponse.Content.ReadAsStringAsync()
            };
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
            //HttpClient.BaseAddress = new Uri(InstaConstants.BaseApiUrl);
            //HttpClient.DefaultRequestHeaders.UserAgent.ParseAdd(GlobalConstants.UserAgent);
            _contextAccessor = contextAccessor;
            _memoryCache = memoryCache;
        }

        protected async Task BaseHeader()
        {

        }
    }
}
