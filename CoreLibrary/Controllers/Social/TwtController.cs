﻿using CoreLibrary.Data;
using CoreLibrary.Services.Social;
using CoreLibrary.Utility.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CoreLibrary.Controllers.Social
{
    [Route("api/[controller]")]
    public class TwtController : RootController
    {
        private readonly ITwtServices _twtServices;

        public TwtController(DataContext dataContext, IHttpContextAccessor contextAccessor, ITwtServices twtServices)
            : base(dataContext, contextAccessor, twtServices)
        {
            _twtServices = twtServices;
        }

        [HttpGet("{username}/{cursor}")]
        public async Task<IActionResult> Tweets(string username, string cursor)
        {
            return (await _twtServices.Tweets(username, cursor)).finalResponse();
        }
    }
}