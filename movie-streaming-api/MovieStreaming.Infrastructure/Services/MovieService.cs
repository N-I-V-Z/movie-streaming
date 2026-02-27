using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using MovieStreaming.Application.Common;
using MovieStreaming.Application.DTOs;
using MovieStreaming.Application.Interfaces;
using MovieStreaming.Domain.Entities;
using MovieStreaming.Infrastructure.Data;

namespace MovieStreaming.Infrastructure.Services
{
    public class MovieService : IMovieService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IVideoService _videoService;

        public MovieService(AppDbContext context, IWebHostEnvironment env, IVideoService videoService)
        {
            _context = context;
            _env = env;
            _videoService = videoService;
        }

        public async Task<PagedResult<Movie>> GetAllAsync(MovieFilterDto filter)
        {
            var query = _context.Movies.AsQueryable();

            if (!string.IsNullOrEmpty(filter.Search))
            {
                query = query.Where(m => m.Title.Contains(filter.Search));
            }

            var totalRecords = await query.CountAsync();
            var movies = await query
                .OrderByDescending(m => m.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PagedResult<Movie>(movies, filter.PageNumber, filter.PageSize, totalRecords);
        }

        public async Task<Movie?> GetByIdAsync(int id)
        {
            return await _context.Movies.FindAsync(id);
        }

        public async Task<Movie> UploadAsync(MovieUploadDto dto, CancellationToken cancellationToken = default)
        {
            string tempFilePath = string.Empty;
            try
            {
                // 1. Lưu file tạm
                tempFilePath = await SaveTempFile(dto.File);

                // 2. Tạo folder output HLS
                var movieFolderName = $"{Path.GetFileNameWithoutExtension(dto.File.FileName).Replace(" ", "_")}_{Guid.NewGuid():N}";
                var outputFolder = Path.Combine(_env.WebRootPath, "movies", movieFolderName);

                // 3. Convert sang HLS
                var absoluteHlsPath = await _videoService.ConvertToHlsAsync(tempFilePath, outputFolder, cancellationToken);
                var hlsUrl = GetUrlFromAbsolutePath(absoluteHlsPath);

                var movie = new Movie
                {
                    Title = dto.Title,
                    Description = dto.Description,
                    HlsUrl = hlsUrl
                };

                _context.Movies.Add(movie);
                await _context.SaveChangesAsync();

                return movie;
            }
            finally
            {
                if (!string.IsNullOrEmpty(tempFilePath) && File.Exists(tempFilePath))
                    File.Delete(tempFilePath);
            }
        }

        public async Task<Movie> UpdateAsync(int id, MovieUpdateDto dto)
        {
            var movie = await GetMovieOrThrow(id);
            movie.Title = dto.Title;
            movie.Description = dto.Description;

            await _context.SaveChangesAsync();
            return movie;
        }

        public async Task DeleteAsync(int id)
        {
            var movie = await GetMovieOrThrow(id);

            // Xóa toàn bộ tài nguyên liên quan
            DeletePhysicalFile(movie.HlsUrl, isFolder: true);
            DeletePhysicalFile(movie.PosterUrl);

            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();
        }

        public async Task<Movie> UploadPosterAsync(int id, IFormFile file)
        {
            var movie = await GetMovieOrThrow(id);

            // Xóa poster cũ nếu có
            DeletePhysicalFile(movie.PosterUrl);

            // Lưu poster mới
            var fileName = $"poster_{id}_{Guid.NewGuid():N}{Path.GetExtension(file.FileName)}";
            var relativePath = Path.Combine("posters", fileName);
            var absolutePath = Path.Combine(_env.WebRootPath, relativePath);

            var folder = Path.GetDirectoryName(absolutePath);
            if (folder != null && !Directory.Exists(folder)) Directory.CreateDirectory(folder);

            using (var stream = new FileStream(absolutePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            movie.PosterUrl = "/" + relativePath.Replace("\\", "/");
            await _context.SaveChangesAsync();

            return movie;
        }

        #region Private Helpers

        private async Task<Movie> GetMovieOrThrow(int id)
        {
            return await _context.Movies.FindAsync(id) ?? throw new KeyNotFoundException($"Không tìm thấy phim có ID: {id}");
        }

        private async Task<string> SaveTempFile(IFormFile file)
        {
            var tempFolder = Path.Combine(_env.ContentRootPath, "TempUploads");
            if (!Directory.Exists(tempFolder)) Directory.CreateDirectory(tempFolder);

            var path = Path.Combine(tempFolder, $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}");
            using var stream = new FileStream(path, FileMode.Create);
            await file.CopyToAsync(stream);
            return path;
        }

        private string GetUrlFromAbsolutePath(string absolutePath)
        {
            return "/" + Path.GetRelativePath(_env.WebRootPath, absolutePath).Replace("\\", "/");
        }

        private void DeletePhysicalFile(string? url, bool isFolder = false)
        {
            if (string.IsNullOrEmpty(url)) return;

            var relativePath = url.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString());
            var absolutePath = Path.Combine(_env.WebRootPath, relativePath);

            if (isFolder)
            {
                var folderPath = Path.GetDirectoryName(absolutePath);
                if (folderPath != null && Directory.Exists(folderPath))
                    Directory.Delete(folderPath, true);
            }
            else
            {
                if (File.Exists(absolutePath))
                    File.Delete(absolutePath);
            }
        }

        #endregion
    }
}
