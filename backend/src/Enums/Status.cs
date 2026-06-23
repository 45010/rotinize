using System.ComponentModel.DataAnnotations;

namespace src.Enums
{
    public enum Status
    {
        [Display(Name = "Não iniciada")]
        NotStarted,
        [Display(Name = "Em andamento")]
        InProgress,
        [Display(Name = "Concluída")]
        Completed,
        [Display(Name = "Cancelada")]
        Cancelled
    }
}
