using System.ComponentModel.DataAnnotations;

namespace src.Enums
{
    public enum RecurrenceType
    {
        [Display(Name = "Dias específicos da semana")]
        SpecificDaysOfWeek,
        [Display(Name = "Diariamente")]
        Daily,
        [Display(Name = "Semanalmente")]
        Weekly,
        [Display(Name = "Mensalmente")]
        Monthly,
        [Display(Name = "Anualmente")]
        Yearly
    }
}
