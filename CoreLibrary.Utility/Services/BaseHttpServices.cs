using CoreLibrary.Base.Interfaces;
using CoreLibrary.Utility.Helper;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace CoreLibrary.Utility.Services
{
    public class BaseHttpServices : IHttpClientServices
    {
        public HttpClient HttpClient { get; set; }
        public CookieContainer Cookies { get; set; } = new CookieContainer();
        public BaseHttpServices(IHttpClientFactory factory)
        {
            HttpClient = factory.CreateClient();
        }

        public Task<HttpResponseMessage> Get<T>(string url, T queryModel = null, Dictionary<string, string> cookies = null) where T : class
        {
            if (queryModel != null) url += StringUtility.ToQueryString(queryModel);
            var message = new HttpRequestMessage(HttpMethod.Get, url);
            SetCookie(message, cookies);
            return HttpClient.SendAsync(message);
        }

        

        public Task<HttpResponseMessage> Post<T>(string url, T model, Dictionary<string, string> cookies = null) where T : class
        {
            var content = new StringContent(JsonConvert.SerializeObject(model), Encoding.UTF8, "application/json");
            return Post(url, content, cookies);
        }

        public Task<HttpResponseMessage> Post(string url, string payload, Dictionary<string, string> cookies = null)
        {
            var content = new StringContent(payload, Encoding.UTF8, "application/json");
            var message = new HttpRequestMessage(HttpMethod.Post, url) { Content = content };
            SetCookie(message, cookies);
            return HttpClient.SendAsync(message);
        }

        public Task<HttpResponseMessage> Put<T>(string url, T model, Dictionary<string, string> cookies = null) where T : class
        {
            var content = new StringContent(JsonConvert.SerializeObject(model), Encoding.UTF8, "application/json");
            return Put(url, content, cookies);
        }

        public Task<HttpResponseMessage> Put(string url, string payload, Dictionary<string, string> cookies = null)
        {
            var content = new StringContent(payload, Encoding.UTF8, "application/json");
            var message = new HttpRequestMessage(HttpMethod.Put, url) { Content = content };
            SetCookie(message, cookies);
            return HttpClient.SendAsync(message);
        }

        public Task<HttpResponseMessage> Delete<T>(string url, T queryModel = null, Dictionary<string, string> cookies = null) where T : class
        {
            if (queryModel != null) url += StringUtility.ToQueryString(queryModel);
            var message = new HttpRequestMessage(HttpMethod.Delete, url);
            SetCookie(message, cookies);
            return HttpClient.SendAsync(message);
        }
        void SetCookie(HttpRequestMessage message, Dictionary<string, string> cookies)
        {
            var cookie = new StringBuilder();
            cookies?.AsParallel().ForAll((p) => cookie.Append($"{p.Key}={p.Value}; "));
            message.Headers.Add("Cookie", cookie.ToString().TrimEnd(';', ' '));
        }

       
    }
}
