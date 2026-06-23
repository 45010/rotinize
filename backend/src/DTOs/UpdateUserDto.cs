using System.ComponentModel.DataAnnotations;

namespace src.DTOs
{
    public class UpdateUserDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email deve ter um formato válido")]
        public string Email { get; set; } = string.Empty;
    }
}
