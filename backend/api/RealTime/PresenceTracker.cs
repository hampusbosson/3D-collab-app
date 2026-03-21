namespace api.RealTime;

public class PresenceTracker
{

    // maps: sceneId -> (ConnectionId -> userName)
    private readonly Dictionary<string, Dictionary<string, string>> _sceneUsers = new();

    public void AddUser(string sceneId, string connectionId, string userName)
    {
        if (!_sceneUsers.ContainsKey(sceneId))
        {
            _sceneUsers[sceneId] = new Dictionary<string, string>();
        }

        _sceneUsers[sceneId][connectionId] = userName;
    }

    public List<string> GetUsers(string sceneId)
    {
        if (!_sceneUsers.TryGetValue(sceneId, out var users))
        {
            return new List<string>();
        }

        return users.Values.Distinct().OrderBy(name => name).ToList();
    }

    public (string sceneId, string userName)? RemoveConnection(string connectionId)
    {
        foreach (var sceneEntry in _sceneUsers)
        {
            var sceneId = sceneEntry.Key;
            var users = sceneEntry.Value;

            if (users.TryGetValue(connectionId, out var userName))
            {
                users.Remove(connectionId);

                if (users.Count == 0)
                {
                    _sceneUsers.Remove(sceneId);
                }

                return (sceneId, userName);
            }
        }

        return null;
    }
}