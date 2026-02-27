using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using MovieStreaming.Application.DTOs;
using MovieStreaming.Application.Interfaces;

namespace MovieStreaming.Api.Controllers
{
    /// <summary>
    /// API Quản lý danh sách phim và xử lý Video Streaming
    /// </summary>
    public class MoviesController : BaseApiController
    {
        private readonly IMovieService _movieService;

        public MoviesController(IMovieService movieService)
        {
            _movieService = movieService;
        }

        /// <summary>
        /// Lấy danh sách phim có phân trang và tìm kiếm
        /// </summary>
        /// <param name="filter">Bộ lọc tìm kiếm và thông số phân trang</param>
        /// <returns>Danh sách phim đã được phân trang</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] MovieFilterDto filter)
        {
            var result = await _movieService.GetAllAsync(filter);
            return PagedResponse(result, "Lấy danh sách phim thành công.");
        }

        /// <summary>
        /// Lấy chi tiết một bộ phim theo ID
        /// </summary>
        /// <param name="id">Mã định danh của phim</param>
        /// <returns>Thông tin chi tiết phim bao gồm URL HLS và Poster</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var movie = await _movieService.GetByIdAsync(id);
            if (movie == null) return ErrorResponse("Không tìm thấy phim này.", statusCode: 404);

            return OkResponse(movie, "Lấy chi tiết phim thành công.");
        }

        /// <summary>
        /// Tải lên video mới và tự động chuyển đổi sang định dạng HLS (Streaming)
        /// </summary>
        /// <param name="dto">Dữ liệu phim và file video (Hỗ trợ lên đến 1GB)</param>
        /// <param name="ct">Token hủy tác vụ</param>
        /// <returns>Thông tin phim sau khi đã xử lý xong video</returns>
        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] MovieUploadDto dto, CancellationToken ct)
        {
            if (dto.File == null || dto.File.Length == 0) return ErrorResponse("Vui lòng chọn file video.");

            var movie = await _movieService.UploadAsync(dto, ct);
            return OkResponse(movie, "Tải phim và xử lý thành công.");
        }

        /// <summary>
        /// Cập nhật thông tin cơ bản của phim (Tiêu đề, Mô tả)
        /// </summary>
        /// <param name="id">Mã phim cần cập nhật</param>
        /// <param name="dto">Dữ liệu cập nhật mới</param>
        /// <returns>Thông tin phim sau khi cập nhật</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] MovieUpdateDto dto)
        {
            var movie = await _movieService.UpdateAsync(id, dto);
            return OkResponse(movie, "Cập nhật thông tin phim thành công.");
        }

        /// <summary>
        /// Xóa phim và toàn bộ tài nguyên liên quan (Video HLS, Poster)
        /// </summary>
        /// <param name="id">Mã phim cần xóa</param>
        /// <returns>Thông báo kết quả xóa</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _movieService.DeleteAsync(id);
            return OkResponse<object?>(null, "Đã xóa phim và toàn bộ dữ liệu liên quan.");
        }

        /// <summary>
        /// Tải lên hoặc cập nhật ảnh đại diện (Poster) cho phim
        /// </summary>
        /// <param name="id">Mã phim</param>
        /// <param name="file">File ảnh (jpg, png...)</param>
        /// <returns>Thông tin phim kèm URL Poster mới</returns>
        [HttpPost("{id}/poster")]
        public async Task<IActionResult> UploadPoster(int id, IFormFile file)
        {
            if (file == null || file.Length == 0) return ErrorResponse("Vui lòng chọn file ảnh.");

            var movie = await _movieService.UploadPosterAsync(id, file);
            return OkResponse(movie, "Cập nhật ảnh Poster thành công.");
        }
    }
}
