using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace CoreLibrary.Base.Interfaces
{
    public interface IServices
    {

    }

    public interface IHttpClientServices : IServices
    {
        HttpClient HttpClient { get; set; }
        CookieContainer Cookies { get; set; }
        Task<HttpResponseMessage> Get<T>(string url, T queryModel = null, Dictionary<string, string> cookies = null) where T : class;
        Task<HttpResponseMessage> Post<T>(string url, T model, Dictionary<string, string> cookies = null) where T : class;
        Task<HttpResponseMessage> Post(string url, string payload, Dictionary<string, string> cookies = null);
        Task<HttpResponseMessage> Put<T>(string url, T model, Dictionary<string, string> cookies = null) where T : class;
        Task<HttpResponseMessage> Put(string url, string payload, Dictionary<string, string> cookies = null);
        Task<HttpResponseMessage> Delete<T>(string url, T queryModel = null, Dictionary<string, string> cookies = null) where T : class;
    }
}
