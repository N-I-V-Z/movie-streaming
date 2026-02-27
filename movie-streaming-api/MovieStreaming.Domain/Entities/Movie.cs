using System.ComponentModel.DataAnnotations;

namespace MovieStreaming.Domain.Entities
{
	public class Movie
	{
		[Key]
		public int Id { get; set; }

		[Required]
		[MaxLength(200)]
		public string Title { get; set; } = string.Empty;

		public string? Description { get; set; }

		[Required]
		public string HlsUrl { get; set; } = string.Empty;

		public string? PosterUrl { get; set; }

		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	}
}
