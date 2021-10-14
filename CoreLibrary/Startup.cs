using CoreLibrary.API.Extensions.Startup;
using CoreLibrary.API.Services;
using CoreLibrary.Base.Interfaces;
using CoreLibrary.Data;
using CoreLibrary.Services;
using CoreLibrary.Services.Social;
using CoreLibrary.Utility.Handlers.ExceptionHandlers;
using CoreLibrary.Utility.Models;
using CoreLibrary.Utility.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using System;
using System.IO;
using System.Net;
using System.Text.Json.Serialization;

namespace CoreLibrary
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.ConfigureSqliteDbServices<DataContext>(Configuration);
            services.ConfigureJwtServices(Configuration);
            services.ConfigureServices();
            services.AddMemoryCache();
            services.AddHttpClient<IHttpClientServices>();
            services.AddScoped<IHttpClientServices, BaseHttpServices>();
            services.AddScoped<IFileServices, FileServices>();
            services.AddScoped<ITwtServices, TwtServices>();
            services.AddScoped<IInstaServices, InstaServices>();

            services.AddScoped<IGoogleDriveService, GoogleDriveService>();
            services.AddScoped<IFileUploadService, FileUploadService>();
            services.AddMemoryCache();

            services.AddHttpContextAccessor();
            //FrontEndConfigureServices(services);
        }

        public void FrontEndConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                options.JsonSerializerOptions.IgnoreNullValues = true;
            });
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.Configure(env);
            //FrontEndConfigure(app, env);
        }

        public void FrontEndConfigure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                //app.UseExceptionHandler("/Error");

                app.UseExceptionHandler(appError =>
                {
                    appError.Run(async context =>
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        context.Response.ContentType = "application/json";
                        var exceptionHandler = context.Features.Get<IExceptionHandlerFeature>();
                        var apiResponse = new APIResponse();
                        if (exceptionHandler.Error != null)
                        {
                            // setting display errors
                            if (exceptionHandler.Error is HttpResponseException ex)
                            {
                                apiResponse.SetDisplayError(ex.Message);
                                apiResponse.StatusCode = ex.StatusCode;
                            }
                            else
                                apiResponse.SetException(exceptionHandler.Error);

                            //SentrySdk.CaptureException(exceptionHandler.Error);
                            context.Response.StatusCode = (int)apiResponse.StatusCode;
                        }


                        await context.Response.WriteAsync(JsonConvert.SerializeObject(apiResponse, new JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() }));

                    });
                });

                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            //app.UseStaticFiles();
            //if (!env.IsDevelopment())
            //{
            //    app.UseSpaStaticFiles();
            //}
            app.UseCors(a => a.AllowAnyOrigin()
            .AllowAnyMethod().AllowAnyHeader());

            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            
            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });

            // Mapping another client app with core as a base url
            //app.Map(new PathString("/core"), client => {
            //    if (env.IsDevelopment())
            //    {
            //        StaticFileOptions coreLib = new StaticFileOptions()
            //        {
            //            FileProvider = new PhysicalFileProvider(
            //                    Path.Combine(
            //                        Directory.GetCurrentDirectory(),
            //                        @"core-library"
            //                    )
            //                )
            //        };
            //        client.UseSpaStaticFiles(coreLib);
            //        client.UseSpa(spa =>
            //        {
            //            spa.Options.StartupTimeout = new TimeSpan(0, 5, 0);
            //            spa.Options.SourcePath = "core-library";
            //            // it will use package.json & will search for start command to run
            //            spa.UseAngularCliServer(npmScript: "start");
            //        });
            //    }
            //});

        }
    }
}
