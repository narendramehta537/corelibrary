using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CoreLibrary.Utility.Extensions
{
    public static class HttpExtensions
    {

        public static async Task<T> ReadAsAsync<T>(this HttpContent content) =>
            JsonConvert.DeserializeObject<T>(await content.ReadAsStringAsync());

        //NOTE : not working at debugging time
        //public static async Task<HttpResponseMessage> PostAsync<T>(this HttpClient client, string url, T model)
        //{
        //    var serialized = JsonConvert.SerializeObject(model);
        //    return await client.PostAsync(url, new StringContent(JsonConvert.SerializeObject(serialized), Encoding.UTF8, "application/json"));
        //}

        public static async Task<HttpResponseMessage> HttpPostAsync<T>(HttpClient client, string url, T model)
        {
            string serialize = JsonConvert.SerializeObject(model);
            return await client.PostAsync(url, new StringContent(serialize, Encoding.UTF8, "application/json"));
        }
        public static async Task<HttpResponseMessage> HttpPostAsync(HttpClient client, string url, string serialize)
        {
            return await client.PostAsync(url, new StringContent(serialize, Encoding.UTF8, "application/json"));
        }
        public static async Task<HttpResponseMessage> HttpPostAsync(HttpClient client, string url, string serialize, CancellationToken cancellationToken)
        {
            return await client.PostAsync(url, new StringContent(serialize, Encoding.UTF8, "application/json"), cancellationToken);
        }
    }
}
