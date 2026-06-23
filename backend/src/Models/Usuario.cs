using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using src.Models;

namespace src.Models
{
    [Table("Usuario")]
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Nome { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string SenhaHash { get; set; }

        //public ICollection<SingleTask> TarefasSimples { get; set; }
        //public ICollection<HabitTask> TarefasDeHabito { get; set; }


    }
}