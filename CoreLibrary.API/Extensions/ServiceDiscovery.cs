using CoreLibrary.API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreLibrary.API.Extensions
{
    public static class ServiceDiscovery
    {
        private static object locker = new object();

        private static IServiceProvider _serviceProvider;
        private static Dictionary<string, Type> _types = new Dictionary<string, Type>();
        private static Dictionary<string, Type> _entities = new Dictionary<string, Type>();
        private static Dictionary<Type, Type> _dataContext = new Dictionary<Type, Type>();


        private static IHttpContextAccessor m_httpContextAccessor;

        public static HttpContext CurrentHttpContext => m_httpContextAccessor.HttpContext;

        public static string AppBaseUrl => $"{CurrentHttpContext.Request.Scheme}://{CurrentHttpContext.Request.Host}{CurrentHttpContext.Request.PathBase}";

        public static string FileRootFolder = "Documents";

        public static Guid TenantId = Guid.Parse("7f4f4bd0-0e7e-4593-4177-08d7f030bdb3");

        public static void Initlize(IServiceProvider services)
        {
            _serviceProvider = services;
            var contextAccessor = GetService<IHttpContextAccessor>();
            m_httpContextAccessor = contextAccessor;
        }

        public static T GetService<T>() where T : class
        {
            return GetService(typeof(T)) as T;
        }

        public static object GetService(Type typ)
        {
            return _serviceProvider.GetService(typ);
        }

        public static object GetServices(Type typ)
        {
            return _serviceProvider.GetServices(typ);
        }

        public static IDataContext GetDataContext(Type entityType)
        {
            if (_dataContext.ContainsKey(entityType))
            {
                var dtyp = _dataContext[entityType];
                return GetService(dtyp) as IDataContext;
            }
            return null;
        }


        public static void AddType(string name, Type type)
        {
            lock (locker)
            {
                _types.TryAdd(name.ToLower(), type);
            }
        }

        public static Type GetType(string name)
        {
            if (_types.ContainsKey(name.ToLower()))
            {
                return _types[name.ToLower()];
            }
            return null;
        }

        public static void AddEntity(Type type, Type dataContextType)
        {
            lock (locker)
            {
                _types.TryAdd(type.Name.ToLower(), type);
                _entities.TryAdd(type.Name.ToLower(), type);
                _dataContext.TryAdd(type, dataContextType);
            }
        }



        public static T GetService<T>(string serviceName) where T : class
        {
            Type typ = GetType(serviceName);
            Type ServiceType = null;

            if (typeof(T) == typeof(IEntityService))
            {
                ServiceType = typeof(IEntityService<>).MakeGenericType(typ);
            }
            //else if (typeof(T) == typeof(ChartService))
            //{
            //    ServiceType = typ;
            //}
            //else if (typeof(T) == typeof(DashboardService))
            //{
            //    ServiceType = typ;
            //}


            return _serviceProvider.GetService(ServiceType) as T;
        }

    }
}
