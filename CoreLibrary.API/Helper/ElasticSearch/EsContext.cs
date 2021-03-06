namespace CoreLibrary.API.Helper.ElasticSearch
{
    //public class EsContext : IDataContext
    //{
    //    private IElasticClient _elasticClient;

    //    public EsContext()
    //    {
    //        _elasticClient = ServiceDiscovery.GetService<IElasticClient>();
    //        var props = this.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.FlattenHierarchy).ToList();
    //        foreach (var one in props.Where(m => m.PropertyType.Name == "EsSet`1"))
    //        {
    //            Type typ = one.PropertyType.GetGenericArguments().First();

    //            IEsSet obj = Activator.CreateInstance(one.PropertyType, _elasticClient) as IEsSet;
    //            one.SetValue(this, obj);
    //        }
    //    }

    //    public DbSet<Entity> Set<Entity>() where Entity : class
    //    {
    //        var props = this.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.FlattenHierarchy).ToList();
    //        foreach (var one in props.Where(m => m.PropertyType.Name == "EsSet`1"))
    //        {
    //            Type typ = one.PropertyType.GetGenericArguments().First();
    //            if (typ == typeof(Entity))
    //            {
    //                var set = one.GetValue(this) as EsSet<Entity>;
    //                return set;
    //            }
    //        }
    //        return null;
    //    }

    //    public async Task<List<BulkResponse>> SaveChangesAsync()
    //    {
    //        try
    //        {
    //            List<BulkResponse> response = null;
    //            var props = this.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.FlattenHierarchy).ToList();
    //            foreach (var one in props)
    //            {
    //                if (one.PropertyType.Name == "EsSet`1")
    //                {
    //                    IEsSet esSet = one.GetValue(this) as IEsSet;

    //                    if (esSet != null)
    //                    {
    //                        if (response == null) response = new List<BulkResponse>();
    //                        response.Add(await esSet.SaveChangesAsync());
    //                    }
    //                }
    //            }
    //            return response;
    //        }
    //        catch (Exception e)
    //        {
    //            throw ExceptionManager.LogAndWrapException("Unable to save changes!", e);
    //        }
    //    }

    //    public IRepository<T> GetRepository<T>() where T : class
    //    {
    //        Type typ = typeof(EFRepository<>).MakeGenericType(typeof(T));
    //        EsRepository<T> rep = Activator.CreateInstance(typ) as EsRepository<T>;
    //        rep.Db = this;
    //        rep.Set = Set<T>();
    //        return rep;
    //    }

    //    public void CreateIndex()
    //    {
    //        var props = this.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.FlattenHierarchy).ToList();
    //        foreach (var one in props)
    //        {
    //            if (one.PropertyType.Name == "EsSet`1")
    //            {
    //                IEsSet esSet = one.GetValue(this) as IEsSet;

    //                if (esSet != null)
    //                {
    //                    esSet.CreateIndex();
    //                }
    //            }
    //        }
    //    }

    //    public virtual void Migrate(IServiceProvider services)
    //    {
    //        this.CreateIndex();
    //    }

    //    Task IDataContext.SaveChangesAsync()
    //    {
    //        throw new NotImplementedException();
    //    }
    //}
}