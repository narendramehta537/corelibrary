using CoreLibrary.API.Data;
using CoreLibrary.Data.Entity;
using Microsoft.EntityFrameworkCore;

namespace CoreLibrary.Data
{
    public class DataContext : DataContextBase<DataContext>
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public DbSet<UserDetails> UserDetails { get; set; }
    }
}