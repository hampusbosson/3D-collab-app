using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Scene> Scenes => Set<Scene>();
    public DbSet<SceneObject> SceneObjects => Set<SceneObject>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Scene>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.Name).IsRequired().HasMaxLength(200);
            entity.Property(s => s.CreatedAt).IsRequired();
            entity.Property(s => s.UpdatedAt).IsRequired();
            entity.HasMany(s => s.Objects)
                .WithOne(o => o.Scene)
                .HasForeignKey(o => o.SceneId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SceneObject>(entity =>
        {
          entity.HasKey(o => o.Id);

          entity.Property(o => o.Type)
              .IsRequired()
              .HasMaxLength(50);

          entity.Property(o => o.Name)
              .IsRequired()
              .HasMaxLength(200);

          entity.Property(o => o.Color)
              .IsRequired()
              .HasMaxLength(20);

          entity.Property(o => o.CreatedBy)
              .HasMaxLength(100);

          entity.Property(o => o.UpdatedAt)
              .IsRequired();
        });
    }
}

