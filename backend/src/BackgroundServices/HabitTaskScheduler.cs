using src.Services;

namespace src.BackgroundServices
{
    public class HabitTaskScheduler : BackgroundService
    {
        private readonly ILogger<HabitTaskScheduler> _logger;
        private readonly IServiceProvider _serviceProvider;

        public HabitTaskScheduler(ILogger<HabitTaskScheduler> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("HabitTaskScheduler está iniciando.");
            var today = DateTime.Now.Date;
            _logger.LogInformation("Verificando tarefas para HOJE ({Date}) na inicialização...", today);

            await RunGeneratorAsync(today);

            while (!stoppingToken.IsCancellationRequested)
            {
                var now = DateTime.Now;
                var nextRunTime = now.Date.AddDays(1); 
                var delay = nextRunTime - now;

                _logger.LogInformation("Próxima geração de tarefas agendada para {NextRunTime} (em {Delay}).", nextRunTime, delay);

                await Task.Delay(delay, stoppingToken);

                await RunGeneratorAsync(nextRunTime);
            }
        }

        private async Task RunGeneratorAsync(DateTime dateToProcess)
        {
            _logger.LogInformation("Iniciando execução do gerador de tarefas para: {Date}", dateToProcess);

            using (var scope = _serviceProvider.CreateScope())
            {
                try
                {
                    var scopedGeneratorService = scope.ServiceProvider
                        .GetRequiredService<IHabitTaskGeneratorService>();

                    int count = await scopedGeneratorService.GenerateTasksForDateAsync(dateToProcess);

                    _logger.LogInformation("Execução concluída. {Count} tarefas criadas ou verificadas para {Date}.", count, dateToProcess);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Falha ao executar o HabitTaskGeneratorService para a data {Date}.", dateToProcess);
                }
            }
        }
    }
}
