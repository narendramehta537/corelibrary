﻿using System.Net;

namespace CoreLibrary.Globals
{
    public class GlobalConstants
    {
        public static string TwtBaseUrl = "https://twitter.com/i/api/";
        public static string TwtUserIdFromUserName(string username) =>
            $"graphql/hc-pka9A7gyS3xODIafnrQ/UserByScreenName?variables=%7B%22screen_name%22%3A%22{WebUtility.UrlEncode(username)}%22%2C%22withHighlightedLabel%22%3Atrue%7D";
        public static string TwtTweetsFromUserId(string username) =>
            $"2/timeline/profile/{WebUtility.UrlEncode(username)}.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_quote_count=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweet=true&include_tweet_replies=false&count=20&userId={WebUtility.UrlEncode(username)}&ext=mediaStats%2ChighlightedLabel";
        public static string TweetsCursorFromUserId(string username,string cursor) => 
            $"{TwtTweetsFromUserId(username)}&cursor={WebUtility.UrlEncode(cursor)}";
    }
}
