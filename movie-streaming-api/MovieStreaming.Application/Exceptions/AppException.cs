using System.Net;

namespace MovieStreaming.Application.Exceptions
{
    /// <summary>
    /// Exception tùy chỉnh cho các lỗi nghiệp vụ (Business Logic)
    /// </summary>
    public class AppException : Exception
    {
        public HttpStatusCode StatusCode { get; }

        public AppException(string message, HttpStatusCode statusCode = HttpStatusCode.BadRequest) 
            : base(message)
        {
            StatusCode = statusCode;
        }
    }
}
