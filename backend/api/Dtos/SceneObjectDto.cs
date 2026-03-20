namespace api.Dtos;

public class SceneObjectDto
{
    public Guid Id { get; set; }
    public Guid SceneId { get; set; }

    public string Type { get; set; } = "";
    public string Name { get; set; } = "";

    public float PositionX { get; set; }
    public float PositionY { get; set; }
    public float PositionZ { get; set; }

    public float RotationX { get; set; }
    public float RotationY { get; set; }
    public float RotationZ { get; set; }

    public float ScaleX { get; set; }
    public float ScaleY { get; set; }
    public float ScaleZ { get; set; }
    public string Color { get; set; } = "";
    public float Opacity { get; set; }
    public string CreatedBy { get; set; } = "";
    public DateTime UpdatedAt { get; set; }
}