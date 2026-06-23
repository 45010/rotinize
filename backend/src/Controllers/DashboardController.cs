using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using src.DTOs;
using src.Extensions;
using src.Enums;
using src.Services;
using System.Linq;
using System.Threading.Tasks;

namespace src.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IHabitTaskService _habitTaskService;
        private readonly ISingleTaskService _singleTaskService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(
            IHabitTaskService habitTaskService,
            ISingleTaskService singleTaskService,
            ILogger<DashboardController> logger)
        {
            _habitTaskService = habitTaskService;
            _singleTaskService = singleTaskService;
            _logger = logger;
        }

        [HttpGet("today")]
        [ProducesResponseType(typeof(TodayDashboardDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTodayDashboard()
        {
            var userId = User.GetUserId();

            var today = DateTime.Today;

            _logger.LogInformation("Buscando dashboard de hoje para UserId: {UserId}", userId);

            var habitTasks = await _habitTaskService.GetTasksForDateAsync(userId, today);
            var singleTasks = await _singleTaskService.GetTasksForDateAsync(userId, today);

            int habitsCompleted = habitTasks.Count(t => t.Status == Status.Completed);
            int singlesCompleted = singleTasks.Count(t => t.Status == Status.Completed);

            var dashboardDto = new TodayDashboardDto
            {
                HabitTasks = habitTasks,
                SingleTasks = singleTasks,
                HabitTasksCompleted = habitsCompleted,
                HabitTasksTotal = habitTasks.Count(),
                SingleTasksCompleted = singlesCompleted,
                SingleTasksTotal = singleTasks.Count()
            };

            return Ok(dashboardDto);
        }
    }
}