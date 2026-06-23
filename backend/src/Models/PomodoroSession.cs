using System.ComponentModel.DataAnnotations;

namespace src.Models
{
    public class PomodoroSession
    {
        public int Id { get; set; }
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        
        [Required]
        public PomodoroFlow Flow { get; set; }
        
        public PomodoroPhase CurrentPhase { get; set; } = PomodoroPhase.Focus;
        
        public int FocusCount { get; set; } = 0;
        
        public DateTime StartTime { get; set; }
        
        public DateTime? EndTime { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public int RemainingSeconds { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
    
    public enum PomodoroFlow
    {
        Flow1 = 1, // 25 min foco, 5 min descanso
        Flow2 = 2  // 50 min foco, 10 min descanso
    }
    
    public enum PomodoroPhase
    {
        Focus,
        ShortBreak,
        LongBreak
    }
}
