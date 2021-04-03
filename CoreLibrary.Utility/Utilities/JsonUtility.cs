using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;

namespace CoreLibrary.Utility.Utilities
{
    public class JsonUtility
    {
        public static string Value(string json, params object[] path)
        {
            var jObj = JObject.Parse(json);
            return Value(jObj, path);
        }
        public static string Value(JObject jObj, params object[] path)
        {
            var index = 0;
            JToken jToken;
            do
            {
                jToken = jObj[path[index]];
            } while (jToken != null && ++index != path.Length);

            return jToken == null ? "" : jToken.ToString();
        }
    }
}
