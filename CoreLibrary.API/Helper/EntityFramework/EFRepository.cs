using CoreLibrary.API.Data;
using CoreLibrary.API.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CoreLibrary.API.Helper.EntityFramework
{
    public class EFRepository<TEntity, TRepo> : IRepository<TEntity> where TEntity : class where TRepo : DbContext
    {
        public DataContextBase<TRepo> Db;
        public DbSet<TEntity> Set;

        public void Insert(TEntity entity, EntityBehavior entityBehavior = EntityBehavior.SingleObject)
        {
            Db.Add(entity);
            Db.SaveChanges();
        }

        public void Update(TEntity entity, EntityBehavior entityBehavior = EntityBehavior.SingleObject)
        {
            Db.Update(entity);
        }

        public void Delete(TEntity entity, EntityBehavior entityBehavior = EntityBehavior.SingleObject)
        {
            Db.Remove(entity);
        }

        public async Task<TEntity> FindByIdAsync<T>(T id, EntityBehavior entityBehavior = EntityBehavior.SingleObject)
        {
            return await Db.FindEntityAsync<TEntity>(id, entityBehavior);
        }

        public IQueryable<TEntity> Query
        {
            get
            {
                var db = Activator.CreateInstance(Db.GetType()) as DataContextBase<TRepo>;
                var query = db.Set<TEntity>();
                return query.AsNoTracking();
            }
        }
    }
}