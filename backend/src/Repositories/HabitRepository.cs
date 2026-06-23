using Microsoft.EntityFrameworkCore;
using src.Data;
using src.Enums;
using src.Models;

namespace src.Repositories
{
    public class HabitRepository(AppDbContext context) : IHabitRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<IEnumerable<Habit>> GetAllAsync(int userId, bool? isActive, TaskCategory? category)
        {
            IQueryable<Habit> query = _context.Habits.Where(h => h.UserId == userId);

            if (isActive.HasValue)
            {
                query = query.Where(h => h.IsActive == isActive.Value);
            }
            if (category.HasValue)
            {
                query = query.Where(h => h.Category == category.Value);
            }
            return await query.ToListAsync();
        }

        public async Task<Habit> GetByIdAsync(int userId, int id)
        {
            return await _context.Habits
                .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);
        }

        public async Task AddAsync(Habit habit)
        {
            await _context.Habits.AddAsync(habit);
        }

        public void Delete(Habit habit)
        {
            _context.Habits.Remove(habit);
        }


        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }

        public void Update(Habit habit)
        {
            _context.Habits.Update(habit);
        }

        public async Task<IEnumerable<Habit>> GetActiveHabitsForDateAsync(DateTime date)
        {
            var dateOnly = date.Date;

            return await _context.Habits
                .Where(h =>
                    h.IsActive &&
                    h.StartDate.Date <= dateOnly &&
                    (h.EndDate == null || h.EndDate.Value.Date >= dateOnly))
                .ToListAsync();
        }
    }
}
