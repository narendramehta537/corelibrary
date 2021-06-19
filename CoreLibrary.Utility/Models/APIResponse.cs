using CoreLibrary.Base.Models;
using CoreLibrary.Utility.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text.RegularExpressions;


namespace CoreLibrary.Utility.Models
{
    public class APIResponse
    {
        public Error Error { get; set; }
        public Object Data { get; set; }

        public HttpStatusCode StatusCode { get; set; } = HttpStatusCode.OK;
        public bool IsSuccess => (int)StatusCode >= 200 && (int)StatusCode <= 299;

        public APIResponse ReturnSuccess(Object data)
        {
            Data = data;
            return this;
        }
        public APIResponse()
        {
        }
        public APIResponse(HttpStatusCode httpStatusCode)
        {
            StatusCode = httpStatusCode;
        }

        public APIResponse ReturnDisplayError(string DisplayError, string ConsoleError = null)
        {
            SetDisplayError(DisplayError, ConsoleError);
            return this;
        }

        public APIResponse ReturnDisplayErrors(IEnumerable<string> displayErrors, IEnumerable<string> ConsoleError = null)
        {
            SetDisplayError(JsonConvert.SerializeObject(displayErrors), JsonConvert.SerializeObject(ConsoleError));
            return this;
        }

        public APIResponse ReturnConsoleError(string ConsoleError, string DisplayError = "Something went wrong!")
        {
            SetConsoleError(ConsoleError, DisplayError);
            return this;
        }

        public APIResponse ReturnException(Exception e, string DisplayError = "Something went wrong!")
        {
            SetException(e, DisplayError);
            return this;
        }

        public void SetDisplayError(string DisplayError, string ConsoleError = null)
        {
            InitializeErr();
            Error.DisplayError = DisplayError;
            if (ConsoleError == null)
                ConsoleError = DisplayError;
            Error.ConsoleError = ConsoleError;
        }

        public void SetConsoleError(string ConsoleError, string DisplayError = "Something went wrong!")
        {
            InitializeErr();
            Error.DisplayError = DisplayError;
            Error.ConsoleError = ConsoleError;
        }

        public void SetException(Exception e, string DisplayError = "Something went wrong!")
        {
            InitializeErr();
            Error.DisplayError = DisplayError;
            StatusCode = HttpStatusCode.BadRequest;
            var message = e.InnerException?.InnerException?.Message ?? e.InnerException?.Message;//REFERENCE
            if (message != null && (message.Contains("REFERENCE")))
            {
                message = $"This record cannot be deleted as it is referred in other masters, please delete dependent master records and try again.";
                StatusCode = HttpStatusCode.Conflict;
                Error.DisplayError = message;
                Error.DisplayError = message;
            }
            else if (message != null && message.Contains("INSERT"))
            {
                message = $"check if the reffered master record exists.";
                StatusCode = HttpStatusCode.Conflict;
                Error.DisplayError = message;
                Error.DisplayError = message;
            }
            else if (message != null && message.Contains("duplicate key"))
            {
                var table = GetTableName(message);
                var data = Regex.Replace(message.GetBetween("The duplicate key value is ", "."), "[()]", "");
                var propertyName = Regex.Replace(message.GetBetween($"{table}_", "'"), @"(\B[A-Z])", @" $1");

                message = $"{propertyName} should be unique. This {propertyName} \"{data}\" is already exists in database.";
                StatusCode = HttpStatusCode.Conflict;
                Error.DisplayError = message;
                Error.DisplayError = message;
            }
            else
            {
                message = message ?? e.Message;
                StatusCode = HttpStatusCode.InternalServerError;
                Error.DisplayError = message;
                Error.DisplayError = message;
            }
        }

        private static string GetTableName(string message)
        {
            var table = message.GetBetween("dbo.", "\"");
            if (string.IsNullOrWhiteSpace(table))
                table = message.GetBetween("dbo.", "\'");
            return table;
        }


        public void SetException(DbUpdateException e, string DisplayError = "Something went wrong!")
        {
            InitializeErr();
            Error.DisplayError = DisplayError;
            Error.ConsoleError = e.InnerException?.InnerException?.Message;
        }

        public IActionResult ResponseResult()
        {
            if (IsSuccess) return new OkObjectResult(this);
            else return new BadRequestObjectResult(Error);
        }

        private void InitializeErr()
        {
            if (Error == null)
            {
                StatusCode = HttpStatusCode.InternalServerError;
                Error = new Error();
            }
        }

    }

}
