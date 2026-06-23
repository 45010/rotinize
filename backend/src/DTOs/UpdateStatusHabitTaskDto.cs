using src.Enums;

namespace src.DTOs
{
    public class UpdateStatusHabitTaskDto
    {
        public Status Status { get; set; }
        public int? CompletedQuantity { get; set; }
        public TimeSpan? CompletedDuration { get; set; }

        public bool AddInExistent { get; set; }
    }
}
