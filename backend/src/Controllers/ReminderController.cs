using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using src.Data;
using src.Models;
using src.Services;

namespace src.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReminderController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly NotificationService _notificationService;

        public ReminderController(AppDbContext context, NotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        [HttpPost]
        public async Task<ActionResult<ReminderTask>> CreateReminder([FromBody] CreateReminderRequest request)
        {
            var reminder = new ReminderTask
            {
                UserId = request.UserId,
                Title = request.Title,
                Description = request.Description,
                ScheduledDateTime = request.ScheduledDateTime,
                Frequency = request.Frequency,
                Notify1HourBefore = request.Notify1HourBefore,
                Notify30MinutesBefore = request.Notify30MinutesBefore,
                Notify5MinutesBefore = request.Notify5MinutesBefore,
                Notify30MinutesAfter = request.Notify30MinutesAfter,
                RecurrenceInterval = request.RecurrenceInterval,
                EndDate = request.EndDate,
                SpecificDays = request.SpecificDays
            };

            _context.ReminderTasks.Add(reminder);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReminder), new { id = reminder.Id }, reminder);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReminderTask>> GetReminder(int id)
        {
            var reminder = await _context.ReminderTasks.FindAsync(id);
            if (reminder == null)
                return NotFound();

            return Ok(reminder);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<ReminderTask>>> GetUserReminders(string userId, [FromQuery] bool activeOnly = true)
        {
            var query = _context.ReminderTasks.Where(r => r.UserId == userId);
            
            if (activeOnly)
                query = query.Where(r => r.IsActive);

            var reminders = await query
                .OrderBy(r => r.ScheduledDateTime)
                .ToListAsync();

            return Ok(reminders);
        }

        [HttpGet("user/{userId}/upcoming")]
        public async Task<ActionResult<List<ReminderTask>>> GetUpcomingReminders(string userId, [FromQuery] int hours = 24)
        {
            var now = DateTime.UtcNow;
            var endTime = now.AddHours(hours);

            var reminders = await _context.ReminderTasks
                .Where(r => r.UserId == userId && 
                           r.IsActive && 
                           r.Status == ReminderStatus.Pending &&
                           r.ScheduledDateTime >= now && 
                           r.ScheduledDateTime <= endTime)
                .OrderBy(r => r.ScheduledDateTime)
                .ToListAsync();

            return Ok(reminders);
        }

        [HttpGet("user/{userId}/overdue")]
        public async Task<ActionResult<List<ReminderTask>>> GetOverdueReminders(string userId)
        {
            var now = DateTime.UtcNow;

            var reminders = await _context.ReminderTasks
                .Where(r => r.UserId == userId && 
                           r.IsActive && 
                           r.Status == ReminderStatus.Overdue)
                .OrderBy(r => r.ScheduledDateTime)
                .ToListAsync();

            return Ok(reminders);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReminder(int id, [FromBody] UpdateReminderRequest request)
        {
            var reminder = await _context.ReminderTasks.FindAsync(id);
            if (reminder == null)
                return NotFound();

            reminder.Title = request.Title ?? reminder.Title;
            reminder.Description = request.Description ?? reminder.Description;
            reminder.ScheduledDateTime = request.ScheduledDateTime ?? reminder.ScheduledDateTime;
            reminder.Frequency = request.Frequency ?? reminder.Frequency;
            reminder.Notify1HourBefore = request.Notify1HourBefore ?? reminder.Notify1HourBefore;
            reminder.Notify30MinutesBefore = request.Notify30MinutesBefore ?? reminder.Notify30MinutesBefore;
            reminder.Notify5MinutesBefore = request.Notify5MinutesBefore ?? reminder.Notify5MinutesBefore;
            reminder.Notify30MinutesAfter = request.Notify30MinutesAfter ?? reminder.Notify30MinutesAfter;
            reminder.RecurrenceInterval = request.RecurrenceInterval ?? reminder.RecurrenceInterval;
            reminder.EndDate = request.EndDate ?? reminder.EndDate;
            reminder.SpecificDays = request.SpecificDays ?? reminder.SpecificDays;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompleteReminder(int id)
        {
            var reminder = await _context.ReminderTasks.FindAsync(id);
            if (reminder == null)
                return NotFound();

            reminder.Status = ReminderStatus.Completed;
            reminder.CompletedAt = DateTime.UtcNow;

        
            if (reminder.Frequency != ReminderFrequency.Once)
            {
                await CreateNextRecurringReminder(reminder);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelReminder(int id)
        {
            var reminder = await _context.ReminderTasks.FindAsync(id);
            if (reminder == null)
                return NotFound();

            reminder.Status = ReminderStatus.Cancelled;
            reminder.IsActive = false;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReminder(int id)
        {
            var reminder = await _context.ReminderTasks.FindAsync(id);
            if (reminder == null)
                return NotFound();

            _context.ReminderTasks.Remove(reminder);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{id}/test-notification")]
        public async Task<IActionResult> TestNotification(int id, [FromBody] TestNotificationRequest request)
        {
            var reminder = await _context.ReminderTasks.FindAsync(id);
            if (reminder == null)
                return NotFound();

            await _notificationService.SendReminderNotificationAsync(reminder, request.NotificationType);
            return Ok(new { message = "Notificação de teste enviada" });
        }

        private async Task CreateNextRecurringReminder(ReminderTask originalReminder)
        {
            if (originalReminder.Frequency == ReminderFrequency.Once)
                return;

            var nextDateTime = CalculateNextReminderTime(originalReminder);
            if (nextDateTime == null)
                return;

            var nextReminder = new ReminderTask
            {
                UserId = originalReminder.UserId,
                Title = originalReminder.Title,
                Description = originalReminder.Description,
                ScheduledDateTime = nextDateTime.Value,
                Frequency = originalReminder.Frequency,
                Notify1HourBefore = originalReminder.Notify1HourBefore,
                Notify30MinutesBefore = originalReminder.Notify30MinutesBefore,
                Notify5MinutesBefore = originalReminder.Notify5MinutesBefore,
                Notify30MinutesAfter = originalReminder.Notify30MinutesAfter,
                RecurrenceInterval = originalReminder.RecurrenceInterval,
                EndDate = originalReminder.EndDate,
                SpecificDays = originalReminder.SpecificDays
            };

            _context.ReminderTasks.Add(nextReminder);
        }

        private DateTime? CalculateNextReminderTime(ReminderTask reminder)
        {
            var now = DateTime.UtcNow;
            var baseTime = reminder.ScheduledDateTime;

            return reminder.Frequency switch
            {
                ReminderFrequency.Daily => baseTime.AddDays(1),
                ReminderFrequency.Weekly => baseTime.AddDays(7),
                ReminderFrequency.Monthly => baseTime.AddMonths(1),
                ReminderFrequency.Custom when reminder.RecurrenceInterval.HasValue => 
                    baseTime.AddDays(reminder.RecurrenceInterval.Value),
                _ => null
            };
        }
    }

    public class CreateReminderRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime ScheduledDateTime { get; set; }
        public ReminderFrequency Frequency { get; set; } = ReminderFrequency.Once;
        public bool Notify1HourBefore { get; set; } = true;
        public bool Notify30MinutesBefore { get; set; } = true;
        public bool Notify5MinutesBefore { get; set; } = true;
        public bool Notify30MinutesAfter { get; set; } = true;
        public int? RecurrenceInterval { get; set; }
        public DateTime? EndDate { get; set; }
        public string? SpecificDays { get; set; }
    }

    public class UpdateReminderRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? ScheduledDateTime { get; set; }
        public ReminderFrequency? Frequency { get; set; }
        public bool? Notify1HourBefore { get; set; }
        public bool? Notify30MinutesBefore { get; set; }
        public bool? Notify5MinutesBefore { get; set; }
        public bool? Notify30MinutesAfter { get; set; }
        public int? RecurrenceInterval { get; set; }
        public DateTime? EndDate { get; set; }
        public string? SpecificDays { get; set; }
    }

    public class TestNotificationRequest
    {
        public NotificationType NotificationType { get; set; }
    }
}
