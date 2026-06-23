using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using src.Data;
using src.DTOs;
using src.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace src.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UsuarioRegisterDto dto)
        {
            if (!ModelState.IsValid || dto == null || string.IsNullOrWhiteSpace(dto.Senha))
            {
                return BadRequest("Dados inválidos.");
            }

            var existingUser = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (existingUser != null)
            {
                return BadRequest("Este email já está cadastrado.");
            }

            var senhaHash = new PasswordHasher<string>().HashPassword(null, dto.Senha);

            var usuario = new Usuario
            {
                Nome = dto.Nome,
                Email = dto.Email,
                SenhaHash = senhaHash
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok("Usuário registrado com sucesso!");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioLoginDto dto)
        {
            if (!ModelState.IsValid || dto == null)
            {
                return BadRequest("Dados inválidos.");
            }

            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (usuario == null) return Unauthorized("Usuário não encontrado.");

            var resultado = new PasswordHasher<string>().VerifyHashedPassword(null, usuario.SenhaHash, dto.Senha);
            if (resultado == PasswordVerificationResult.Failed) return Unauthorized("Senha incorreta.");

            var token = GerarToken(usuario);
            return Ok(new { token });
        }

        private string GerarToken(Usuario usuario)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email)
            };

            var issuer = _config["Jwt:Issuer"] ?? "rotinize";
            var audience = _config["Jwt:Audience"] ?? issuer;
            var keyString = _config["Jwt:Key"];
            if (string.IsNullOrWhiteSpace(keyString))
            {
                throw new InvalidOperationException("JWT Key (Jwt:Key) is not configured.");
            }
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
