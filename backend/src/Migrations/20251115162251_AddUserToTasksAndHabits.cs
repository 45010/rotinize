using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace src.Migrations
{
    /// <inheritdoc />
    public partial class AddUserToTasksAndHabits : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "QuantityUnit",
                table: "Task",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SingleTask_Description",
                table: "Task",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "TargetDuration",
                table: "Task",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TargetQuantity",
                table: "Task",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Task",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Habit",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Task_UserId",
                table: "Task",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Habit_UserId",
                table: "Habit",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Habit_Usuario_UserId",
                table: "Habit",
                column: "UserId",
                principalTable: "Usuario",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_Task_Usuario_UserId",
                table: "Task",
                column: "UserId",
                principalTable: "Usuario",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Habit_Usuario_UserId",
                table: "Habit");

            migrationBuilder.DropForeignKey(
                name: "FK_Task_Usuario_UserId",
                table: "Task");

            migrationBuilder.DropIndex(
                name: "IX_Task_UserId",
                table: "Task");

            migrationBuilder.DropIndex(
                name: "IX_Habit_UserId",
                table: "Habit");

            migrationBuilder.DropColumn(
                name: "QuantityUnit",
                table: "Task");

            migrationBuilder.DropColumn(
                name: "SingleTask_Description",
                table: "Task");

            migrationBuilder.DropColumn(
                name: "TargetDuration",
                table: "Task");

            migrationBuilder.DropColumn(
                name: "TargetQuantity",
                table: "Task");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Task");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Habit");
        }
    }
}
