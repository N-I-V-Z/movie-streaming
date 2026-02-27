using MovieStreaming.Application.Common;
using System.Net;
using System.Text.Json;

namespace MovieStreaming.Api.Middlewares
{
	public class ExceptionMiddleware
	{
		private readonly RequestDelegate _next;
		private readonly ILogger<ExceptionMiddleware> _logger;
		private readonly IHostEnvironment _env;

		public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
		{
			_next = next;
			_logger = logger;
			_env = env;
		}

		public async Task InvokeAsync(HttpContext context)
		{
			try
			{
				await _next(context);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, ex.Message);
				await HandleExceptionAsync(context, ex);
			}
		}

		private async Task HandleExceptionAsync(HttpContext context, Exception exception)
		{
			context.Response.ContentType = "application/json";
			context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

			// Nếu là môi trường Development, ta có thể trả về chi tiết StackTrace để debug
			// Nếu là Production, chỉ trả về một câu thông báo chung chung cho bảo mật
			var response = _env.IsDevelopment()
				? ApiResponse<object>.FailureResult(
					exception.Message,
					new List<string> { exception.StackTrace?.ToString() ?? string.Empty })
				: ApiResponse<object>.FailureResult("Đã xảy ra lỗi hệ thống nghiêm trọng. Vui lòng thử lại sau.");

			var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
			var json = JsonSerializer.Serialize(response, options);

			await context.Response.WriteAsync(json);
		}
	}
}
