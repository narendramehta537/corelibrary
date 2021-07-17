using System.Net;

namespace CoreLibrary.Globals
{
    public class GlobalConstants
    {

        public const string TwtBaseUrl = "https://twitter.com/";
        public const string TwtBaseApiUrl = "https://twitter.com/i/api/";
        public const string TwtGuestActivateUrl = "https://api.twitter.com/1.1/guest/activate.json";
        public const string UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36";
        public static string TwtUserIdFromUserName(string username) =>
            $"graphql/hc-pka9A7gyS3xODIafnrQ/UserByScreenName?variables=%7B%22screen_name%22%3A%22{WebUtility.UrlEncode(username)}%22%2C%22withHighlightedLabel%22%3Atrue%7D";
        public static string TwtTweetsFromUserId(string username) =>
            $"2/timeline/profile/{WebUtility.UrlEncode(username)}.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_quote_count=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweet=true&include_tweet_replies=false&count=20&userId={WebUtility.UrlEncode(username)}&ext=mediaStats%2ChighlightedLabel";
        public static string TweetsCursorFromUserId(string username, string cursor) =>
            $"{TwtTweetsFromUserId(username)}&cursor={WebUtility.UrlEncode(cursor)}";

        //https://developers.facebook.com/docs/instagram-basic-display-api/guides/getting-access-tokens-and-permissions/
        public const string InstaBaseApiUrl = "https://api.instagram.com/";

        public static string InstaAuth(string clientId, string redirectUri, string scope, string state)
            => @$"oauth/authorize?client_id={clientId}&redirect_uri={redirectUri}&scope={scope}&response_type=code&state={state}";

    }
}
