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
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace CoreLibrary.Services.Social
{

    public interface IInstaServices : IBaseInstaServices
    {
        Task<APIResponse> Request(QueryModel queryModel);
        Task<APIResponse> RequestBase(QueryModel queryModel);

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
        public async Task<APIResponse> RequestBase(QueryModel queryModel)
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
                Data = await loginResponse.Content.ReadAsStringAsync()
            };
            return apiResponse;
        }
        private async Task<APIResponse> Post(QueryModel queryModel)
        {
            var content = new StringContent(JsonConvert.SerializeObject(queryModel.Body), Encoding.UTF8, "application/json");
            var loginResponse = await HttpClient.PostAsync(queryModel.Url, content);
            var apiResponse = new APIResponse(loginResponse.StatusCode)
            {
                Data = await loginResponse.Content.ReadAsStringAsync()
            };
            return apiResponse;
        }
        private async Task<APIResponse> PostForm(QueryModel queryModel)
        {
            queryModel.Form.Add("Content-Type", "application/x-www-form-urlencoded");
            var formContent = new FormUrlEncodedContent(queryModel.Form);

            var loginResponse = await HttpClient.PostAsync(queryModel.Url, formContent);
            var apiResponse = new APIResponse(loginResponse.StatusCode)
            {
                Data = await loginResponse.Content.ReadAsStringAsync()
            };
            if (!apiResponse.IsSuccess) apiResponse.SetDisplayError(JsonConvert.DeserializeObject<InstaAPIError>(apiResponse.Data.ToString()).error_message);
            return apiResponse;
        }
        private async Task<APIResponse> Put(QueryModel queryModel)
        {

            var content = new StringContent(JsonConvert.SerializeObject(queryModel.Body), Encoding.UTF8, "application/json");
            var loginResponse = await HttpClient.PutAsync(queryModel.Url, content);
            var apiResponse = new APIResponse(loginResponse.StatusCode)
            {
                Data = await loginResponse.Content.ReadAsStringAsync()
            };
            return apiResponse;
        }
        private async Task<APIResponse> Delete(QueryModel queryModel)
        {
            var loginResponse = await HttpClient.DeleteAsync(queryModel.Url);
            var apiResponse = new APIResponse(loginResponse.StatusCode)
            {
                Data = await loginResponse.Content.ReadAsStringAsync()
            };
            return apiResponse;
        }
    }

    public class InstaAPIError
    {
        public string error_message { get; set; }
    }

    //public class InstaAPIResponse
    //{
    //    public string error_type { get; set; }
    //    public HttpStatusCode code { get; set; }
    //    public string error_message { get; set; }
    //    public string access_token { get; set; }
    //    public string user_id { get; set; }
    //}


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
            HttpClient.DefaultRequestHeaders.UserAgent.ParseAdd(GlobalConstants.UserAgent);
            _contextAccessor = contextAccessor;
            _memoryCache = memoryCache;
        }

        
    }
}
