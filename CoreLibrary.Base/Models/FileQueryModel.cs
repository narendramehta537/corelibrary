using CoreLibrary.Base.Constants;

namespace CoreLibrary.Base.Models
{
    public class FileQueryModel
    {
        public string Url { get; set; }
        public string FileName { get; set; }

        public string FolderName { get; set; }
        public FileType FileType { get; set; }

    }
}
