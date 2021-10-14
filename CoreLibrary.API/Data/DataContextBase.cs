using CoreLibrary.API.Data.Entities;
using CoreLibrary.API.Helper.EntityFramework;
using CoreLibrary.API.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace CoreLibrary.API.Data
{
    public class DataContextBase<TRepo> : DbContext, IDataContext where TRepo : DbContext
    {
        public DataContextBase(DbContextOptions<TRepo> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public IRepository<T> GetRepository<T>() where T : class
        {
            Type typ = typeof(EFRepository<T, TRepo>).MakeGenericType(typeof(T));
            var rep = Activator.CreateInstance(typ) as EFRepository<T, TRepo>;
            //TODO: generic DataContext
            rep.Db = this;
            rep.Set = Set<T>();
            return rep;
        }

        public async Task<int> AddSaveAsync<T>(T entity, CancellationToken cancellationToken = default) where T : class
        {
            _ = await Set<T>().AddAsync(entity, cancellationToken);
            return await base.SaveChangesAsync();
        }
        public async Task<int> AddRangeSaveAsync<T>(IEnumerable<T> entities, CancellationToken cancellationToken = default) where T : class
        {
            await Set<T>().AddRangeAsync(entities, cancellationToken);
            return await base.SaveChangesAsync();
        }

        public async Task<IList<T>> GetAllAsync<T>(Expression<Func<T, bool>> expression) where T : class
        {
            return await Set<T>().Where(expression).ToListAsync();
        }
        public async Task<int> UpdateSaveAsync<T>(T entity) where T : class
        {
            Set<T>().Update(entity).State = EntityState.Modified;
            return await base.SaveChangesAsync();
        }
        public async Task<int> UpdateSaveAsync<T>(IEnumerable<T> entities) where T : class
        {
            Set<T>().UpdateRange(entities);
            return await base.SaveChangesAsync();
        }

        public async Task<int> DeleteSaveAsync<T>(T entity) where T : class
        {
            _ = Set<T>().Remove(entity);
            return await base.SaveChangesAsync();
        }
        public async Task<int> DeleteSaveAsync<T>(Expression<Func<T, bool>> expression) where T : class
        {
            var list = Set<T>().Where(expression);
            Set<T>().RemoveRange(list);
            return await base.SaveChangesAsync();
        }

        public async virtual Task SaveChangesAsync()
        {
            //BeforeSave();

            try
            {
                await base.SaveChangesAsync();
            }
            catch (Exception e)
            {
                RollBack();
                throw new Exception("Unable to save changes!", e);
            }

            //AfterSave();
        }

        public void Migrate(IServiceProvider services)
        {
            Database.EnsureCreated();
            Database.Migrate();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            DisableCascadeDelete(modelBuilder);
            base.OnModelCreating(modelBuilder);
        }

        public void DisableCascadeDelete(ModelBuilder modelBuilder)
        {
            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }
        }

        public void RollBack()
        {
            foreach (var dbEntityEntry in this.ChangeTracker.Entries().ToArray())
            {
                if (dbEntityEntry.Entity != null)
                {
                    dbEntityEntry.State = EntityState.Detached;
                }
            }
        }

        public async Task<TEntity> FindEntityAsync<TEntity>(object id, EntityBehavior entityBehavior = EntityBehavior.SingleObject) where TEntity : class
        {
            var dbset = Set<TEntity>();

            var parameter = Expression.Parameter(typeof(TEntity), "x");
            var query = dbset.Where((Expression<Func<TEntity, bool>>)
                Expression.Lambda(
                    Expression.Equal(
                        Expression.Property(parameter, "Id"),
                        Expression.Constant(id)),
                    parameter));

            if (entityBehavior != EntityBehavior.SingleObject)
            {
                foreach (var prop in (typeof(TEntity)).GetProperties())
                {
                    if (prop.PropertyType == typeof(Guid))
                    {
                        if (entityBehavior == EntityBehavior.IncludeChilds)
                        {
                            query = query.Include(prop.Name);
                        }
                    }
                }
            }
            return await query.FirstOrDefaultAsync();
        }
    }
}