using MovieStreaming.Application.Common;
using MovieStreaming.Application.DTOs;
using MovieStreaming.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace MovieStreaming.Application.Interfaces
{
    public interface IMovieService
    {
        Task<PagedResult<Movie>> GetAllAsync(MovieFilterDto filter);
        Task<Movie?> GetByIdAsync(int id);
        Task<Movie> UploadAsync(MovieUploadDto dto, CancellationToken cancellationToken = default);
        Task<Movie> UpdateAsync(int id, MovieUpdateDto dto);
        Task DeleteAsync(int id);
    }
}
