using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace src.Enums
{
    public enum DayOption
    {
        [Display(Name = "Domingo")]
        Sunday = 0,
        [Display(Name = "Segunda")]
        Monday = 1,
        [Display(Name = "Terça")]
        Tuesday = 2,
        [Display(Name = "Quarta")]
        Wednesday = 3,
        [Display(Name = "Quinta")]
        Thursday = 4,
        [Display(Name = "Sexta")]
        Friday = 5,
        [Display(Name = "Sábado")]
        Saturday = 6
    }
}
