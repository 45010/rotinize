using src.Enums;

namespace src.DTOs
{
    public class ViewSingleTaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public TaskCategory Category { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? ConclusionDate { get; set; }
        public Status Status { get; set; }
    }
}
