using src.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace src.Models
{
    [Table("Habit")]
    public class Habit
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        [Required]
        public TaskCategory Category { get; set; }

        [Required]
        public bool IsActive { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [Required]
        public RecurrenceType RecurrenceType { get; set; }

        public List<DayOption> SpecificDays { get; set; } = new List<DayOption>();

        public int? Frequency { get; set; }

        [Required]
        public MetricType MetricType { get; set; }

        public int? TargetQuantity { get; set; }

        public string QuantityUnit { get; set; }

        public TimeSpan? TargetDuration { get; set; }
        
        public int CurrentStreak { get; set; }

        public int LongestStreak { get; set; }

        [Required]
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public Usuario Usuario { get; set; }
    }
}
