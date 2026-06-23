using src.Enums;
using src.Models;

namespace src.Repositories
{
    public interface IHabitRepository
    {

        Task<Habit> GetByIdAsync(int userId, int id);

        Task<IEnumerable<Habit>> GetAllAsync(int userId, bool? isActive, TaskCategory? category);

        Task AddAsync(Habit habit);

        void Update(Habit habit);

        void Delete(Habit habit);

        Task<bool> SaveChangesAsync();

        Task<IEnumerable<Habit>> GetActiveHabitsForDateAsync(DateTime date);
    }
}
