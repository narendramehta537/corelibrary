using System.Net.Http;

namespace CoreLibrary.Base.Interfaces
{
    public interface IServices
    {
        
    }

    public interface IHttpClientServices : IServices
    {
         HttpClient HttpClient { get; set; }
    }
}
