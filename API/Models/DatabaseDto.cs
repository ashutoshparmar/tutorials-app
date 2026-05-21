using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MyTutorialAPI.Models
{
    public class DatabaseDto
    {
        [Required]
        [JsonPropertyName("users")]
        public List<UserDto> Users { get; set; } = new();

        [Required]
        [JsonPropertyName("courses")]
        public List<CourseDto> Courses { get; set; } = new();
    }

    public class UserDto
    {
        [Required]
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("role")]
        public string Role { get; set; } = string.Empty; // "admin" or "readonly"

        [Required]
        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;
    }

    public class CourseDto
    {
        [Required]
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("topics")]
        public List<TopicDto> Topics { get; set; } = new();
    }

    public class TopicDto
    {
        [Required]
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("content")]
        public string Content { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("example")]
        public string Example { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("questions")]
        public List<InterviewQuestionDto> Questions { get; set; } = new();
    }

    public class InterviewQuestionDto
    {
        [Required]
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("question")]
        public string Question { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("answer")]
        public string Answer { get; set; } = string.Empty;
    }
}
