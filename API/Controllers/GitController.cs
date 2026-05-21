using Microsoft.AspNetCore.Mvc;
using MyTutorialAPI.Models;
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
            [FromBody] DatabaseDto data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var json =
                System.Text.Json.JsonSerializer.Serialize(data);

            var result =
                await _gitService.UpdateJsonFile(json);

            return Ok(new { message = "Database updated successfully!", details = result });
        }
    }
}