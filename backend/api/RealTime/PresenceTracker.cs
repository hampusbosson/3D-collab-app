using api.Dtos;

namespace api.RealTime;

public class PresenceTracker
{
    // maps: sceneId -> (ConnectionId -> userName)
    private readonly Dictionary<string, Dictionary<string, PresenceEntry>> _sceneUsers = new();
    private readonly object _lock = new();

    private sealed class PresenceEntry
    {
        public string UserName { get; set; } = "";
        public string? SelectedObjectId { get; set; }
    }

    public void AddUser(string sceneId, string connectionId, string userName)
    {
        lock (_lock)
        {
            if (!_sceneUsers.ContainsKey(sceneId))
            {
                _sceneUsers[sceneId] = new Dictionary<string, PresenceEntry>();
            }

            _sceneUsers[sceneId][connectionId] = new PresenceEntry
            {
                UserName = userName
            };
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

            return users.Values
                .Select(entry => entry.UserName)
                .Distinct()
                .OrderBy(name => name)
                .ToList();
        }
    }

    public void UpdateSelection(string sceneId, string connectionId, string? objectId)
    {
        lock (_lock)
        {
            if (!_sceneUsers.TryGetValue(sceneId, out var users) ||
                !users.TryGetValue(connectionId, out var entry))
            {
                return;
            }

            entry.SelectedObjectId = objectId;
        }
    }

    public List<SceneSelectionDto> GetSelections(string sceneId)
    {
        lock (_lock)
        {
            if (!_sceneUsers.TryGetValue(sceneId, out var users))
            {
                return new List<SceneSelectionDto>();
            }

            return users.Values
                .Where(entry => !string.IsNullOrWhiteSpace(entry.SelectedObjectId))
                .OrderBy(entry => entry.UserName)
                .Select(entry => new SceneSelectionDto
                {
                    UserName = entry.UserName,
                    ObjectId = entry.SelectedObjectId!
                })
                .ToList();
        }
    }

    public bool ClearSelectionsForObject(string sceneId, string objectId)
    {
        lock (_lock)
        {
            if (!_sceneUsers.TryGetValue(sceneId, out var users))
            {
                return false;
            }

            var clearedSelection = false;

            foreach (var entry in users.Values)
            {
                if (entry.SelectedObjectId == objectId)
                {
                    entry.SelectedObjectId = null;
                    clearedSelection = true;
                }
            }

            return clearedSelection;
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

                if (users.TryGetValue(connectionId, out var entry))
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

                    return (sceneId, entry.UserName);
                }
            }

            return null;
        }
    }
}
