using CoreLibrary.API.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;

namespace CoreLibrary.API.Extensions
{
    public static class WebHostExtension
    {
        public static IHost InitialiseDataContext<TDataContext>(this IHost webHost) where TDataContext : IDataContext
        {
            using (var scope = webHost.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var logger = services.GetRequiredService<ILogger<TDataContext>>();
                var context = services.GetService<TDataContext>();
                try
                {
                    logger.LogInformation("Migrating database associated with context {DbContextName}", typeof(TDataContext).Name);

                    try
                    {
                        context.Migrate(services);
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, "An error occurred while migrating the database used on context {DbContextName}", typeof(TDataContext).Name);
                    }

                    //if (seeder != null)
                    //{
                    //    seeder.SeedDataAsync(context, services);
                    //}

                    logger.LogInformation("Migrated database associated with context {DbContextName}", typeof(TDataContext).Name);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred while migrating the database used on context {DbContextName}", typeof(TDataContext).Name);
                }
            }
            return webHost;
        }
    }
}