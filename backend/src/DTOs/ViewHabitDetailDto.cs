using src.Enums;
using System.ComponentModel.DataAnnotations;

namespace src.DTOs
{
    public class ViewHabitDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public TaskCategory Category { get; set; }
        public bool IsActive { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public RecurrenceType RecurrenceType { get; set; }
        public List<DayOption> SpecificDays { get; set; }
        public int? Frequency { get; set; } 

        public MetricType MetricType { get; set; }
        public int? TargetQuantity { get; set; }
        public string QuantityUnit { get; set; }
        public TimeSpan? TargetDuration { get; set; }

        public int CurrentStreak { get; set; }
        public int LongestStreak { get; set; }

    }
}
