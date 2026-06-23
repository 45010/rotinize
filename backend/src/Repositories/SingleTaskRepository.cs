using Microsoft.EntityFrameworkCore;
using src.Data;
using src.Enums;
using src.Models;

namespace src.Repositories
{
    public class SingleTaskRepository(AppDbContext context) : ISingleTaskRepository
    {
        private readonly AppDbContext _context = context;

        public async Task AddAsync(SingleTask task)
        {
            await _context.Tasks.AddAsync(task);
        }

        public void Delete(SingleTask task)
        {
            _context.Tasks.Remove(task);
        }

        public async Task<IEnumerable<SingleTask>> GetAllAsync(int userId, TaskCategory? category, Status? status, DateTime? startRangeDate, DateTime? endRangeDate)
        {
            IQueryable<SingleTask> query = _context.Tasks
                .OfType<SingleTask>()
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

            return await query.ToListAsync();
        }

        public async Task<SingleTask> GetByIdAsync(int userId, int id)
        {
            return await _context.Tasks
                .OfType<SingleTask>()
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        }

        public async Task<IEnumerable<SingleTask>> GetTasksForDateAsync(int userId, DateTime date)
        {
            var dateOnly = date.Date;

            return await _context.Tasks
                .OfType<SingleTask>()
                .Where(t =>
                    t.UserId == userId && 
                    t.DueDate.Date == dateOnly)
                .ToListAsync();

        }
        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }

        public void Update(SingleTask task)
        {
            _context.Tasks.Update(task);
        }
    }
}
