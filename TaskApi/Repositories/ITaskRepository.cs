using TaskApi.Models;

namespace TaskApi.Repositories;

public interface ITaskRepository : IRepository<TaskItem>
{
    Task<bool> ExistsByTitleAsync(string title);
}
