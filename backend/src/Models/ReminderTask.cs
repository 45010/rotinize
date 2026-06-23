using System.ComponentModel.DataAnnotations;

namespace src.Models
{
    public class ReminderTask
    {
        public int Id { get; set; }
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        [Required]
        public DateTime ScheduledDateTime { get; set; }
        
        public ReminderFrequency Frequency { get; set; } = ReminderFrequency.Once;
        
        public ReminderStatus Status { get; set; } = ReminderStatus.Pending;
        
        public DateTime? CompletedAt { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? LastNotificationSent { get; set; }
        
        public int NotificationCount { get; set; } = 0;
        
        public bool IsActive { get; set; } = true;
        
        public bool Notify1HourBefore { get; set; } = true;
        public bool Notify30MinutesBefore { get; set; } = true;
        public bool Notify5MinutesBefore { get; set; } = true;
        public bool Notify30MinutesAfter { get; set; } = true;
        
        public int? RecurrenceInterval { get; set; } 
        public DateTime? EndDate { get; set; }
        public string? SpecificDays { get; set; } 
    }
    
    public enum ReminderFrequency
    {
        Once = 0,          
        Daily = 1,          
        Weekly = 2,         
        Monthly = 3,        
        Custom = 4        
    }
    
    public enum ReminderStatus
    {
        Pending = 0,        
        Completed = 1,     
        Overdue = 2,        
        Cancelled = 3      
    }
}
