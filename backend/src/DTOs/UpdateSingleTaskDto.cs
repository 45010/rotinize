using src.Enums;
using System.ComponentModel.DataAnnotations;

namespace src.DTOs
{
    public class UpdateSingleTaskDto
    {
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        [Required]
        public DateTime DueDate { get; set; }
        //public DateTime? ConclusionDate { get; set; }
        [Required]
        public Status Status { get; set; }
    }
}
