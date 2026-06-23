using src.Enums;
using src.Models;

namespace src.Repositories
{
    public interface ISingleTaskRepository
    {

        Task<SingleTask> GetByIdAsync(int userId, int id);

        Task<IEnumerable<SingleTask>> GetAllAsync(int userId, TaskCategory? category, Status? status, DateTime? startRangeDate, DateTime? endRangeDate);

        Task<IEnumerable<SingleTask>> GetTasksForDateAsync(int userId, DateTime date);
        Task AddAsync(SingleTask task);

        void Update(SingleTask task);

        void Delete(SingleTask task);

        Task<bool> SaveChangesAsync();
    }
}
