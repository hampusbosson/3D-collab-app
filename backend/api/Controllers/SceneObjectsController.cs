using api.Data;
using api.Dtos;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

[ApiController]
[Route("api/scenes/{sceneId:guid}/objects")]
public class SceneObjectsController : ControllerBase
{
    private readonly AppDbContext _db;

    public SceneObjectsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<ActionResult<SceneObjectDto>> CreateSceneObject(Guid sceneId, CreateSceneObjectDto dto)
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
            CreatedBy = "system",
            UpdatedAt = DateTime.UtcNow
        };

        ApplyUpdateDto(sceneObject, dto);

        _db.SceneObjects.Add(sceneObject);
        await _db.SaveChangesAsync();

        return Ok(SceneObjectToDto(sceneObject));
    }

    [HttpPut("{objectId:guid}")]
    public async Task<ActionResult<SceneObjectDto>> UpdateSceneObject(
        Guid sceneId,
        Guid objectId,
        [FromBody] UpdateSceneObjectDto dto)
    {
        var sceneObject = await _db.SceneObjects
            .FirstOrDefaultAsync(o => o.Id == objectId && o.SceneId == sceneId);

        if (sceneObject == null)
        {
            return NotFound();
        }

        ApplyUpdateDto(sceneObject, dto);
        sceneObject.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(SceneObjectToDto(sceneObject));
    }

    [HttpDelete("{objectId:guid}")]
    public async Task<IActionResult> DeleteSceneObject(Guid sceneId, Guid objectId)
    {
        var sceneObject = await _db.SceneObjects
            .FirstOrDefaultAsync(o => o.Id == objectId && o.SceneId == sceneId);

        if (sceneObject == null)
        {
            return NotFound();
        }

        _db.SceneObjects.Remove(sceneObject);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    private static void ApplyUpdateDto(SceneObject sceneObject, CreateSceneObjectDto dto)
    {
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
    }

    private static void ApplyUpdateDto(SceneObject sceneObject, UpdateSceneObjectDto dto)
    {
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
    }

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
}