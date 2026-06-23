using Microsoft.AspNetCore.Mvc;
using src.DTOs;
using src.Enums;
using src.Services;
using src.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace src.Controllers
{
    [Route("api/habits")]
    [ApiController]
    [Authorize]
    public class HabitsController : ControllerBase
    {
        private readonly IHabitService _habitService;
        private readonly ILogger<HabitsController> _logger;
        
        public HabitsController(IHabitService habitService, ILogger<HabitsController> logger)
        {
            _habitService = habitService;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ViewHabitSummaryDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllHabits([FromQuery] bool? isActive, [FromQuery] TaskCategory? category)
        {
            int userId = User.GetUserId();
            var habits = await _habitService.GetAllSummariesAsync(userId, isActive, category);
            return Ok(habits);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ViewHabitDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetHabitById(int id)
        {
            int userId = User.GetUserId();
            var habit = await _habitService.GetByIdAsync(userId, id);

            if (habit == null)
            {
                _logger.LogWarning("Hábito com ID: {HabitId} não encontrado.", id);
                return NotFound();
            }

            return Ok(habit);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ViewHabitDetailDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateHabit([FromBody] CreateHabitDto createDto)
        {
            int userId = User.GetUserId();
            var newHabit = await _habitService.CreateAsync(userId, createDto);
            return CreatedAtAction(nameof(GetHabitById), new { id = newHabit.Id }, newHabit);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ViewHabitDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateHabit(int id, [FromBody] UpdateHabitDto updateDto)
        {
            int userId = User.GetUserId();
            var updatedHabit = await _habitService.UpdateAsync(userId, id, updateDto);

            if (updatedHabit == null)
            {
                return NotFound();
            }

            return Ok(updatedHabit);
        }

        [HttpPut("{id}/active")]
        [ProducesResponseType(typeof(ViewHabitDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateActive(int id, [FromBody] bool active)
        {
            int userId = User.GetUserId();
            var habit = await _habitService.UpdateActiveAsync(userId, id, active);

            if (habit == null)
            {
                return NotFound();
            }

            return Ok(habit);
        }


        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteHabit(int id)
        {
            int userId = User.GetUserId();
            var success = await _habitService.DeleteAsync(userId, id);

            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
