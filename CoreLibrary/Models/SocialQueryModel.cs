namespace CoreLibrary.Models
{
    public class SocialQueryModel
    {
        public string UserName { get; set; }
        public string? Cursor { get; set; }
    }

    public class SocialCacheModel
    {
        public SocialCacheModel()
        {

        }
        public SocialCacheModel(string cookie, string gt)
        {
            Cookie = cookie;
            GuestToken = gt;
        }

        public string Cookie { get; set; }
        public string GuestToken { get; set; }
    }

}
