using Microsoft.EntityFrameworkCore;
using TaskApi.Data;
using TaskApi.Models;
using System.Linq.Expressions;

namespace TaskApi.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _db;

    public TaskRepository(AppDbContext db) => _db = db;

    public async Task<TaskItem?> GetByIdAsync(int id) =>
        await _db.Tasks.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id);

    public async Task<IReadOnlyList<TaskItem>> ListAsync(Expression<Func<TaskItem, bool>>? predicate = null)
    {
        IQueryable<TaskItem> query = _db.Tasks.AsNoTracking();

        if (predicate != null)
            query = query.Where(predicate);

        // Sắp xếp theo ngày hết hạn tăng dần; những task không có DueDate sẽ nằm cuối
        return await query
            .OrderBy(t => t.DueDate ?? DateTime.MaxValue)
            .ToListAsync();
    }

    public async Task AddAsync(TaskItem entity) =>
        await _db.Tasks.AddAsync(entity);

    public void Update(TaskItem entity) =>
        _db.Tasks.Update(entity);

    public void Remove(TaskItem entity) =>
        _db.Tasks.Remove(entity);

    public Task<int> SaveChangesAsync() =>
        _db.SaveChangesAsync();

    public Task<bool> ExistsByTitleAsync(string title) =>
        _db.Tasks.AnyAsync(t => t.Title == title);
}
