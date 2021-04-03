using System.Collections.Generic;

namespace CoreLibrary.Base.Models
{
    public class Validation
    {
        public bool IsValid { get; set; }
        public IEnumerable<string> ValidationResults { get; set; }
    }
}
