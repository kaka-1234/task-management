using Microsoft.AspNetCore.Mvc;
using TaskApi.Dtos;
using TaskApi.Services;

namespace TaskApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _service;
    public TasksController(ITaskService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskDto>>> GetAll([FromQuery] string? search = null)
        => Ok(await _service.GetAllAsync(search));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskDto>> GetOne(int id)
    {
        var dto = await _service.GetOneAsync(id);
        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<TaskDto>> Create([FromBody] CreateTaskDto input)
    {
        try
        {
            var dto = await _service.CreateAsync(input);
            return CreatedAtAction(nameof(GetOne), new { id = dto.Id }, dto);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTaskDto input)
    {
        var ok = await _service.UpdateAsync(id, input);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
