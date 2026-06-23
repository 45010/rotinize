using System.ComponentModel.DataAnnotations;

namespace src.Enums
{
    public enum MetricType
    {
        [Display(Name = "Sim/Não")]
        YesNo,
        [Display(Name = "Quantidade")]
        Quantity,
        [Display(Name = "Duração")]
        Time
    }
}
