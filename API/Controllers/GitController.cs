using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using MyTutorialAPI.Services;

namespace MyTutorialAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GitController : ControllerBase
    {
        private readonly GitService _gitService;

        public GitController(GitService gitService)
        {
            _gitService = gitService;
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateJson(
            [FromBody] JsonElement data)
        {
            if (data.ValueKind != JsonValueKind.Object ||
                !data.TryGetProperty("users", out var users) || users.ValueKind != JsonValueKind.Array ||
                !data.TryGetProperty("courses", out var courses) || courses.ValueKind != JsonValueKind.Array)
            {
                return BadRequest("Uploaded database must contain 'users' and 'courses' arrays.");
            }

            var json = JsonSerializer.Serialize(
                data,
                new JsonSerializerOptions
                {
                    WriteIndented = true
                }
            );

            var result =
                await _gitService.UpdateJsonFile(json);

            return Ok(new { message = "Database updated successfully!", details = result });
        }
    }
}