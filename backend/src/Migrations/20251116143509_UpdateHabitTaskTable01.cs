using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace src.Migrations
{
    /// <inheritdoc />
    public partial class UpdateHabitTaskTable01 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QuantityUnit",
                table: "Task");

            migrationBuilder.DropColumn(
                name: "TargetDuration",
                table: "Task");

            migrationBuilder.DropColumn(
                name: "TargetQuantity",
                table: "Task");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "QuantityUnit",
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
        }
    }
}
