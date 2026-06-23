using Microsoft.AspNetCore.JsonPatch;
using src.DTOs;
using src.Enums;

namespace src.Services
{
    public interface IHabitService
    {
        Task<ViewHabitDetailDto> GetByIdAsync(int userId, int id);

        Task<IEnumerable<ViewHabitSummaryDto>> GetAllSummariesAsync(int userId, bool? isActive, TaskCategory? category);

        Task<ViewHabitDetailDto> CreateAsync(int userId, CreateHabitDto createDto);

        Task<ViewHabitDetailDto> UpdateAsync(int userId, int id, UpdateHabitDto updateDto);

        Task<ViewHabitDetailDto> UpdateActiveAsync(int userId, int id, bool active);

        Task<bool> DeleteAsync(int userId, int id);
    }
}