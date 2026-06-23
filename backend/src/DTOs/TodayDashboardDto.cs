namespace src.DTOs
{
    public class TodayDashboardDto
    {
        public IEnumerable<ViewHabitTaskDto> HabitTasks { get; set; }
        public IEnumerable<ViewSingleTaskDto> SingleTasks { get; set; }
        public int HabitTasksCompleted { get; set; }
        public int SingleTasksCompleted { get; set; }
        public int HabitTasksTotal { get; set; }
        public int SingleTasksTotal { get; set; }
    }
}
