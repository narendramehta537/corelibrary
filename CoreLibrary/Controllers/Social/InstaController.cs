using CoreLibrary.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using CoreLibrary.Data;
using CoreLibrary.Models;
using CoreLibrary.Services.Social;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CoreLibrary.Controllers.Social
{
    [Route("api/[controller]")]
    public class InstaController:RootController
    {
        private readonly ITwtServices _twtServices;

        public InstaController(DataContext dataContext, IHttpContextAccessor contextAccessor, ITwtServices twtServices)
            : base(dataContext, contextAccessor, twtServices)
        {
            _twtServices = twtServices;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> Tweets([FromQuery] SocialQueryModel queryModel)
        {
            return (await _twtServices.Tweets(queryModel)).ResponseResult();
        }
    }
}
