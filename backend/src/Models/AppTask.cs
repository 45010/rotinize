using src.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace src.Models
{
    [Table("Task")]
    public abstract class AppTask
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }

        [Required]
        public DateTime DueDate { get; set; }
        public DateTime? ConclusionDate { get; set; }
        [Required]
        public TaskCategory Category { get; set; }
        [Required]
        public Status Status { get; set; }

        [Required]
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public Usuario Usuario { get; set; }

    }
}
