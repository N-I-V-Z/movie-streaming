using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieStreaming.Application.Common;
using MovieStreaming.Application.Interfaces;
using MovieStreaming.Domain.Entities;
using MovieStreaming.Infrastructure.Data;

namespace MovieStreaming.Api.Controllers
{
	public class MoviesController : BaseApiController
	{
		private readonly AppDbContext _context;
		private readonly IWebHostEnvironment _env;
		private readonly IVideoService _videoService;

		public MoviesController(AppDbContext context, IWebHostEnvironment env, IVideoService videoService)
		{
			_context = context;
			_env = env;
			_videoService = videoService;
		}

		[HttpGet]
		public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
		{
			// Validate input
			if (pageNumber < 1) pageNumber = 1;
			if (pageSize < 1) pageSize = 10;
			if (pageSize > 50) pageSize = 50; // Giới hạn tối đa để tránh request quá lớn

			// 1. Lấy tổng số bản ghi
			var totalRecords = await _context.Movies.CountAsync();

			// 2. Query phân trang (Skip và Take)
			var movies = await _context.Movies
				.OrderByDescending(m => m.CreatedAt)
				.Skip((pageNumber - 1) * pageSize)
				.Take(pageSize)
				.ToListAsync();

			// 3. Đóng gói vào PagedResult
			var pagedResult = new PagedResult<Movie>(movies, pageNumber, pageSize, totalRecords);

			return PagedResponse(pagedResult, "Lấy danh sách phim thành công.");
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetById(int id)
		{
			var movie = await _context.Movies.FindAsync(id);
			if (movie == null) return ErrorResponse("Không tìm thấy phim này.", statusCode: 404);

			return OkResponse(movie, "Lấy chi tiết phim thành công.");
		}

		[HttpPost("upload")]
		public async Task<IActionResult> Upload(IFormFile file, [FromForm] string title, [FromForm] string? description)
		{
			if (file == null || file.Length == 0) return ErrorResponse("Vui lòng chọn file video.");

			var tempFolder = Path.Combine(_env.ContentRootPath, "TempUploads");
			if (!Directory.Exists(tempFolder)) Directory.CreateDirectory(tempFolder);

			var tempFilePath = Path.Combine(tempFolder, Guid.NewGuid().ToString() + Path.GetExtension(file.FileName));

			using (var stream = new FileStream(tempFilePath, FileMode.Create))
			{
				await file.CopyToAsync(stream);
			}

			try
			{
				var movieFolderName = Path.GetFileNameWithoutExtension(file.FileName).Replace(" ", "_");
				var outputFolder = Path.Combine(_env.WebRootPath, "movies", movieFolderName);

				var absoluteHlsPath = await _videoService.ConvertToHlsAsync(tempFilePath, outputFolder);

				var hlsUrl = "/" + Path.GetRelativePath(_env.WebRootPath, absoluteHlsPath).Replace("\\", "/");

				var movie = new Movie
				{
					Title = title,
					Description = description,
					HlsUrl = hlsUrl
				};

				_context.Movies.Add(movie);
				await _context.SaveChangesAsync();

				if (System.IO.File.Exists(tempFilePath))
					System.IO.File.Delete(tempFilePath);

				return OkResponse(movie, "Tải phim và xử lý thành công.");
			}
			catch (Exception ex)
			{
				return ErrorResponse($"Lỗi xử lý video: {ex.Message}", statusCode: 500);
			}
		}
	}
}
