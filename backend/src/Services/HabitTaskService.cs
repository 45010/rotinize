using src.DTOs;
using src.Enums;
using src.Models;
using src.Repositories;

namespace src.Services
{
    public class HabitTaskService(IHabitTaskRepository habitTaskRepository) : IHabitTaskService
    {
        private readonly IHabitTaskRepository _habitTaskRepository = habitTaskRepository;

        public async Task<IEnumerable<ViewHabitTaskDto>> GetAllAsync(int userId, TaskCategory? category, Status? status, DateTime? startRangeDate, DateTime? endRangeDate, int? habitId)
        {
            var tasks = await _habitTaskRepository.GetAllAsync(userId, category, status, startRangeDate, endRangeDate, habitId);
            return tasks.Select(t => MapToViewHabitTaskDto(t));
        }

        public async Task<IEnumerable<ViewHabitTaskDto>> GetAllByHabitAsync(int userId, int habitId)
        {
            var tasksByHabit = await _habitTaskRepository.GetTasksByHabitIdAsync(userId, habitId);
            return tasksByHabit.Select(t => MapToViewHabitTaskDto(t));

        }

        public async Task<ViewHabitTaskDto> GetByIdAsync(int userId, int id)
        {
            var task = await _habitTaskRepository.GetByIdAsync(userId, id) ??
                throw new KeyNotFoundException($"Tarefa com ID {id} não encontrada ou você não tem permissão para acessá-la.");
            return MapToViewHabitTaskDto(task);
        }

        public async Task<IEnumerable<ViewHabitTaskDto>> GetTasksForDateAsync(int userId, DateTime date)
        {
            var tasks = await _habitTaskRepository.GetTasksForDateAsync(userId, date);
            return tasks.Select(t => MapToViewHabitTaskDto(t));
        }

        public async Task<ViewHabitTaskDto> UpdateStatusAsync(int userId, int id, UpdateStatusHabitTaskDto completeDto)
        {
            var taskToUpdate = await _habitTaskRepository.GetByIdAsync(userId, id) ??
                throw new KeyNotFoundException($"Tarefa com ID {id} não encontrada ou você não tem permissão para acessá-la.");

            if (taskToUpdate.Habit.MetricType == MetricType.Quantity)
            {
                if (completeDto.CompletedQuantity == null || completeDto.CompletedQuantity <= 0)
                    throw new ArgumentException("CompletedQuantity deve ser um valor positivo.");

                taskToUpdate.CompletedQuantity = completeDto.CompletedQuantity.Value;

                if (taskToUpdate.CompletedQuantity >= taskToUpdate.Habit.TargetQuantity)
                {
                    taskToUpdate.Status = Status.Completed;
                    taskToUpdate.ConclusionDate = DateTime.UtcNow;
                }
                else if (taskToUpdate.CompletedQuantity > 0)
                {
                    taskToUpdate.Status = Status.InProgress;
                }
                else
                {
                    taskToUpdate.Status = Status.NotStarted;
                }
            }

            else if (taskToUpdate.Habit.MetricType == MetricType.Time)
            {
                if (completeDto.CompletedDuration == null || completeDto.CompletedDuration <= TimeSpan.Zero)
                    throw new ArgumentException("CompletedDuration deve ser um valor positivo.");

                taskToUpdate.CompletedDuration = completeDto.CompletedDuration.Value;

                if (taskToUpdate.CompletedDuration >= taskToUpdate.Habit.TargetDuration)
                {
                    taskToUpdate.Status = Status.Completed;
                    taskToUpdate.ConclusionDate = DateTime.UtcNow;
                }
                else if (taskToUpdate.CompletedDuration > TimeSpan.Zero)
                {
                    taskToUpdate.Status = Status.InProgress;
                }
                else
                {
                    taskToUpdate.Status = Status.NotStarted;
                }
            }

            else if (taskToUpdate.Habit.MetricType == MetricType.YesNo)
            {
                taskToUpdate.Status = completeDto.Status;
                if (taskToUpdate.Status == Status.Completed)
                    taskToUpdate.ConclusionDate = DateTime.UtcNow;
            }

            else
            {
                throw new InvalidOperationException("Tipo de métrica do hábito desconhecido.");
            }

            await _habitTaskRepository.SaveChangesAsync();
            return MapToViewHabitTaskDto(taskToUpdate);

        }

        // ====================== MÉTODOS AUXILIARES ======================

        private static ViewHabitTaskDto MapToViewHabitTaskDto(HabitTask task)
        {
            return new ViewHabitTaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Category = task.Category,
                DueDate = task.DueDate,
                ConclusionDate = task.ConclusionDate,
                Status = task.Status,
                CompletedQuantity = task.CompletedQuantity,
                CompletedDuration = task.CompletedDuration,
                HabitId = task.HabitId,
                HabitName = task.Habit?.Name,
                MetricType = task.Habit.MetricType,
                TargetQuantity = task.Habit.TargetQuantity,
                QuantityUnit = task.Habit.QuantityUnit,
                TargetDuration = task.Habit.TargetDuration
            };
        }
    }
}