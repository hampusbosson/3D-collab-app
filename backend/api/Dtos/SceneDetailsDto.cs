namespace api.Dtos;

public class SceneDetailsDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public List<SceneObjectDto> Objects { get; set; } = new();
}