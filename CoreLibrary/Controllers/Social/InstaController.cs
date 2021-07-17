using CoreLibrary.Models;
using Microsoft.AspNetCore.Mvc;
using CoreLibrary.Data;
using CoreLibrary.Services.Social;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace CoreLibrary.Controllers.Social
{
    [Route("api/[controller]")]
    public class InstaController : RootController
    {
        private readonly IInstaServices _instaServices;

        public InstaController(DataContext dataContext, IHttpContextAccessor contextAccessor, IInstaServices instaServices)
            : base(dataContext, contextAccessor, instaServices)
        {
            _instaServices = instaServices;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> HttpRequest([FromBody] QueryModel queryModel)
        {
            return (await _instaServices.Request(queryModel)).ResponseResult();
        }
    }
}
