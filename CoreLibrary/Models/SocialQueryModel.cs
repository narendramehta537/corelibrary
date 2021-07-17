using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CoreLibrary.Models
{
    public class SocialQueryModel
    {
        public string UserName { get; set; }
        public string? Cursor { get; set; }
    }

    public class SocialCacheModel
    {
        public SocialCacheModel()
        {

        }
        public SocialCacheModel(string cookie, string gt)
        {
            Cookie = cookie;
            GuestToken = gt;
        }

        public string Cookie { get; set; }
        public string GuestToken { get; set; }
    }

    public class QueryModel
    {
        //[Newtonsoft.Json.JsonConverter(typeof(JsonStringEnumConverter))]
        //public RequestType RequestType { get; set; } = RequestType.GET;
        public string RequestType { get; set; } = "GET";
        public string Url { get; set; }
        public object Body { get; set; }
        public Dictionary<string, string> Form { get; set; }

    }

    public enum RequestType
    {
        GET, PUT, POSTFORM, POST, DELETE
    }




}
