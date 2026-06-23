using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace src.Models
{
    public class HabitTask : AppTask
    {
        [Required]
        public int HabitId { get; set; }
        [ForeignKey("HabitId")]
        public Habit Habit { get; set; }
        
        public String Description { get; set; }

        public int? CompletedQuantity { get; set; }

        public TimeSpan? CompletedDuration { get; set; }
    }
}
