using Microsoft.AspNetCore.SignalR;
using api.RealTime;
using api.Data;
using api.Dtos;
using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Hubs;

public class SceneHub : Hub
{
    private readonly PresenceTracker _presenceTracker;
    private readonly AppDbContext _db;

    public SceneHub(PresenceTracker presenceTracker, AppDbContext db)
    {
        _presenceTracker = presenceTracker;
        _db = db;
    }

    public async Task JoinScene(string sceneId, string userName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, sceneId);

        _presenceTracker.AddUser(sceneId, Context.ConnectionId, userName);

        var users = _presenceTracker.GetUsers(sceneId);

        await Clients.Groups(sceneId).SendAsync("PresenceUpdated", users);
    }

    public async Task LeaveScene(string sceneId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, sceneId);

        var removed = _presenceTracker.RemoveConnection(Context.ConnectionId);

        if (removed != null)
        {
            var users = _presenceTracker.GetUsers(sceneId);
            await Clients.Group(sceneId).SendAsync("PresenceUpdated", users);
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var removed = _presenceTracker.RemoveConnection(Context.ConnectionId);

        if (removed is { } result)
        {
            var (sceneId, _) = result;
            var users = _presenceTracker.GetUsers(sceneId);
            await Clients.Group(sceneId).SendAsync("PresenceUpdated", users);
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task UpdateObject(string sceneId, string objectId, UpdateSceneObjectDto dto)
    {
        if (!Guid.TryParse(sceneId, out var sceneGuid) || !Guid.TryParse(objectId, out var objectGuid))
        {
            return;
        }

        var sceneObject = await _db.SceneObjects
            .FirstOrDefaultAsync(o => o.Id == objectGuid && o.SceneId == sceneGuid);

        if (sceneObject == null)
        {
            return;
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

        var response = SceneObjectToDto(sceneObject);

        await Clients.Group(sceneId).SendAsync("ObjectUpdated", response);
    }

    public async Task AddObject(string sceneId, CreateSceneObjectDto dto)
    {
        if (!Guid.TryParse(sceneId, out var sceneGuid))
        {
            return;
        }

        var sceneExists = await _db.Scenes.AnyAsync(s => s.Id == sceneGuid);
        if (!sceneExists)
        {
            return;
        }

        var sceneObject = new SceneObject
        {
            Id = Guid.NewGuid(),
            SceneId = sceneGuid,
            Type = dto.Type,
            Name = string.IsNullOrWhiteSpace(dto.Name) ? dto.Type : dto.Name,

            PositionX = dto.PositionX,
            PositionY = dto.PositionY,
            PositionZ = dto.PositionZ,

            RotationX = dto.RotationX,
            RotationY = dto.RotationY,
            RotationZ = dto.RotationZ,

            ScaleX = dto.ScaleX,
            ScaleY = dto.ScaleY,
            ScaleZ = dto.ScaleZ,

            Color = string.IsNullOrWhiteSpace(dto.Color) ? "#ffffff" : dto.Color,
            Opacity = dto.Opacity,
            CreatedBy = "system",
            UpdatedAt = DateTime.UtcNow
        };

        _db.SceneObjects.Add(sceneObject);
        await _db.SaveChangesAsync();

        var response = SceneObjectToDto(sceneObject);

        await Clients.Group(sceneId).SendAsync("ObjectAdded", response);
    }

    public async Task DeleteObject(string sceneId, string objectId)
    {
        if (!Guid.TryParse(sceneId, out var sceneGuid) ||
            !Guid.TryParse(objectId, out var objectGuid))
        {
            return;
        }

        var sceneObject = await _db.SceneObjects
            .FirstOrDefaultAsync(o => o.Id == objectGuid && o.SceneId == sceneGuid);

        if (sceneObject == null)
        {
            return;
        }

        _db.SceneObjects.Remove(sceneObject);
        await _db.SaveChangesAsync();

        await Clients.Group(sceneId).SendAsync("ObjectDeleted", objectId);
    }


    /**
    ** REFACTOR THIS AND THE OTHER MAPPERS IN SCENESCONTROLLER TO BE UNDER THEIR OWN FOLDER/FILE
    */
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