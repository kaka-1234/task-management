using TaskApi.Dtos;

namespace TaskApi.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskDto>> GetAllAsync(string? search = null);
    Task<TaskDto?> GetOneAsync(int id);
    Task<TaskDto> CreateAsync(CreateTaskDto input);
    Task<bool> UpdateAsync(int id, UpdateTaskDto input);
    Task<bool> DeleteAsync(int id);
}
