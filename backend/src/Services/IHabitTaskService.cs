using src.DTOs;
using src.Enums;
using src.Models;

namespace src.Services
{
    public interface IHabitTaskService
    {
        Task<ViewHabitTaskDto> GetByIdAsync(int userId, int id);

        Task<IEnumerable<ViewHabitTaskDto>> GetAllAsync(int userId, TaskCategory? category, Status? status, DateTime? startRangeDate, DateTime? endRangeDate, int? habitId);

        Task<IEnumerable<ViewHabitTaskDto>> GetAllByHabitAsync(int userId, int habitId);

        Task<IEnumerable<ViewHabitTaskDto>> GetTasksForDateAsync(int userId, DateTime date);

        Task<ViewHabitTaskDto> UpdateStatusAsync(int userId, int id, UpdateStatusHabitTaskDto completeDto);
    }
}