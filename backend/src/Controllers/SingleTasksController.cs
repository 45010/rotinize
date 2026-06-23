using Microsoft.AspNetCore.Mvc;
using src.DTOs;
using src.Enums;
using src.Extensions;
using src.Services;

namespace src.Controllers
{
    [Route("api/tasks")]
    [ApiController]
    public class SingleTasksController : ControllerBase
    {
        private readonly ISingleTaskService _singleTaskService;
        private readonly ILogger<SingleTasksController> _logger;

        public SingleTasksController(ISingleTaskService singleTaskService, ILogger<SingleTasksController> logger)
        {
            _singleTaskService = singleTaskService;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ViewTaskSummaryDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllTasks(
            [FromQuery] TaskCategory? category,
            [FromQuery] Status? status,
            [FromQuery] DateTime? startRangeDate,
            [FromQuery] DateTime? endRangeDate)
        {
            int userId = User.GetUserId();
            var tasks = await _singleTaskService.GetAllAsync(userId, category, status, startRangeDate, endRangeDate);
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ViewSingleTaskDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetTaskById(int id)
        {
            int userId = User.GetUserId();
            var task = await _singleTaskService.GetByIdAsync(userId, id);
            if (task == null)
            {
                _logger.LogWarning("Tarefa única com ID: {TaskId} não encontrada.", id);
                return NotFound();
            }
            return Ok(task);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ViewSingleTaskDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateTask([FromBody] CreateSingleTaskDto createDto)
        {
            int userId = User.GetUserId();
            var newTask = await _singleTaskService.CreateAsync(userId, createDto);
            return CreatedAtAction(nameof(GetTaskById), new { id = newTask.Id }, newTask);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ViewSingleTaskDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateSingleTaskDto updateDto)
        {
            int userId = User.GetUserId();
            var updatedTask = await _singleTaskService.UpdateAsync(userId, id, updateDto);
            if (updatedTask == null)
            {
                _logger.LogWarning("Tarefa única com ID: {TaskId} não encontrada para atualização.", id);
                return NotFound();
            }
            return Ok(updatedTask);
        }

        [HttpPut("{id}/status")]
        [ProducesResponseType(typeof(ViewSingleTaskDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateTaskStatus(int id, [FromBody] Status status)
        {
            int userId = User.GetUserId();
            var updatedTask = await _singleTaskService.UpdateStatusAsync(userId, id, status);
            if (updatedTask == null)
            {
                _logger.LogWarning("Tarefa única com ID: {TaskId} não encontrada para atualização.", id);
                return NotFound();
            }
            return Ok(updatedTask);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteTask(int id)
        {
            int userId = User.GetUserId();
            var success = await _singleTaskService.DeleteAsync(userId, id);
            if (!success)
            {
                _logger.LogWarning("Tarefa única com ID: {TaskId} não encontrada para exclusão.", id);
                return NotFound();
            }
            return NoContent();
        }
    }
}
