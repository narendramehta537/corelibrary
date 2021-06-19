using AutoFixture;
using AutoFixture.AutoMoq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CoreLibrary.Utility.Helper
{
    public static class StringUtility
    {
        public static DateTime getCurretDateTime()
        {
            return DateTime.Now;
        }
        // var demo = JsonConvert.SerializeObject(Helper.ApssplUtility.RandomData<LanguageModel>()); 
        public static T RandomData<T>()
        {
            var fixture = new Fixture().Customize(new AutoMoqCustomization());
            return fixture.Create<T>();
        }

        public static long TimeStamp(DateTime? dateTime = null)
        {
            if (!dateTime.HasValue) dateTime = DateTime.UtcNow;
            return (long)dateTime.Value.Subtract(new DateTime(1970, 1, 1)).TotalMilliseconds;
        }

        public static int TimeStampInt(DateTime? dateTime = null)
        {
            if (!dateTime.HasValue) dateTime = DateTime.UtcNow;
            return (int)(long)dateTime.Value.Subtract(new DateTime(1970, 1, 1)).TotalMilliseconds;
        }
        public static long TimeStampTicks(DateTime? dateTime = null)
        {
            if (!dateTime.HasValue) dateTime = DateTime.UtcNow;
            return dateTime.Value.Subtract(new DateTime(1970, 1, 1)).Ticks;
        }
        //public static Guid TimeStampGuid(DateTime? dateTime = null)
        //{
        //    if (!dateTime.HasValue) dateTime = DateTime.UtcNow;
        //    return FluentCassandra.GuidGenerator.GenerateTimeBasedGuid(dateTime.Value);
        //}

        //public static long GuidToTimeStamp(Guid guid) =>
        //    TimeStamp(FluentCassandra.GuidGenerator.GetDateTime(guid));
        //public static long GuidToTimeStampTicks(Guid guid) =>
        //    TimeStampTicks(FluentCassandra.GuidGenerator.GetDateTime(guid));

        public static string GetBetween(this string input, string before, string after)
        {
            var beforeStartIndex = input.IndexOf(before);
            var startIndex = beforeStartIndex + before.Length;
            var afterStartIndex = input.IndexOf(after, startIndex);

            if (beforeStartIndex == -1 || afterStartIndex == -1)
                return "";

            return input.Substring(startIndex, afterStartIndex - startIndex);
        }



        public static List<T> DeepClone<T>(List<T> list) where T : class
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<List<T>>(Newtonsoft.Json.JsonConvert.SerializeObject(list));
        }
        public static T DeepClone<T>(T obj) where T : class
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<T>(Newtonsoft.Json.JsonConvert.SerializeObject(obj));
        }
        public static string GetFileExtension(string fileName)
        {
            if (fileName.Contains("."))
                return fileName.Substring(fileName.LastIndexOf('.'));
            return "";
        }

        public static string ToQueryString<T>(T obj) where T :class
        {
            if (obj == null) return "";

            return "?" + string.Join("&", obj.GetType()
                                       .GetProperties()
                                       .Where(p => Attribute.IsDefined(p, typeof(DataMemberAttribute)) && p.GetValue(obj, null) != null)
                                       .Select(p => $"{p.Name}={Uri.EscapeDataString(p.GetValue(obj).ToString())}"));
        }

    }
}
