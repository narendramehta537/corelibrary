using CoreLibrary.API.Interfaces.Authentication;
using CoreLibrary.API.Services.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Text;

namespace CoreLibrary.API.Extensions.Startup
{
    public static class StartupExtension
    {
        private static bool IsAuthentication = false;
        // This method gets called by the runtime. Use this method to add services to the container.
        public static IServiceCollection ConfigureServices(this IServiceCollection services)
        {
            services.AddControllers();
            services.ConfigureSwaggerServices(true);
            return services;
        }

        public static IServiceCollection ConfigureSqliteDbServices<TRepo>(this IServiceCollection services
                , IConfiguration configuration, string defaultPath = "DefaultConnection") where TRepo : DbContext
        {
            services.AddDbContext<TRepo>(context =>
            {
                context.UseSqlite(configuration.GetConnectionString(defaultPath));
            });
            var repo = services.BuildServiceProvider().GetRequiredService<TRepo>() as Data.DataContextBase<TRepo>;
            services.AddSingleton(repo);
            services.AddScoped<IAuthRepository, AuthRepository<TRepo>>();
            return services;
        }
        public static IServiceCollection ConfigureJwtServices(this IServiceCollection services
                        , IConfiguration configuration, string defaultPath = "AppSetting:Token")
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection(defaultPath).Value)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });
            return services;
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public static void Configure(this IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.ConfigureSwagger();
            }
            app.UseCors();

            app.UseHttpsRedirection();

            app.UseRouting();

      
            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers()
                //NOTE: only add when authentication is added in services
                .RequireAuthorization();
            });
        }

        public static IServiceCollection ConfigureSwaggerServices(this IServiceCollection services, bool addTokenBearer = false)
        {
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.WithOrigins("http://localhost:4200",
                            "https://localhost:4200")
                    .AllowAnyMethod().AllowAnyHeader().AllowCredentials()
                            .WithExposedHeaders("Content-Disposition");
                });
            });

            services.AddSwaggerGen(s =>
            {
                if (addTokenBearer)
                {
                    s.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                    {
                        Description = "JWT Authorization header using the Bearer scheme (Example: 'Bearer 12345abcdef')",
                        Name = "Authorization",
                        In = ParameterLocation.Header,
                        Type = SecuritySchemeType.ApiKey,
                        Scheme = "Bearer"
                    });

                    s.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
                }

                s.SwaggerDoc("v1", new OpenApiInfo { Title = "CoreLibrary.API", Version = "v1" });
            });

            return services;
        }

        public static IApplicationBuilder ConfigureSwagger(this IApplicationBuilder app)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "CoreLibrary.API v1"));
            return app;
        }
    }
}