using Microsoft.AspNetCore.Http;

namespace MovieStreaming.Application.DTOs
{
    public class MovieFilterDto : PaginationDto
    {
        public string? Search { get; set; }
    }

    public class MovieUpdateDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class MovieUploadDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public IFormFile File { get; set; } = null!;
    }
}
