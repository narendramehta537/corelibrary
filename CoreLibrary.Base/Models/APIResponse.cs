using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CoreLibrary.Base.Models
{
   
    public class Error
    {
        public string DisplayError { get; set; }
        public string ConsoleError { get; set; }
    }
}
