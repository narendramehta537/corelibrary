using CoreLibrary.API.Data.Entities;
using CoreLibrary.API.Helper.EntityFramework;
using CoreLibrary.API.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
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