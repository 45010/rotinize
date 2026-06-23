using src.Services;

namespace src.Services
{
    public class ReminderBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<ReminderBackgroundService> _logger;
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(1); // Verifica a cada minuto

        public ReminderBackgroundService(IServiceProvider serviceProvider, ILogger<ReminderBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Serviço de lembretes iniciado");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var notificationService = scope.ServiceProvider.GetRequiredService<NotificationService>();

                    // Verificar lembretes próximos
                    await notificationService.CheckAndSendUpcomingNotificationsAsync();
                    
                    // Verificar lembretes atrasados
                    await notificationService.CheckAndSendOverdueNotificationsAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erro no serviço de lembretes");
                }

                await Task.Delay(_checkInterval, stoppingToken);
            }

            _logger.LogInformation("Serviço de lembretes parado");
        }
    }
}
