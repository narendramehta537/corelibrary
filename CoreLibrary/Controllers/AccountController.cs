using CoreLibrary.Data;
using CoreLibrary.Data.Entity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CoreLibrary.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public AccountController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        // GET: api/<AccountController>
        [HttpGet]
        public async Task<IEnumerable<UserDetails>> Get()
        {
            return await _dataContext.GetAllAsync<UserDetails>(a => true);
        }

        // GET api/<AccountController>/5
        [HttpGet("{id}")]
        public async Task<UserDetails> Get(Guid id)
        {
            
            return (await _dataContext.GetAllAsync<UserDetails>(a => a.Id == id)).First();
        }

        // POST api/<AccountController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<AccountController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<AccountController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}