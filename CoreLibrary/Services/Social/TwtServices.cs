using CoreLibrary.Globals;
using CoreLibrary.Utility.Extensions;
using CoreLibrary.Utility.Models;
using CoreLibrary.Utility.Utilities;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace CoreLibrary.Services.Social
{
    public interface ITwtServices : IBaseTwtServices
    {
        Task<APIResponse> Tweets(string username, string cursor = null);
    }
    public class TwtServices : BaseTwtServices, ITwtServices
    {
        public TwtServices(IHttpClientFactory factory) : base(factory)
        {
        }

        public async Task<APIResponse> Tweets(string username, string cursor = null)
        {
            var apiResponse = new APIResponse();
            var userId = "";
            var resp = await HttpClient.GetAsync(GlobalConstants.TwtUserIdFromUserName(username));
            if (!resp.IsSuccessStatusCode || string.IsNullOrWhiteSpace(userId = JsonUtility.Value(await resp.Content.ReadAsStringAsync(), "data", "user", "rest_id")))
                return apiResponse.ReturnDisplayErrors(new List<string> { "Invalid username." });

            var tweets = cursor == null ? await HttpClient.GetAsync(GlobalConstants.TwtTweetsFromUserId(userId))
                : await HttpClient.GetAsync(GlobalConstants.TweetsCursorFromUserId(userId, cursor));
            apiResponse.Data = tweets.Content.ReadAsStringAsync();

            return apiResponse;
        }
    }
}
