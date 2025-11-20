using TaskApi.Dtos;
using TaskApi.Models;
using TaskApi.Repositories;

namespace TaskApi.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _repo;

    public TaskService(ITaskRepository repo) => _repo = repo;

    public async Task<IEnumerable<TaskDto>> GetAllAsync(string? search = null)
    {
        var list = await _repo.ListAsync(
            string.IsNullOrWhiteSpace(search)
                ? null
                : t => t.Title.Contains(search!)
        );

        return list.Select(ToDto);
    }

    public async Task<TaskDto?> GetOneAsync(int id)
    {
        var t = await _repo.GetByIdAsync(id);
        return t is null ? null : ToDto(t);
    }

    public async Task<TaskDto> CreateAsync(CreateTaskDto input)
    {
        if (string.IsNullOrWhiteSpace(input.Title))
            throw new ArgumentException("Title is required");

        if (await _repo.ExistsByTitleAsync(input.Title.Trim()))
            throw new InvalidOperationException("Task already exists");

        var entity = new TaskItem
        {
            Title = input.Title.Trim(),
            DueDate = input.DueDate,
            IsCompleted = false
        };

        await _repo.AddAsync(entity);
        await _repo.SaveChangesAsync();

        return ToDto(entity);
    }

    public async Task<bool> UpdateAsync(int id, UpdateTaskDto input)
    {
        var exists = await _repo.GetByIdAsync(id);
        if (exists is null) return false;

        exists.Title = input.Title.Trim();
        exists.DueDate = input.DueDate;
        exists.IsCompleted = input.IsCompleted;

        _repo.Update(exists);
        await _repo.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var exists = await _repo.GetByIdAsync(id);
        if (exists is null) return false;

        _repo.Remove(exists);
        await _repo.SaveChangesAsync();
        return true;
    }

    private static TaskDto ToDto(TaskItem t) =>
        new TaskDto(t.Id, t.Title, t.DueDate, t.IsCompleted);
}
