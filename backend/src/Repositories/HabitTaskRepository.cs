using Microsoft.EntityFrameworkCore;
using src.Data;
using src.Enums;
using src.Models;

namespace src.Repositories
{
    public class HabitTaskRepository(AppDbContext context) : IHabitTaskRepository
    {
        private readonly AppDbContext _context = context;

        public async Task AddAsync(HabitTask task)
        {
            await _context.Tasks.AddAsync(task);
        }

        public async Task AddRangeAsync(IEnumerable<HabitTask> tasks)
        {
            await _context.Tasks.AddRangeAsync(tasks);
        }

        public void Delete(HabitTask task)
        {
            _context.Tasks.Remove(task);
        }

        public async Task<IEnumerable<HabitTask>> GetAllAsync(int userId, TaskCategory? category, Status? status, DateTime? startRangeDate, DateTime? endRangeDate, int? habitId)
        {
            IQueryable<HabitTask> query = _context.Tasks
                .OfType<HabitTask>()
                .Include(t => t.Habit)
                .Where(h => h.UserId == userId);

            if (category.HasValue)
            {
                query = query.Where(t => t.Category == category.Value);
            }
            
            if (status.HasValue)
            {
                query = query.Where(t => t.Status == status.Value);
            }
            
            if (startRangeDate.HasValue && endRangeDate.HasValue)
            {
                query = query.Where(t => t.DueDate >= startRangeDate.Value && t.DueDate <= endRangeDate.Value);
            }

            if (habitId.HasValue)
            {
                query = query.Where(t => t.HabitId == habitId.Value);
            }
            
            return await query.ToListAsync();
        }

        public async Task<HabitTask> GetByIdAsync(int userId, int id)
        {
            return await _context.Tasks
                .OfType<HabitTask>()
                .Include(t => t.Habit)
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        }

        public async Task<IEnumerable<HabitTask>> GetTasksByHabitIdAsync(int userId, int habitId)
        {
            return await _context.Tasks
                .OfType<HabitTask>()
                .Where(t => t.HabitId == habitId && t.UserId == userId)
                .Include(t => t.Habit)
                .ToListAsync();
        }

        public async Task<IEnumerable<HabitTask>> GetTasksForDateAsync(int userId, DateTime date)
        {
            var dateOnly = date.Date;

            return await _context.Tasks 
                .OfType<HabitTask>()
                .Include(t => t.Habit)
                .Where(t =>
                    t.UserId == userId &&            
                    t.DueDate.Date == dateOnly)
                .ToListAsync();
        }
        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }

        public void Update(HabitTask task)
        {
            _context.Tasks.Update(task);
        }

        public async Task<bool> DoesTaskExistForDateAsync(int habitId, DateTime date)
        {
            var dateOnly = date.Date;

            return await _context.Tasks
                .OfType<HabitTask>()
                .AnyAsync(t =>
                    t.HabitId == habitId &&
                    t.DueDate.Date == dateOnly);
        }

        public async Task<int> CountCompletedTasksInRangeAsync(int habitId, DateTime startDate, DateTime endDate)
        {
            var start = startDate.Date;
            var end = endDate.Date;

            return await _context.Tasks
                .OfType<HabitTask>() 
                .Where(t =>
                    t.HabitId == habitId &&
                    t.Status == Status.Completed && 
                    t.DueDate.Date >= start &&
                    t.DueDate.Date <= end)
                .CountAsync();
        }
    }
}
