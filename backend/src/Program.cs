using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using src.BackgroundServices;
using src.Data;
using src.Repositories;
using src.Services;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));   
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var issuer = builder.Configuration["Jwt:Issuer"] ?? "rotinize";
        var audience = builder.Configuration["Jwt:Audience"] ?? issuer;
        var key = builder.Configuration["Jwt:Key"];

        if (string.IsNullOrWhiteSpace(key))
        {
            throw new InvalidOperationException("JWT Key (Jwt:Key) is not configured.");
        }

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    });


builder.Services.AddScoped<NotificationService>();
builder.Services.AddHostedService<ReminderBackgroundService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin() 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
    // options.AddPolicy("AllowReactApp", policy =>
    // {
    //     policy.SetIsOriginAllowed(origin =>
    //     {
    //         if (origin.StartsWith("http://localhost")) return true;
    //         if (origin.Contains(":8081")) return true;
    //         if (origin.Contains(":19")) return true;
    //         return false;
    //     })
    //     .AllowAnyHeader()
    //     .AllowAnyMethod();
    // });
});

// Camada de Repositório (Data Access Layer)
builder.Services.AddScoped<IHabitRepository, HabitRepository>();
builder.Services.AddScoped<ISingleTaskRepository, SingleTaskRepository>();
builder.Services.AddScoped<IHabitTaskRepository, HabitTaskRepository>();

// Camada de Serviço (Business Logic Layer)
builder.Services.AddScoped<IHabitService, HabitService>();
builder.Services.AddScoped<ISingleTaskService, SingleTaskService>();
builder.Services.AddScoped<IHabitTaskService, HabitTaskService>();
builder.Services.AddScoped<IHabitTaskGeneratorService, HabitTaskGeneratorService>();
builder.Services.AddHostedService<HabitTaskScheduler>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowReactApp");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
