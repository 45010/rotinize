using src.Enums;

namespace src.DTOs
{
    public class ViewHabitTaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public TaskCategory Category { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? ConclusionDate { get; set; }
        public Status Status { get; set; }

        public MetricType MetricType { get; set; }
        public int? TargetQuantity { get; set; }
        public string QuantityUnit { get; set; }
        public TimeSpan? TargetDuration { get; set; }
        
        public int? CompletedQuantity { get; set; }
        public TimeSpan? CompletedDuration { get; set; }

        public int HabitId { get; set; }
        public string HabitName { get; set; }

    }
}
