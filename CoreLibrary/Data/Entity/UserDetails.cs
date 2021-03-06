using CoreLibrary.API.Data.Entities;
using System;

namespace CoreLibrary.Data.Entity
{
    public class UserDetails
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public User User { get; set; }
    }
}