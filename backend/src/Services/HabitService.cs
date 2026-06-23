using Microsoft.AspNetCore.JsonPatch;
using src.DTOs;
using src.Enums;
using src.Extensions;
using src.Models;
using src.Repositories;
using System.ComponentModel.DataAnnotations;

namespace src.Services
{
    public class HabitService : IHabitService
    {
        private readonly IHabitRepository _habitRepository;
        private readonly IHabitTaskGeneratorService _habitTaskGenerator;
        private readonly ILogger<HabitTaskGeneratorService> _logger;

        public HabitService(
            IHabitRepository habitRepository,
            IHabitTaskGeneratorService habitTaskGenerator,
            ILogger<HabitTaskGeneratorService> logger)
        {
            _habitRepository = habitRepository;
            _habitTaskGenerator = habitTaskGenerator;
            _logger = logger;
        }

        public async Task<ViewHabitDetailDto> CreateAsync(int userId, CreateHabitDto createDto)
        {

            var newHabit = new Habit
            {
                UserId = userId,
                Name = createDto.Name,
                Description = createDto.Description,
                Category = createDto.Category,
                IsActive = IsHabitActive(createDto.StartDate, createDto.EndDate),
                StartDate = createDto.StartDate,
                EndDate = createDto.EndDate,
                RecurrenceType = createDto.RecurrenceType,
                SpecificDays = createDto.SpecificDays,
                Frequency = createDto.Frequency,
                MetricType = createDto.MetricType,
                TargetQuantity = createDto.TargetQuantity,
                QuantityUnit = createDto.QuantityUnit,
                TargetDuration = createDto.TargetDuration,
                CurrentStreak = 0,
                LongestStreak = 0
            };

            await _habitRepository.AddAsync(newHabit);
            await _habitRepository.SaveChangesAsync();

            try
            {
                var today = DateTime.Now.Date;
                await _habitTaskGenerator.GenerateTaskForSpecificHabitAsync(newHabit, today);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao gerar tarefa inicial para o hábito {HabitId}", newHabit.Id);
            }

            return MapToViewHabitDetailDto(newHabit);
        }

        public async Task<bool> DeleteAsync(int userId, int id)
        {
            var habitToDelete = await _habitRepository.GetByIdAsync(userId, id) ?? 
                throw new KeyNotFoundException($"Hábito com ID {id} não encontrado ou você não tem permissão para acessá-lo.");

            _habitRepository.Delete(habitToDelete);
            return await _habitRepository.SaveChangesAsync();
        }

        public async Task<IEnumerable<ViewHabitSummaryDto>> GetAllSummariesAsync(int userId, bool? isActive, TaskCategory? category)
        {
            var habits = await _habitRepository.GetAllAsync(userId, isActive, category);
            return habits.Select(habit => MapToViewHabitSummaryDto(habit));
        }

        public async Task<ViewHabitDetailDto> GetByIdAsync(int userId, int id)
        {
            var habit = await _habitRepository.GetByIdAsync(userId, id) ??
                throw new KeyNotFoundException($"Hábito com ID {id} não encontrado ou você não tem permissão para acessá-lo.");

            return MapToViewHabitDetailDto(habit);
        }

