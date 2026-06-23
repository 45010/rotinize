using Microsoft.EntityFrameworkCore;
using src.Data;
using src.Models;

namespace src.Services
{
    public enum NotificationType
    {
        OneHourBefore = 0,
        ThirtyMinutesBefore = 1,
        FiveMinutesBefore = 2,
        ThirtyMinutesAfter = 3,
        Overdue = 4
    }

    public class NotificationService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(AppDbContext context, ILogger<NotificationService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task SendReminderNotificationAsync(ReminderTask reminder, NotificationType type)
        {
            try
            {

                var message = GetNotificationMessage(reminder, type);
                /* TODO: Implementar a notificação para o usuário
                 Verificar qual tipo de notificação será enviada, aqui temos:
                 Para cada tipo de notificação, podemos usar diferentes serviços:
                 - Push notifications (Firebase, OneSignal)
                 - Email (SendGrid, SMTP)
                 - SMS (Twilio)
                 - WebSocket para notificações em tempo real
                 - Notificações locais (LocalNotification) */


                _logger.LogInformation($"Notificação enviada para usuário {reminder.UserId}: {message}");
                
                reminder.NotificationCount++;
                reminder.LastNotificationSent = DateTime.UtcNow;
                
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Erro ao enviar notificação para lembrete {reminder.Id}");
            }
        }

        public async Task CheckAndSendUpcomingNotificationsAsync()
        {
            var now = DateTime.UtcNow;
            var upcomingReminders = await _context.ReminderTasks
                .Where(r => r.IsActive && r.Status == ReminderStatus.Pending)
                .ToListAsync();

            foreach (var reminder in upcomingReminders)
            {
                var timeUntilReminder = reminder.ScheduledDateTime - now;
                
                // 1 hora antes
                if (reminder.Notify1HourBefore && 
                    timeUntilReminder <= TimeSpan.FromHours(1) && 
                    timeUntilReminder > TimeSpan.FromMinutes(55) &&
                    !HasNotificationBeenSent(reminder, NotificationType.OneHourBefore))
                {
                    await SendReminderNotificationAsync(reminder, NotificationType.OneHourBefore);
                }
                
                // 30 minutos antes
                if (reminder.Notify30MinutesBefore && 
                    timeUntilReminder <= TimeSpan.FromMinutes(30) && 
                    timeUntilReminder > TimeSpan.FromMinutes(25) &&
                    !HasNotificationBeenSent(reminder, NotificationType.ThirtyMinutesBefore))
                {
                    await SendReminderNotificationAsync(reminder, NotificationType.ThirtyMinutesBefore);
                }
                
                // 5 minutos antes
                if (reminder.Notify5MinutesBefore && 
                    timeUntilReminder <= TimeSpan.FromMinutes(5) && 
                    timeUntilReminder > TimeSpan.FromMinutes(0) &&
                    !HasNotificationBeenSent(reminder, NotificationType.FiveMinutesBefore))
                {
                    await SendReminderNotificationAsync(reminder, NotificationType.FiveMinutesBefore);
                }
            }
        }

        public async Task CheckAndSendOverdueNotificationsAsync()
        {
            var now = DateTime.UtcNow;
            var overdueReminders = await _context.ReminderTasks
                .Where(r => r.IsActive && 
                           r.Status == ReminderStatus.Pending && 
                           r.ScheduledDateTime < now)
                .ToListAsync();

            foreach (var reminder in overdueReminders)
            {
                var timeOverdue = now - reminder.ScheduledDateTime;
                
                // 30 minutos após o horário agendado
                if (reminder.Notify30MinutesAfter && 
                    timeOverdue >= TimeSpan.FromMinutes(30) && 
                    timeOverdue < TimeSpan.FromHours(1) &&
                    !HasNotificationBeenSent(reminder, NotificationType.ThirtyMinutesAfter))
                {
                    await SendReminderNotificationAsync(reminder, NotificationType.ThirtyMinutesAfter);
                }
                
                // Marcar como atrasado se passou mais de 1 hora
                if (timeOverdue >= TimeSpan.FromHours(1))
                {
                    reminder.Status = ReminderStatus.Overdue;
                    await SendReminderNotificationAsync(reminder, NotificationType.Overdue);
                }
            }
            
            await _context.SaveChangesAsync();
        }

        private string GetNotificationMessage(ReminderTask reminder, NotificationType type)
        {
            return type switch
            {
                NotificationType.OneHourBefore => $"⏰ Lembrete em 1 hora: {reminder.Title}",
                NotificationType.ThirtyMinutesBefore => $"⏰ Lembrete em 30 minutos: {reminder.Title}",
                NotificationType.FiveMinutesBefore => $"⏰ Lembrete em 5 minutos: {reminder.Title}",
                NotificationType.ThirtyMinutesAfter => $"⚠️ Você esqueceu: {reminder.Title}",
                NotificationType.Overdue => $"🚨 Atrasado: {reminder.Title}",
                _ => $"Lembrete: {reminder.Title}"
            };
        }

        private bool HasNotificationBeenSent(ReminderTask reminder, NotificationType type)
        {
            // Verificar se a notificação já foi enviada baseado no tipo e tempo
            var now = DateTime.UtcNow;
            var timeUntilReminder = reminder.ScheduledDateTime - now;
            
            return type switch
            {
                NotificationType.OneHourBefore => 
                    reminder.LastNotificationSent.HasValue && 
                    reminder.LastNotificationSent.Value > now.AddHours(-1.1),
                NotificationType.ThirtyMinutesBefore => 
                    reminder.LastNotificationSent.HasValue && 
                    reminder.LastNotificationSent.Value > now.AddMinutes(-35),
                NotificationType.FiveMinutesBefore => 
                    reminder.LastNotificationSent.HasValue && 
                    reminder.LastNotificationSent.Value > now.AddMinutes(-10),
                NotificationType.ThirtyMinutesAfter => 
                    reminder.LastNotificationSent.HasValue && 
                    reminder.LastNotificationSent.Value > reminder.ScheduledDateTime.AddMinutes(25),
                _ => false
            };
        }
    }
}
