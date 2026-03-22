using api.Data;
using api.Dtos;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ScenesController : ControllerBase
{
    private readonly AppDbContext _db;

    public ScenesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<ActionResult<SceneDto>> CreateScene(CreateSceneDto dto)
    {
        var now = DateTime.UtcNow;

        var scene = new Scene
        {
            Id = Guid.NewGuid(),
            Name = string.IsNullOrWhiteSpace(dto.Name) ? "Untitled Scene" : dto.Name,
            CreatedAt = now,
            UpdatedAt = now,
            Objects = new List<SceneObject>
            {
                CreateStarterCube(now)
            }
        };

        _db.Scenes.Add(scene);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSceneById), new { id = scene.Id }, SceneToDto(scene));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SceneDto>>> GetScenes()
    {
        var scenes = await _db.Scenes
            .AsNoTracking()
            .OrderByDescending(s => s.UpdatedAt)
            .Select(s => SceneToDto(s))
            .ToListAsync();

        return Ok(scenes);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SceneDetailsDto>> GetSceneById(Guid id)
    {
        var scene = await _db.Scenes
            .AsNoTracking()
            .Include(s => s.Objects)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (scene == null)
        {
            return NotFound();
        }

        var response = new SceneDetailsDto
        {
            Id = scene.Id,
            Name = scene.Name,
            CreatedAt = scene.CreatedAt,
            UpdatedAt = scene.UpdatedAt,
            Objects = scene.Objects.Select(SceneObjectToDto).ToList()
        };

        return Ok(response);
    }

    [HttpPut("{sceneId:guid}")]
    public async Task<ActionResult<SceneDto>> UpdateScene(Guid sceneId, [FromBody] UpdateSceneDto dto)
    {
        var scene = await _db.Scenes.FirstOrDefaultAsync(s => s.Id == sceneId);

        if (scene == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrWhiteSpace(dto.Name))
        {
            scene.Name = dto.Name;
        }

        scene.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(SceneToDto(scene));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteScene(Guid id)
    {
        var scene = await _db.Scenes.FindAsync(id);

        if (scene == null)
        {
            return NotFound();
        }

        _db.Scenes.Remove(scene);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    private static SceneDto SceneToDto(Scene scene) => new SceneDto
    {
        Id = scene.Id,
        Name = scene.Name,
        CreatedAt = scene.CreatedAt,
        UpdatedAt = scene.UpdatedAt
    };

    private static SceneObjectDto SceneObjectToDto(SceneObject obj) => new SceneObjectDto
    {
        Id = obj.Id,
        SceneId = obj.SceneId,
        Type = obj.Type,
        Name = obj.Name,
        PositionX = obj.PositionX,
        PositionY = obj.PositionY,
        PositionZ = obj.PositionZ,
        RotationX = obj.RotationX,
        RotationY = obj.RotationY,
        RotationZ = obj.RotationZ,
        ScaleX = obj.ScaleX,
        ScaleY = obj.ScaleY,
        ScaleZ = obj.ScaleZ,
        Color = obj.Color,
        Opacity = obj.Opacity,
        CreatedBy = obj.CreatedBy,
        UpdatedAt = obj.UpdatedAt
    };

    private static SceneObject CreateStarterCube(DateTime now)
    {
        return new SceneObject
        {
            Id = Guid.NewGuid(),
            Type = "Cube",
            Name = "Cube",
            PositionX = 0f,
            PositionY = 0.7f,
            PositionZ = 0f,
            RotationX = 0f,
            RotationY = 0f,
            RotationZ = 0f,
            ScaleX = 1f,
            ScaleY = 1f,
            ScaleZ = 1f,
            Color = "#fb923c",
            Opacity = 1f,
            CreatedBy = "system",
            UpdatedAt = now
        };
    }
}