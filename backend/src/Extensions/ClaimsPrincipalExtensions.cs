using System.Security.Claims;

namespace src.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static int GetUserId(this ClaimsPrincipal user)
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
            {
                throw new ApplicationException("Usuário não autenticado ou ID de usuário não encontrado no token.");
            }
            return userId;
        }
    }
}
