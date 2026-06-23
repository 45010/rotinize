using Microsoft.AspNetCore.JsonPatch;
using src.DTOs;
using src.Enums;
using src.Models;
using src.Repositories;

namespace src.Services
{
    public class SingleTaskService(ISingleTaskRepository singleTaskRepository) : ISingleTaskService
    {
        private readonly ISingleTaskRepository _singleTaskRepository = singleTaskRepository;

        public async Task<ViewSingleTaskDto> CreateAsync(int userId, CreateSingleTaskDto createDto)
        {
            //ValidateSingleTaskLogic(true, createDto.DueDate, null, createDto.Status);
            
            var newTask = new SingleTask
            {
                Title = createDto.Title,
                Description = createDto.Description,
                Category = createDto.Category,
                Status = createDto.Status,
                DueDate = createDto.DueDate,
                UserId = userId,
            };

            await _singleTaskRepository.AddAsync(newTask);
            await _singleTaskRepository.SaveChangesAsync();

            return MapToViewSingleTaskDto(newTask);
        }

        public async Task<bool> DeleteAsync(int userId, int id)
        {
            var taskToDelete = await _singleTaskRepository.GetByIdAsync(userId, id) ??
                throw new KeyNotFoundException($"Tarefa com ID {id} não encontrada ou você não tem permissão para acessá-la.");
        
            _singleTaskRepository.Delete(taskToDelete);
            return await _singleTaskRepository.SaveChangesAsync();
        }

        public async Task<IEnumerable<ViewSingleTaskDto>> GetAllAsync(int userId, TaskCategory? category, Status? status, DateTime? startRangeDate, DateTime? endRangeDate)
        {
            var tasks = await _singleTaskRepository.GetAllAsync(userId, category, status, startRangeDate, endRangeDate);
            return tasks.Select(t => MapToViewSingleTaskDto(t));
        }

        public async Task<ViewSingleTaskDto> GetByIdAsync(int userId, int id)
        {
            var task = await _singleTaskRepository.GetByIdAsync(userId, id) ??
                throw new KeyNotFoundException($"Tarefa com ID {id} não encontrada ou você não tem permissão para acessá-la.");
            return MapToViewSingleTaskDto(task);
        }

        public async Task<IEnumerable<ViewSingleTaskDto>> GetTasksForDateAsync(int userId, DateTime date)
        {
            var tasks = await _singleTaskRepository.GetTasksForDateAsync(userId, date);
            return tasks.Select(t => MapToViewSingleTaskDto(t));
        }

        public async Task<ViewSingleTaskDto> UpdateAsync(int userId, int id, UpdateSingleTaskDto updateDto)
        {
            var taskToUpdate = await _singleTaskRepository.GetByIdAsync(userId, id) ??
                throw new KeyNotFoundException($"Tarefa com ID {id} não encontrada ou você não tem permissão para acessá-la.");

            //ValidateSingleTaskLogic(false, updateDto.DueDate, updateDto.ConclusionDate, updateDto.Status);

            taskToUpdate.Title = updateDto.Title;
            taskToUpdate.Description = updateDto.Description;
            taskToUpdate.Status = updateDto.Status;
            taskToUpdate.DueDate = updateDto.DueDate;
            //taskToUpdate.ConclusionDate = updateDto.ConclusionDate;

            await _singleTaskRepository.SaveChangesAsync();
            return MapToViewSingleTaskDto(taskToUpdate);

        }

        public async Task<ViewSingleTaskDto> UpdateStatusAsync(int userId, int id, Status status)
        {
            var task = await _singleTaskRepository.GetByIdAsync(userId, id) ??
                throw new KeyNotFoundException($"Tarefa com ID {id} não encontrada ou você não tem permissão para acessá-la.");

            task.Status = status;
            task.ConclusionDate = status == Status.Completed ? DateTime.Now : null;

            await _singleTaskRepository.SaveChangesAsync();
            return MapToViewSingleTaskDto(task);
        }

        // ====================== MÉTODOS AUXILIARES ======================

        private ViewSingleTaskDto MapToViewSingleTaskDto(SingleTask task)
        {
            return new ViewSingleTaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Category = task.Category,
                Status = task.Status,
                DueDate = task.DueDate,
                ConclusionDate = task.ConclusionDate
            };
        }

        private ViewTaskSummaryDto MapToViewTaskSummaryDto(SingleTask task)
        {
            return new ViewTaskSummaryDto
            {
                Id = task.Id,
                Title = task.Title,
                Category = task.Category,
                Status = task.Status,
                DueDate = task.DueDate,
                HabitName = null
            };
        }

        //private void ValidateSingleTaskLogic(bool IsNewTask, DateTime dueDate, DateTime? conclusionDate, Status status)
        //{
        //    if (conclusionDate.HasValue && conclusionDate.Value > DateTime.UtcNow)
        //    {
        //        throw new ArgumentException("A data de conclusão não pode ser futura.");
        //    }
        //    //if (status == Status.Completed && !conclusionDate.HasValue)
        //    //{
        //    //    throw new ArgumentException("Uma tarefa concluída deve ter uma data de conclusão.");
        //    //}
        //    //if (status != Status.Completed && conclusionDate.HasValue)
        //    //{
        //    //    throw new ArgumentException("Apenas tarefas concluídas podem ter uma data de conclusão.");
        //    //}
        //    if (IsNewTask && dueDate < DateTime.Now)
        //    {
        //        throw new ArgumentException("A data de vencimento não pode ser no passado.");
        //    }
        //}
    }
}
