namespace MovieStreaming.Application.DTOs
{
	public class MovieCreateDto
	{
		public string Title { get; set; } = string.Empty;
		public string? Description { get; set; }
		public string HlsUrl { get; set; } = string.Empty;
		public string? PosterUrl { get; set; }
	}
}
