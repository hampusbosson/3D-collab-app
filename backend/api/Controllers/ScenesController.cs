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
        var scene = new Scene
        {
            Id = Guid.NewGuid(),
            Name = string.IsNullOrWhiteSpace(dto.Name) ? "Untitled Scene" : dto.Name,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Scenes.Add(scene);
        await _db.SaveChangesAsync();

        var response = new SceneDto
        {
            Id = scene.Id,
            Name = scene.Name,
            CreatedAt = scene.CreatedAt,
            UpdatedAt = scene.UpdatedAt
        };

        return CreatedAtAction(nameof(GetSceneById), new { id = scene.Id }, response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SceneDto>> GetSceneById(Guid id)
    {
        var scene = await _db.Scenes.FirstOrDefaultAsync(s => s.Id == id);

        if (scene == null)
        {
            return NotFound();
        }

        var response = new SceneDto
        {
            Id = scene.Id,
            Name = scene.Name,
            CreatedAt = scene.CreatedAt,
            UpdatedAt = scene.UpdatedAt
        };

        return Ok(response);
    }
}