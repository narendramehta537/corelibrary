using CoreLibrary.Globals;
using CoreLibrary.Models;
using CoreLibrary.Utility.Extensions;
using CoreLibrary.Utility.Models;
using CoreLibrary.Utility.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace CoreLibrary.Services.Social
{
    public interface ITwtServices : IBaseTwtServices
    {
        Task<APIResponse> Tweets(SocialQueryModel queryModel);
    }
    public class TwtServices : BaseTwtServices, ITwtServices
    {
        public TwtServices(IHttpClientFactory factory, IMemoryCache memoryCache,IHttpContextAccessor contextAccessor)
            : base(factory, memoryCache,contextAccessor)
        {
        }

        public async Task<APIResponse> Tweets(SocialQueryModel queryModel)
        {
            await BaseHeader();
            var apiResponse = new APIResponse();
            var userId = "";
            var url = GlobalConstants.TwtUserIdFromUserName(queryModel.UserName);
            var resp = await HttpClient.GetAsync(url);
            var content = await resp.Content.ReadAsStringAsync();
            if (!resp.IsSuccessStatusCode || string.IsNullOrWhiteSpace(userId = JsonUtility.Value(content, "data", "user", "rest_id")))
                return apiResponse.ReturnDisplayErrors(new List<string> { "Invalid username." });

            var tweets = queryModel.Cursor == null ? await HttpClient.GetAsync(GlobalConstants.TwtTweetsFromUserId(userId))
                : await HttpClient.GetAsync(GlobalConstants.TweetsCursorFromUserId(userId, queryModel.Cursor));
            apiResponse.Data = await tweets.Content.ReadAsStringAsync();
            return apiResponse;
        }
    }
}
