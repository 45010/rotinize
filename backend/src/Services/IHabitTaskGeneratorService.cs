using src.Models;

namespace src.Services
{
    public interface IHabitTaskGeneratorService
    {
        Task<int> GenerateTasksForDateAsync(DateTime targetDate);
        Task<bool> GenerateTaskForSpecificHabitAsync(Habit habit, DateTime date);
    }
}
