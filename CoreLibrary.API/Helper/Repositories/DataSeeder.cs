using CoreLibrary.API.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreLibrary.API.Helper.Repositories
{
    public interface IDataSeeder<TDataContext>
    {
        Task SeedDataAsync(TDataContext context, IServiceProvider services);
    }

    public class DataSeeder<TDataContext> : BaseService, IDataSeeder<TDataContext>
    {
        public virtual async Task SeedDataAsync(TDataContext context, IServiceProvider services)
        {
            return;
        }
    }
}
