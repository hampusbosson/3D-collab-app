namespace api.Models;

public class Scene
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<SceneObject> Objects { get; set; } = new();
}