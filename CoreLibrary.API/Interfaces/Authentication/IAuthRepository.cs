using CoreLibrary.API.Data.Entities;
using System.Threading.Tasks;

namespace CoreLibrary.API.Interfaces.Authentication
{
    public interface IAuthRepository
    {
        Task<User> Register(User user, string password);

        Task<User> Login(string username, string password);

        Task<bool> UserExists(string username);
    }
}