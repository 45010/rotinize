using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace src.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTablesHabitAndTasks01 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompletedDurationMinutes",
                table: "Task");

            migrationBuilder.DropColumn(
                name: "TargetDurationMinutes",
                table: "Habit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ConclusionDate",
                table: "Task",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "CompletedDuration",
                table: "Task",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "TargetDuration",
                table: "Habit",
                type: "time",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompletedDuration",
                table: "Task");

            migrationBuilder.DropColumn(
                name: "TargetDuration",
                table: "Habit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ConclusionDate",
                table: "Task",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompletedDurationMinutes",
                table: "Task",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TargetDurationMinutes",
                table: "Habit",
                type: "int",
                nullable: true);
        }
    }
}
