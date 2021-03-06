using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreLibrary.API.Interfaces
{
    public interface IRepository<TEntity>
    {
        void Insert(TEntity entity, EntityBehavior entityBehavior = EntityBehavior.SingleObject);
        void Update(TEntity entity, EntityBehavior entityBehavior = EntityBehavior.SingleObject);
        void Delete(TEntity entity, EntityBehavior entityBehavior = EntityBehavior.IncludeChilds);
        Task<TEntity> FindByIdAsync<T>(T id, EntityBehavior entityBehavior = EntityBehavior.SingleObject);
        IQueryable<TEntity> Query { get; }
    }

    public interface IDataContext
    {
        Task SaveChangesAsync();

        IRepository<T> GetRepository<T>() where T : class;

        void Migrate(IServiceProvider services);
    }
    public interface IEntityService
    {
    }
    public interface IEntityService<TEntity> : IEntityService where TEntity : class, new()
    {

    }
    public enum EntityBehavior
    {
        SingleObject,
        IncludeChilds
    }
}
