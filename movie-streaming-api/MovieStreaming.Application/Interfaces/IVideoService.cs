namespace MovieStreaming.Application.Interfaces
{
	    public interface IVideoService
	    {
	        Task<string> ConvertToHlsAsync(string inputPath, string outputFolder, CancellationToken cancellationToken = default);
	    }
	
}
