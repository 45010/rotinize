using src.Enums;
using System.ComponentModel.DataAnnotations;

namespace src.DTOs
{
    public class CreateHabitDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        [Required]
        public TaskCategory Category { get; set; }
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

    }
}
