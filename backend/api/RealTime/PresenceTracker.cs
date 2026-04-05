namespace api.RealTime;

public class PresenceTracker
{
    // maps: sceneId -> (ConnectionId -> userName)
    private readonly Dictionary<string, Dictionary<string, string>> _sceneUsers = new();
    private readonly Lock _lock = new();

    public void AddUser(string sceneId, string connectionId, string userName)
    {
        lock (_lock)
        {
            if (!_sceneUsers.ContainsKey(sceneId))
            {
                _sceneUsers[sceneId] = new Dictionary<string, string>();
            }

            _sceneUsers[sceneId][connectionId] = userName;
        }
    }

    public List<string> GetUsers(string sceneId)
    {
        lock (_lock)
        {
            if (!_sceneUsers.TryGetValue(sceneId, out var users))
            {
                return new List<string>();
            }

            return users.Values.Distinct().OrderBy(name => name).ToList();
        }
    }

    public (string sceneId, string userName)? RemoveConnection(string connectionId)
    {
        lock (_lock)
        {
            string? emptySceneId = null;

            foreach (var sceneEntry in _sceneUsers)
            {
                var sceneId = sceneEntry.Key;
                var users = sceneEntry.Value;

                if (users.TryGetValue(connectionId, out var userName))
                {
                    users.Remove(connectionId);

                    if (users.Count == 0)
                    {
                        emptySceneId = sceneId;
                    }

                    if (emptySceneId != null)
                    {
                        _sceneUsers.Remove(emptySceneId);
                    }

                    return (sceneId, userName);
                }
            }

            return null;
        }
    }
}
