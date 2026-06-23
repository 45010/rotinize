using src.Enums;

namespace src.DTOs
{
    public class ViewHabitSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string GoalSummary { get; set; } // montada a partir das configurações de métrica e recorrência (ex.: 30 minutos 3x por semana, 5 páginas diariamente, etc.)
        public TaskCategory Category { get; set; }
        public bool IsActive { get; set; }
        public int CurrentStreak { get; set; }
    }
}
