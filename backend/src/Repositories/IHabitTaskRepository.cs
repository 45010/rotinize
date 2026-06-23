using src.Enums;
using src.Models;

namespace src.Repositories
{
    public interface IHabitTaskRepository
    {
        Task<HabitTask> GetByIdAsync(int userId, int id);

        Task<IEnumerable<HabitTask>> GetAllAsync(int userId, TaskCategory? category, Status? status, DateTime? startRangeDate, DateTime? endRangeDate, int? habitId);

        Task<IEnumerable<HabitTask>> GetTasksByHabitIdAsync(int userId, int habitId);

        Task<IEnumerable<HabitTask>> GetTasksForDateAsync(int userId, DateTime date);

        Task AddAsync(HabitTask task);

        Task AddRangeAsync(IEnumerable<HabitTask> tasks);

        void Update(HabitTask task);

        void Delete(HabitTask task);

        Task<bool> SaveChangesAsync();

        Task<bool> DoesTaskExistForDateAsync(int habitId, DateTime date);

        Task<int> CountCompletedTasksInRangeAsync(int habitId, DateTime startDate, DateTime endDate);
    }
}
