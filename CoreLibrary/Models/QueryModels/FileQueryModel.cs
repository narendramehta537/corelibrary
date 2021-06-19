using CoreLibrary.Base.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreLibrary.Models.QueryModels
{
    public class FileQueryModel
    {
        public string FolderName { get; set; }
        public FileType FileType { get; set; }
    }
}
