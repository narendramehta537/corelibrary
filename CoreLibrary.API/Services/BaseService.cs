using Microsoft.Extensions.Logging;

namespace CoreLibrary.API.Services
{
    public abstract class BaseService
    {
        //public ExceptionManager ExceptionManager { get; set; }
        public ILogger Logger { get; set; }

        public BaseService()
        {
            var LoggerType = typeof(ILogger<>).MakeGenericType(this.GetType());

            //ExceptionManager = ServiceDiscovery.GetService<ExceptionManager>();
            //Logger = ServiceDiscovery.GetService(LoggerType) as ILogger;

        }
    }

    public abstract class BaseHttpClientService : BaseService
    {

    }
}
