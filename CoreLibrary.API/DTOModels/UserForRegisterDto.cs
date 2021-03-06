using System.ComponentModel.DataAnnotations;

namespace CoreLibrary.API.DTOModels
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(8, MinimumLength = 4, ErrorMessage = "Password must be between 4 and 8")]
        public string Password { get; set; }
    }
}