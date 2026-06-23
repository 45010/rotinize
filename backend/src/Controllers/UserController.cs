using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using src.Data;
using src.DTOs;
using src.Models;
using System.Security.Claims;

namespace src.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized("Token inválido");

                var usuario = await _context.Usuarios
                    .Where(u => u.Id == userId)
                    .Select(u => new UserProfileDto
                    {
                        Id = u.Id,
                        Nome = u.Nome,
                        Email = u.Email
                    })
                    .FirstOrDefaultAsync();

                if (usuario == null)
                    return NotFound("Usuário não encontrado");

                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized("Token inválido");

                var usuario = await _context.Usuarios.FindAsync(userId);
                if (usuario == null)
                    return NotFound("Usuário não encontrado");

                var emailExists = await _context.Usuarios
                    .AnyAsync(u => u.Email == dto.Email && u.Id != userId);
                
                if (emailExists)
                    return BadRequest("Este email já está em uso por outro usuário");

                usuario.Nome = dto.Nome;
                usuario.Email = dto.Email;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Perfil atualizado com sucesso" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (dto.NovaSenha != dto.ConfirmarNovaSenha)
                    return BadRequest("As senhas não coincidem");

                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized("Token inválido");

                var usuario = await _context.Usuarios.FindAsync(userId);
                if (usuario == null)
                    return NotFound("Usuário não encontrado");

                var passwordHasher = new PasswordHasher<string>();
                var verificationResult = passwordHasher.VerifyHashedPassword(
                    null, usuario.SenhaHash, dto.SenhaAtual);

                if (verificationResult == PasswordVerificationResult.Failed)
                    return BadRequest("Senha atual incorreta");

                var novaSenhaHash = passwordHasher.HashPassword(null, dto.NovaSenha);
                usuario.SenhaHash = novaSenhaHash;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Senha alterada com sucesso" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : null;
        }
    }
}
