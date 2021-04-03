using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace CoreLibrary.Utility.Utilities
{
    //NOTE: ideally we should have to use GMT timestamp
    public static class TimeUtility
    {
        public static int ISTTimeStamp(this DateTime dateTime)
            => (int)Convert.ToDateTime(dateTime, CultureInfo.GetCultureInfo("hi-IN").DateTimeFormat)
                  .Subtract(new DateTime(1970, 1, 1)).TotalSeconds;

        public static int TimeStamp(this string fromDate)
            => (int)Convert.ToDateTime(fromDate, CultureInfo.GetCultureInfo("hi-IN").DateTimeFormat)
                .Subtract(new DateTime(1970, 1, 1)).TotalSeconds;

        public static DateTime ISTDateTime(this long TimeStamp)
        {
            var TimeZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
            var time = DateTimeOffset.FromUnixTimeSeconds(TimeStamp).UtcDateTime;
            return TimeZoneInfo.ConvertTimeFromUtc(time, TimeZone);
        }
        public static string TSToISTDDMMYYYY(this long TimeStamp)
            => ISTDateTime(TimeStamp).ToString("dd'/'MM'/'yyyy");

        public static string TSToISTDDMMYYYYHHMM(this long TimeStamp)
            => ISTDateTime(TimeStamp).ToString("dd'/'MM'/'yyyy HH:mm");

        public static string TSToDDMMYYYY(this long TimeStamp)
            => TSToDateTime(TimeStamp).ToString("dd'/'MM'/'yyyy");
        public static string TSToDDMMYYYYHHMM(this long TimeStamp)
            => TSToDateTime(TimeStamp).ToString("dd'/'MM'/'yyyy HH:mm");
        public static string DateTimeToISTDDMMYYYYHHMMSS(this DateTime unixDateTime)
            => UnixDateTimeToIST(unixDateTime).ToString("dd'/'MM'/'yyyy HH:mm:ss");
        public static string DateTimeToISTDDMMMYYYYHHMMSS(this DateTime unixDateTime)
            => UnixDateTimeToIST(unixDateTime).ToString("dd'/'MMM'/'yyyy HH:mm:ss");
        public static string DateTimeToDDMMYYYYHHMMSS(this DateTime unixDateTime)
           => unixDateTime.ToString("dd'/'MM'/'yyyy HH:mm:ss");
        public static string DateTimeToDDMMMYYYYHHMMSS(this DateTime unixDateTime)
            => unixDateTime.ToString("dd'/'MMM'/'yyyy HH:mm:ss");

        public static DateTime TSToDateTime(this long TimeStamp)
            => DateTimeOffset.FromUnixTimeSeconds(TimeStamp).UtcDateTime;
        public static DateTime CurrentIST()
            => UnixDateTimeToIST(DateTime.UtcNow);

        public static DateTime UnixDateTimeToIST(this DateTime unixDateTime)
        {
            var TimeZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
            return TimeZoneInfo.ConvertTimeFromUtc(unixDateTime, TimeZone);
        }
    }
}
