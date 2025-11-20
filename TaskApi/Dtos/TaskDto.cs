namespace TaskApi.Dtos;

// DTO trả về cho client (Response DTO)
public record TaskDto(
    int Id,
    string Title,
    DateTime? DueDate,
    bool IsCompleted
);

// DTO dùng khi tạo mới (POST)
public class CreateTaskDto
{
    public string Title { get; set; } = default!;
    public DateTime? DueDate { get; set; }
}

// DTO dùng khi cập nhật (PUT)
public class UpdateTaskDto
{
    public string Title { get; set; } = default!;
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; }
}
