namespace api.Dtos;

public class SceneDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<SceneObjectDto> PreviewObjects { get; set; } = new();
}
