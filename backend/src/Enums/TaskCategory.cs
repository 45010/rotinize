using System.ComponentModel.DataAnnotations;

namespace src.Enums
{
    public enum TaskCategory
    {
        [Display(Name = "Nutrição")]
        Nutrition,
        [Display(Name = "Exercício Físico")]
        Exercise,
        [Display(Name = "Estudo")]
        Study,
        [Display(Name = "Trabalho")]
        Work,
        [Display(Name = "Finanças")]
        Finance,
        [Display(Name = "Casa")]
        House,
        [Display(Name = "Saúde")]
        Health,
        [Display(Name = "Autocuidado")]
        SelfCare,
        [Display(Name = "Social")]
        Social,
        [Display(Name = "Lazer")]
        Leisure,
        [Display(Name = "Outros")]
        Other
    }
}
