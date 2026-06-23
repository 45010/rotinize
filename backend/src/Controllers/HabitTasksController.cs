using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using src.DTOs;
using src.Enums;
using src.Extensions;
using src.Services;

namespace src.Controllers
{
    [Route("api/habit-tasks")]
    [ApiController]
    [Authorize]
    public class HabitTasksController : ControllerBase
    {
        private readonly IHabitTaskService _habitTaskService;
        private readonly ILogger<HabitTasksController> _logger;

        public HabitTasksController(IHabitTaskService habitTaskService, ILogger<HabitTasksController> logger)
        {
            _habitTaskService = habitTaskService;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ViewTaskSummaryDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllTasks(
            [FromQuery] TaskCategory? category,
            [FromQuery] Status? status,
            [FromQuery] DateTime? startRangeDate,
            [FromQuery] DateTime? endRangeDate,
            [FromQuery] int? habitId)
        {
            int userId = User.GetUserId();
            var tasks = await _habitTaskService.GetAllAsync(userId, category, status, startRangeDate, endRangeDate, habitId);
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ViewHabitTaskDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetTaskById(int id)
        {
            int userId = User.GetUserId();
            var task = await _habitTaskService.GetByIdAsync(userId, id);
            if (task == null)
            {
                _logger.LogWarning("Tarefa de hábito com ID: {TaskId} não encontrada.", id);
                return NotFound();
            }
            return Ok(task);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ViewHabitTaskDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateStatusHabitTaskDto updateDto)
        {
            int userId = User.GetUserId();
            var updatedTask = await _habitTaskService.UpdateStatusAsync(userId, id, updateDto);
            if (updatedTask == null)
            {
                _logger.LogWarning("Tarefa de hábito com ID: {TaskId} não encontrada para atualização.", id);
                return NotFound();
            }
            return Ok(updatedTask);
        }

        [HttpGet("/api/habits/{habitId}/tasks")]
        [ProducesResponseType(typeof(IEnumerable<ViewTaskSummaryDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTasksByHabitId(int habitId)
        {
            int userId = User.GetUserId();
            var tasks = await _habitTaskService.GetAllByHabitAsync(userId, habitId);
            return Ok(tasks);
        }
    }
}
