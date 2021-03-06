using CoreLibrary.API.Data;
using CoreLibrary.API.Data.Entities;
using CoreLibrary.API.Interfaces.Authentication;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace CoreLibrary.API.Services.Authentication
{
    public class AuthRepository<TRepo> : IAuthRepository where TRepo : DbContext
    {
        private readonly DataContextBase<TRepo> _dataContext;

        public AuthRepository(DataContextBase<TRepo> dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<User> Login(string username, string password)
        {
            var user = await _dataContext.Users.FirstOrDefaultAsync(a => a.Username == username);
            if (user == null)
                return null;

            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;
            return user;
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt);
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            for (int index = 0; index < computedHash.Length; index++)
            {
                if (computedHash[index] != passwordHash[index])
                    return false;
            }
            return true;
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            await _dataContext.Users.AddAsync(user);
            _dataContext.SaveChangesAsync().Wait();
            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }

        public async Task<bool> UserExists(string username)
        {
            if (await _dataContext.Users.AnyAsync(a => a.Username == username))
                return true;
            return false;
        }
    }
}