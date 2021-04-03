using CoreLibrary.Base.Interfaces;
using CoreLibrary.Base.Models;
using CoreLibrary.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace CoreLibrary.Controllers
{
    [ApiController]
    public class RootController : ControllerBase
    {
        protected readonly DataContext _dataContext;
        protected readonly IHttpContextAccessor ContextAccessor;

        public RootController(DataContext dataContext, IHttpContextAccessor contextAccessor, IServices services)
        {
            _dataContext = dataContext;
            ContextAccessor = contextAccessor;
        }

        public Validation ValidateModel<T>(T model)
        {
            var context = new System.ComponentModel.DataAnnotations.ValidationContext(model, null);
            var result = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(model, context, result, true);
            return new Validation() { IsValid = isValid, ValidationResults = result.Select(x => $"{x.ErrorMessage} in {x.MemberNames.FirstOrDefault()}") };
        }
    }
}
