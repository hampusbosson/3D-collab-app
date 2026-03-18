namespace api.Models;

public class SceneObject
{
    public Guid Id { get; set; }

    public Guid SceneId { get; set; }

    public string Type { get; set; } = "";   // Cube, Sphere, Cylinder
    public string Name { get; set; } = "";

    public float PositionX { get; set; }
    public float PositionY { get; set; }
    public float PositionZ { get; set; }

    public float RotationX { get; set; }
    public float RotationY { get; set; }
    public float RotationZ { get; set; }

    public float ScaleX { get; set; } = 1;
    public float ScaleY { get; set; } = 1;
    public float ScaleZ { get; set; } = 1;

    public string Color { get; set; } = "#ffffff";

    public string CreatedBy { get; set; } = "";

    public DateTime UpdatedAt { get; set; }

    public Scene? Scene { get; set; }
}