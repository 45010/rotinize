using Microsoft.EntityFrameworkCore;
using src.Models;

namespace src.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Usuario> Usuarios { get; set; }

        public DbSet<Habit> Habits { get; set; }
        public DbSet<AppTask> Tasks { get; set; }
        public DbSet<PomodoroSession> PomodoroSessions { get; set; }
        public DbSet<ReminderTask> ReminderTasks { get; set; }
    
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<AppTask>()
                .HasDiscriminator<string>("TaskType")
                .HasValue<SingleTask>("SingleTask")
                .HasValue<HabitTask>("HabitTask");
        }
    }
}
