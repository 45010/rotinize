using Microsoft.AspNetCore.JsonPatch;
using src.DTOs;
using src.Enums;
using src.Models;

namespace src.Services
{
    public interface ISingleTaskService
    {
        Task<ViewSingleTaskDto> GetByIdAsync(int userId, int id);

        Task<IEnumerable<ViewSingleTaskDto>> GetAllAsync(int userId, TaskCategory? category, Status? status, DateTime? startRangeDate, DateTime? endRangeDate);

        Task<IEnumerable<ViewSingleTaskDto>> GetTasksForDateAsync(int userId, DateTime date);

        Task<ViewSingleTaskDto> CreateAsync(int userId, CreateSingleTaskDto createDto);

        Task<ViewSingleTaskDto> UpdateAsync(int userId, int id, UpdateSingleTaskDto updateDto);

        Task<ViewSingleTaskDto> UpdateStatusAsync(int userId, int id, Status status);

        Task<bool> DeleteAsync(int userId, int id);
    }
}
