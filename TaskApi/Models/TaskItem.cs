namespace TaskApi.Models;

public class TaskItem
{
    public int Id { get; set; }

    // Tên task
    public string Title { get; set; } = default!;

    // Ngày hết hạn
    public DateTime? DueDate { get; set; }

    // Trạng thái: true = Hoàn thành, false = Đang làm
    public bool IsCompleted { get; set; } = false;
}
