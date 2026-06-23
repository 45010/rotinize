using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using src.Data;
using src.Models;

namespace src.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PomodoroController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PomodoroController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("start")]
        public async Task<ActionResult<PomodoroSession>> StartSession([FromBody] StartPomodoroRequest request)
        {
            var activeSession = await _context.PomodoroSessions
                .FirstOrDefaultAsync(s => s.UserId == request.UserId && s.IsActive);
            
            if (activeSession != null)
            {
                activeSession.IsActive = false;
                activeSession.EndTime = DateTime.UtcNow;
            }
            var session = new PomodoroSession
            {
                UserId = request.UserId,
                Flow = request.Flow,
                CurrentPhase = PomodoroPhase.Focus,
                StartTime = DateTime.UtcNow,
                RemainingSeconds = GetPhaseDuration(request.Flow, PomodoroPhase.Focus)
            };

            _context.PomodoroSessions.Add(session);
            await _context.SaveChangesAsync();

            return Ok(session);
        }

        [HttpPost("pause/{sessionId}")]
        public async Task<ActionResult> PauseSession(int sessionId)
        {
            var session = await _context.PomodoroSessions.FindAsync(sessionId);
            if (session == null || !session.IsActive)
                return NotFound("Sessão não encontrada ou inativa");

            var elapsed = (int)(DateTime.UtcNow - session.StartTime).TotalSeconds;
            session.RemainingSeconds = Math.Max(0, session.RemainingSeconds - elapsed);

            await _context.SaveChangesAsync();
            return Ok(new { message = "Sessão pausada", remainingSeconds = session.RemainingSeconds });
        }

        [HttpPost("resume/{sessionId}")]
        public async Task<ActionResult> ResumeSession(int sessionId)
        {
            var session = await _context.PomodoroSessions.FindAsync(sessionId);
            if (session == null || !session.IsActive)
                return NotFound("Sessão não encontrada ou inativa");

            session.StartTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Sessão retomada", remainingSeconds = session.RemainingSeconds });
        }

        [HttpPost("complete-phase/{sessionId}")]
        public async Task<ActionResult<PomodoroSession>> CompletePhase(int sessionId)
        {
            var session = await _context.PomodoroSessions.FindAsync(sessionId);
            if (session == null || !session.IsActive)
                return NotFound("Sessão não encontrada ou inativa");

            if (session.CurrentPhase == PomodoroPhase.Focus)
            {
                session.FocusCount++;
            }

            var nextPhase = GetNextPhase(session);
            session.CurrentPhase = nextPhase;
            session.RemainingSeconds = GetPhaseDuration(session.Flow, nextPhase);
            session.StartTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(session);
        }

        [HttpPost("stop/{sessionId}")]
        public async Task<ActionResult> StopSession(int sessionId)
        {
            var session = await _context.PomodoroSessions.FindAsync(sessionId);
            if (session == null || !session.IsActive)
                return NotFound("Sessão não encontrada ou inativa");

            session.IsActive = false;
            session.EndTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Sessão finalizada" });
        }

        [HttpGet("status/{sessionId}")]
        public async Task<ActionResult<PomodoroStatus>> GetSessionStatus(int sessionId)
        {
            var session = await _context.PomodoroSessions.FindAsync(sessionId);
            if (session == null)
                return NotFound("Sessão não encontrada");

            if (!session.IsActive)
                return Ok(new PomodoroStatus { IsActive = false, Message = "Sessão inativa" });

            var elapsed = (int)(DateTime.UtcNow - session.StartTime).TotalSeconds;
            var remaining = Math.Max(0, session.RemainingSeconds - elapsed);

            return Ok(new PomodoroStatus
            {
                IsActive = true,
                CurrentPhase = session.CurrentPhase,
                RemainingSeconds = remaining,
                FocusCount = session.FocusCount,
                Flow = session.Flow
            });
        }

        [HttpGet("history/{userId}")]
        public async Task<ActionResult<List<PomodoroSession>>> GetUserHistory(string userId)
        {
            var sessions = await _context.PomodoroSessions
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.CreatedAt)
                .Take(50)
                .ToListAsync();

            return Ok(sessions);
        }

        private int GetPhaseDuration(PomodoroFlow flow, PomodoroPhase phase)
        {
            return phase switch
            {
                PomodoroPhase.Focus => flow == PomodoroFlow.Flow1 ? 25 * 60 : 50 * 60,
                PomodoroPhase.ShortBreak => flow == PomodoroFlow.Flow1 ? 5 * 60 : 10 * 60,
                PomodoroPhase.LongBreak => 15 * 60,
                _ => 0
            };
        }

        private PomodoroPhase GetNextPhase(PomodoroSession session)
        {
            if (session.CurrentPhase == PomodoroPhase.Focus)
            {
                if (session.FocusCount >= 2)
                {
                    return PomodoroPhase.LongBreak;
                }
                else
                {
                    return PomodoroPhase.ShortBreak;
                }
            }
            else
            {
                return PomodoroPhase.Focus;
            }
        }
    }

    public class StartPomodoroRequest
    {
        public string UserId { get; set; } = string.Empty;
        public PomodoroFlow Flow { get; set; }
    }

    public class PomodoroStatus
    {
        public bool IsActive { get; set; }
        public PomodoroPhase? CurrentPhase { get; set; }
        public int RemainingSeconds { get; set; }
        public int FocusCount { get; set; }
        public PomodoroFlow? Flow { get; set; }
        public string? Message { get; set; }
    }
}
