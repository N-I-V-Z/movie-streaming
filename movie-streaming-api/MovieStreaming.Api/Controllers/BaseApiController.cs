using Microsoft.AspNetCore.Mvc;
using MovieStreaming.Application.Common;

namespace MovieStreaming.Api.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public abstract class BaseApiController : ControllerBase
	{
		protected IActionResult OkResponse<T>(T data, string message = "Success")
		{
			return Ok(ApiResponse<T>.SuccessResult(data, message));
		}

		protected IActionResult ErrorResponse(string message, List<string>? errors = null, int statusCode = 400)
		{
			var response = ApiResponse<object>.FailureResult(message, errors);
			return StatusCode(statusCode, response);
		}

		protected IActionResult PagedResponse<T>(PagedResult<T> pagedResult, string message = "Success")
		{
			return Ok(ApiResponse<PagedResult<T>>.SuccessResult(pagedResult, message));
		}
	}
}