        public async Task<ViewHabitDetailDto> UpdateAsync(int userId, int id, UpdateHabitDto updateDto)
        {
            var habitToUpdate = await _habitRepository.GetByIdAsync(userId, id) ??
                throw new KeyNotFoundException($"Hábito com ID {id} não encontrado ou você não tem permissão para acessá-lo.");

            habitToUpdate.Name = updateDto.Name;
            habitToUpdate.Description = updateDto.Description;
            habitToUpdate.EndDate = updateDto.EndDate;
            habitToUpdate.RecurrenceType = updateDto.RecurrenceType;
            habitToUpdate.SpecificDays = updateDto.SpecificDays;
            habitToUpdate.Frequency = updateDto.Frequency;
            habitToUpdate.MetricType = updateDto.MetricType;
            habitToUpdate.TargetQuantity = updateDto.TargetQuantity;
            habitToUpdate.QuantityUnit = updateDto.QuantityUnit;
            habitToUpdate.TargetDuration = updateDto.TargetDuration;
            habitToUpdate.IsActive = IsHabitActive(habitToUpdate.StartDate, updateDto.EndDate);

            await _habitRepository.SaveChangesAsync();

            try
            {
                var today = DateTime.Now.Date;
                await _habitTaskGenerator.GenerateTaskForSpecificHabitAsync(habitToUpdate, today);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao gerar tarefa inicial após atualizar o hábito {HabitId}", habitToUpdate.Id);
            }

            return MapToViewHabitDetailDto(habitToUpdate);
        }

        public async Task<ViewHabitDetailDto> UpdateActiveAsync(int userId, int id, bool active)
        {
            var habit = await _habitRepository.GetByIdAsync(userId, id) ??
                throw new KeyNotFoundException($"Hábito com ID {id} não encontrado ou você não tem permissão para acessá-lo.");

            habit.IsActive = active;
            habit.EndDate = !active ? DateTime.Now : null;

            await _habitRepository.SaveChangesAsync();
            return MapToViewHabitDetailDto(habit);
        }

        // ====================== MÉTODOS AUXILIARES ======================
        private ViewHabitDetailDto MapToViewHabitDetailDto(Habit habit)
        {
            return new ViewHabitDetailDto
            {
                Id = habit.Id,
                Name = habit.Name,
                Description = habit.Description,
                Category = habit.Category,
                IsActive = habit.IsActive,
                StartDate = habit.StartDate,
                EndDate = habit.EndDate,
                RecurrenceType = habit.RecurrenceType,
                SpecificDays = habit.SpecificDays,
                Frequency = habit.Frequency,
                MetricType = habit.MetricType,
                TargetQuantity = habit.TargetQuantity,
                QuantityUnit = habit.QuantityUnit,
                TargetDuration = habit.TargetDuration,
                CurrentStreak = habit.CurrentStreak,
                LongestStreak = habit.LongestStreak
            };
        }

        private ViewHabitSummaryDto MapToViewHabitSummaryDto(Habit habit)
        {
            return new ViewHabitSummaryDto
            {
                Id = habit.Id,
                Name = habit.Name,
                GoalSummary = GenerateGoalSummary(habit),
                Category = habit.Category,
                IsActive = habit.IsActive,
                CurrentStreak = habit.CurrentStreak
            };
        }

        private string GenerateGoalSummary(Habit habit)
        {
            List<String> daysNames = [];
            if (habit.RecurrenceType == RecurrenceType.SpecificDaysOfWeek)
            {
                foreach (DayOption day in habit.SpecificDays)
                {
                    daysNames.Add(day.GetDisplayName().ToLower());
                }
            }

            String recurrencePart = habit.RecurrenceType switch
            {
                RecurrenceType.Daily => $"{habit.Frequency}x/dia",
                RecurrenceType.Weekly => $"{habit.Frequency}x/semana",
                RecurrenceType.Monthly => $"{habit.Frequency}x/mês",
                RecurrenceType.Yearly => $"{habit.Frequency}x/ano",
                RecurrenceType.SpecificDaysOfWeek => $"nos dias {string.Join(", ", daysNames)}",
                _ => ""
            };

            String metricPart = habit.MetricType switch
            {
                MetricType.Quantity => $"{habit.TargetQuantity} {habit.QuantityUnit} ",
                MetricType.Time => $"{habit.TargetDuration} ",
                _ => ""
            };

            return metricPart + recurrencePart;
        }

        private bool IsHabitActive(DateTime startDate, DateTime? endDate)
        {
            var today = DateTime.UtcNow;
            if (startDate > today)
                return false;
            if (endDate.HasValue && endDate.Value < today)
                return false;
            return true;
        }
    }
}
