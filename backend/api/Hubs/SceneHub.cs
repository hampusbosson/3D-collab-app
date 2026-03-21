using Microsoft.AspNetCore.SignalR;
using api.RealTime;

namespace api.Hubs;

public class SceneHub : Hub
{
    private readonly PresenceTracker _presenceTracker;

    public SceneHub(PresenceTracker presenceTracker)
    {
        _presenceTracker = presenceTracker;
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
}