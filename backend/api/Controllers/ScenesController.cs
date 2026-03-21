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
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Objects = new List<SceneObject>
            {
                CreateStarterCube(now)
            }
        };

        _db.Scenes.Add(scene);
        await _db.SaveChangesAsync();

        var response = SceneToDTO(scene);
        return CreatedAtAction(nameof(GetSceneById), new { id = scene.Id }, response);
    }

    [HttpPost("{sceneId:guid}/objects")]
    public async Task<ActionResult<SceneObjectDto>> CreateSceneObject(Guid sceneId, CreateSceneObjectDto objectDto)
    {
        var sceneExists = await _db.Scenes.AnyAsync(s => s.Id == sceneId);

        if (!sceneExists)
        {
            return NotFound();
        }

        var sceneObject = new SceneObject
        {
            Id = Guid.NewGuid(),
            SceneId = sceneId,
            Type = objectDto.Type,
            Name = string.IsNullOrWhiteSpace(objectDto.Name) ? objectDto.Type : objectDto.Name,

            PositionX = objectDto.PositionX,
            PositionY = objectDto.PositionY,
            PositionZ = objectDto.PositionZ,

            RotationX = objectDto.RotationX,
            RotationY = objectDto.RotationY,
            RotationZ = objectDto.RotationZ,

            ScaleX = objectDto.ScaleX,
            ScaleY = objectDto.ScaleY,
            ScaleZ = objectDto.ScaleZ,

            Color = string.IsNullOrWhiteSpace(objectDto.Color) ? "#ffffff" : objectDto.Color,
            Opacity = objectDto.Opacity,
            CreatedBy = "Hampus",
            UpdatedAt = DateTime.UtcNow
        };

        _db.SceneObjects.Add(sceneObject);
        await _db.SaveChangesAsync();

        return Ok(SceneObjectToDto(sceneObject));
    }

    [HttpPut("{sceneId:guid}")]
    public async Task<ActionResult<SceneDto>> updateScene(Guid sceneId, [FromBody] UpdateSceneDto dto)
    {
        var scene = await _db.Scenes.FirstOrDefaultAsync(s => s.Id == sceneId);

        if (scene == null)
        {
            return NotFound();
        }

        scene.Name = dto.Name;
        scene.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(SceneToDTO(scene));
    }

    [HttpPut("{sceneId:guid}/objects/{objectId:guid}")]
    public async Task<ActionResult<SceneObjectDto>> UpdateSceneObject(Guid sceneId, Guid objectId, [FromBody] UpdateSceneObjectDto dto)
    {
        var sceneObject = await _db.SceneObjects.FirstOrDefaultAsync(o => o.Id == objectId && o.SceneId == sceneId);

        if (sceneObject == null)
        {
            return NotFound();
        }

        sceneObject.Type = dto.Type;
        sceneObject.Name = string.IsNullOrWhiteSpace(dto.Name) ? dto.Type : dto.Name;

        sceneObject.PositionX = dto.PositionX;
        sceneObject.PositionY = dto.PositionY;
        sceneObject.PositionZ = dto.PositionZ;

        sceneObject.RotationX = dto.RotationX;
        sceneObject.RotationY = dto.RotationY;
        sceneObject.RotationZ = dto.RotationZ;

        sceneObject.ScaleX = dto.ScaleX;
        sceneObject.ScaleY = dto.ScaleY;
        sceneObject.ScaleZ = dto.ScaleZ;

        sceneObject.Color = string.IsNullOrWhiteSpace(dto.Color) ? "#ffffff" : dto.Color;
        sceneObject.Opacity = dto.Opacity;

        sceneObject.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(SceneObjectToDto(sceneObject));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SceneDto>>> GetScenes()
    {
        return await _db.Scenes.AsNoTracking().OrderByDescending(s => s.UpdatedAt).Select(x => SceneToDTO(x)).ToListAsync();
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SceneDto>> GetSceneById(Guid id)
    {
        var scene = await _db.Scenes.AsNoTracking().Include(s => s.Objects).FirstOrDefaultAsync(s => s.Id == id);

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

    [HttpDelete("{sceneId:guid}/objects/{objectId:guid}")]
    public async Task<IActionResult> DeleteSceneObject(Guid sceneId, Guid objectId)
    {
        var sceneObject = await _db.SceneObjects.FirstOrDefaultAsync(o => o.Id == objectId && o.SceneId == sceneId);

        if (sceneObject == null)
        {
            return NotFound();
        }

        _db.SceneObjects.Remove(sceneObject);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    private static SceneDto SceneToDTO(Scene scene) => new SceneDto
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
