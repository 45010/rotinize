
using src.Enums;
using src.Models;
using src.Repositories;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace src.Services
{
    public class HabitTaskGeneratorService : IHabitTaskGeneratorService
    {
        private readonly IHabitRepository _habitRepository;
        private readonly IHabitTaskRepository _habitTaskRepository;
        private readonly ILogger<HabitTaskGeneratorService> _logger;

        public HabitTaskGeneratorService(
            IHabitRepository habitRepository,
            IHabitTaskRepository habitTaskRepository,
            ILogger<HabitTaskGeneratorService> logger)
        {
            _habitRepository = habitRepository;
            _habitTaskRepository = habitTaskRepository;
            _logger = logger;
        }

        public async Task<int> GenerateTasksForDateAsync(DateTime targetDate)
        {
            var date = targetDate.Date;
            _logger.LogInformation("Iniciando geração de HabitTasks para {Date}", date);

            var habitsToProcess = await _habitRepository.GetActiveHabitsForDateAsync(date);

            var tasksToCreate = new List<HabitTask>();

            foreach (var habit in habitsToProcess)
            {
                if (!ShouldHabitRunOnDate(habit, targetDate)) continue;
                if (await HasReachedQuotaAsync(habit, targetDate)) continue;

                bool taskExists = await _habitTaskRepository.DoesTaskExistForDateAsync(habit.Id, date);

                if (!taskExists)
                {
                    tasksToCreate.Add(CreateTaskForHabit(habit, date));
                }
            }

            if (tasksToCreate.Count != 0)
            {
                await _habitTaskRepository.AddRangeAsync(tasksToCreate);
                await _habitTaskRepository.SaveChangesAsync();
                _logger.LogInformation("{Count} novas HabitTasks criadas para {Date}.", tasksToCreate.Count, date);
            }
            else
            {
                _logger.LogInformation("Nenhuma nova HabitTask necessária para {Date}.", date);
            }

            return tasksToCreate.Count;
        }

        public async Task<bool> GenerateTaskForSpecificHabitAsync(Habit habit, DateTime date)
        {
            if (!ShouldHabitRunOnDate(habit, date)) return false;

            if (await HasReachedQuotaAsync(habit, date)) return false;

            bool taskExists = await _habitTaskRepository.DoesTaskExistForDateAsync(habit.Id, date);

            if (!taskExists)
            {
                var task = CreateTaskForHabit(habit, date);

                await _habitTaskRepository.AddAsync(task);
                await _habitTaskRepository.SaveChangesAsync();

                return true;
            }

            return false;
        }

        private async Task<bool> HasReachedQuotaAsync(Habit habit, DateTime date)
        {
            if (!habit.Frequency.HasValue || habit.Frequency.Value <= 0) return false;

            DateTime startDate;
            DateTime endDate;

            switch (habit.RecurrenceType)
            {
                case RecurrenceType.Weekly:
                    var dayOfWeek = (int)date.DayOfWeek;
                    startDate = date.Date.AddDays(-dayOfWeek);
                    endDate = startDate.AddDays(6);
                    break;

                case RecurrenceType.Monthly:
                    startDate = new DateTime(date.Year, date.Month, 1);
                    endDate = startDate.AddMonths(1).AddDays(-1);
                    break;

                default:
                    return false;
            }

            int completedCount = await _habitTaskRepository
                .CountCompletedTasksInRangeAsync(habit.Id, startDate, endDate);

            return completedCount >= habit.Frequency.Value;
        }

        private static bool ShouldHabitRunOnDate(Habit habit, DateTime date)
        {
            if (date.Date < habit.StartDate.Date) return false;
            if (habit.EndDate.HasValue && date.Date > habit.EndDate.Value.Date) return false;

            if (habit.RecurrenceType == RecurrenceType.SpecificDaysOfWeek)
            {
                var dayOfWeek = (DayOption)date.DayOfWeek;
                return habit.SpecificDays.Contains(dayOfWeek);
            } else
            {
                return true;
            }
        }
        
        private static HabitTask CreateTaskForHabit(Habit habit, DateTime date)
        {
            return new HabitTask
            {
                UserId = habit.UserId,
                HabitId = habit.Id,
                Title = habit.Name,
                Category = habit.Category,
                DueDate = date,
                Status = Status.NotStarted,

                CompletedQuantity = 0,
                CompletedDuration = TimeSpan.Zero
            };
        }

    }
}
