using src.Enums;

namespace src.DTOs
{
    public class ViewTaskSummaryDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public TaskCategory Category { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? ConclusionDate { get; set; }
        public Status Status { get; set; }
        public string HabitName { get; set; } // Nome do hábito associado, se houver
    }
}
