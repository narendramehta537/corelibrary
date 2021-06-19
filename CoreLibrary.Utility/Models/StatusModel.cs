using CoreLibrary.Base.Constants;
using System;
using System.Collections.Generic;
using System.Text;

namespace CoreLibrary.Utility.Models
{
    public class StatusModel
    {
        public StatusModel(string errorMessage = null)
        {
            ErrorMessage = errorMessage;
            Status = string.IsNullOrWhiteSpace(errorMessage) ? GlobalConstantsBase.Success : GlobalConstantsBase.Failed;
        }
        public string Status { get; set; }
        public string ErrorMessage { get; set; }
    }
}
