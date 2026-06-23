using src.Enums;
using System.ComponentModel.DataAnnotations;

namespace src.DTOs
{
    public class CreateSingleTaskDto
    {
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        public Status Status { get; set; } = Status.NotStarted;
        [Required]
        public DateTime DueDate { get; set; }
        [Required]
        public TaskCategory Category { get; set; }
    }
}
