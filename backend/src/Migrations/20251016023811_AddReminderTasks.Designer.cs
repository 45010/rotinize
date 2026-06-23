using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using src.Data;

#nullable disable

namespace src.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20251016023811_AddReminderTasks")]
    partial class AddReminderTasks
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.9")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("src.Models.AppTask", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("Category")
                        .HasColumnType("int");

                    b.Property<DateTime>("ConclusionDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("DueDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<string>("TaskType")
                        .IsRequired()
                        .HasMaxLength(13)
                        .HasColumnType("nvarchar(13)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Task");

                    b.HasDiscriminator<string>("TaskType").HasValue("AppTask");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("src.Models.Habit", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("Category")
                        .HasColumnType("int");

                    b.Property<int>("CurrentStreak")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("EndDate")
                        .HasColumnType("datetime2");

                    b.Property<int?>("Frequency")
                        .HasColumnType("int");

                    b.Property<bool>("IsActive")
                        .HasColumnType("bit");

                    b.Property<int>("LongestStreak")
                        .HasColumnType("int");

                    b.Property<int>("MetricType")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("QuantityUnit")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("RecurrenceType")
                        .HasColumnType("int");

                    b.PrimitiveCollection<string>("SpecificDays")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime2");

                    b.Property<int?>("TargetDurationMinutes")
                        .HasColumnType("int");

                    b.Property<int?>("TargetQuantity")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Habit");
                });

            modelBuilder.Entity("src.Models.PomodoroSession", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("CurrentPhase")
                        .HasColumnType("int");

                    b.Property<DateTime?>("EndTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("Flow")
                        .HasColumnType("int");

                    b.Property<int>("FocusCount")
                        .HasColumnType("int");

                    b.Property<bool>("IsActive")
                        .HasColumnType("bit");

                    b.Property<int>("RemainingSeconds")
                        .HasColumnType("int");

                    b.Property<DateTime>("StartTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("PomodoroSessions");
                });

            modelBuilder.Entity("src.Models.ReminderTask", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime?>("CompletedAt")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<DateTime?>("EndDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("Frequency")
                        .HasColumnType("int");

                    b.Property<bool>("IsActive")
                        .HasColumnType("bit");

                    b.Property<DateTime?>("LastNotificationSent")
                        .HasColumnType("datetime2");

                    b.Property<int>("NotificationCount")
                        .HasColumnType("int");

                    b.Property<bool>("Notify1HourBefore")
                        .HasColumnType("bit");

                    b.Property<bool>("Notify30MinutesAfter")
                        .HasColumnType("bit");

                    b.Property<bool>("Notify30MinutesBefore")
                        .HasColumnType("bit");

                    b.Property<bool>("Notify5MinutesBefore")
                        .HasColumnType("bit");

                    b.Property<int?>("RecurrenceInterval")
                        .HasColumnType("int");

                    b.Property<DateTime>("ScheduledDateTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("SpecificDays")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("ReminderTasks");
                });

            modelBuilder.Entity("src.Models.HabitTask", b =>
                {
                    b.HasBaseType("src.Models.AppTask");

                    b.Property<int?>("CompletedDurationMinutes")
                        .HasColumnType("int");

                    b.Property<int?>("CompletedQuantity")
                        .HasColumnType("int");

                    b.Property<int>("HabitId")
                        .HasColumnType("int");

                    b.HasIndex("HabitId");

                    b.ToTable("Task");

                    b.HasDiscriminator().HasValue("HabitTask");
                });

            modelBuilder.Entity("src.Models.SingleTask", b =>
                {
                    b.HasBaseType("src.Models.AppTask");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.ToTable("Task");

                    b.HasDiscriminator().HasValue("SingleTask");
                });

            modelBuilder.Entity("src.Models.HabitTask", b =>
                {
                    b.HasOne("src.Models.Habit", "Habit")
                        .WithMany()
                        .HasForeignKey("HabitId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Habit");
                });
#pragma warning restore 612, 618
        }
    }
}
