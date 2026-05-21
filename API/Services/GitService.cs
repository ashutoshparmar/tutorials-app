using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using MyTutorialAPI.Models;

namespace MyTutorialAPI.Services
{
    public class GitService
    {
        private readonly GitSettings _settings;
        private readonly HttpClient _httpClient;

        public GitService(
            IOptions<GitSettings> settings,
            IHttpClientFactory factory)
        {
            _settings = settings.Value;
            _httpClient = factory.CreateClient();

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _settings.Token);

            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("MyTutorialAPI");
        }

        public async Task<string> UpdateJsonFile(string jsonContent)
        {
            var url =
                $"https://api.github.com/repos/{_settings.Owner}/{_settings.Repo}/contents/{_settings.FilePath}";

            // Step 1: Get existing file
            var existingResponse = await _httpClient.GetAsync(url);

            if (!existingResponse.IsSuccessStatusCode)
            {
                return "Failed to fetch file.";
            }

            var existingJson =
                await existingResponse.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(existingJson);

            var sha = doc.RootElement.GetProperty("sha").GetString();

            // Step 2: Encode updated content
            var base64Content =
                Convert.ToBase64String(
                    Encoding.UTF8.GetBytes(jsonContent));

            // Step 3: Prepare payload
            var payload = new
            {
                message = "Updated db.json from API",
                content = base64Content,
                sha = sha,
                branch = _settings.Branch
            };

            var json =
                JsonSerializer.Serialize(payload);

            var body =
                new StringContent(
                    json,
                    Encoding.UTF8,
                    "application/json");

            // Step 4: Update file
            var response =
                await _httpClient.PutAsync(url, body);

            return await response.Content.ReadAsStringAsync();
        }
    }
}