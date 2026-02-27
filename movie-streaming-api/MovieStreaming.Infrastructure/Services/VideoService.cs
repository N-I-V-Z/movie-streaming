using Microsoft.Extensions.Hosting;
using MovieStreaming.Application.Interfaces;
using System.Diagnostics;

namespace MovieStreaming.Infrastructure.Services
{
	public class VideoService : IVideoService
	{
		private readonly IHostEnvironment _env;

		public VideoService(IHostEnvironment env)
		{
			_env = env;
		}

		public async Task<string> ConvertToHlsAsync(string inputPath, string outputFolder)
		{
			if (!Directory.Exists(outputFolder))
			{
				Directory.CreateDirectory(outputFolder);
			}

			string outputM3u8 = Path.Combine(outputFolder, "index.m3u8");
			string args = $"-i \"{inputPath}\" -profile:v baseline -level 3.0 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls \"{outputM3u8}\"";

			var startInfo = new ProcessStartInfo
			{
				FileName = "ffmpeg",
				Arguments = args,
				RedirectStandardOutput = true,
				RedirectStandardError = true,
				UseShellExecute = false,
				CreateNoWindow = true
			};

			using (var process = new Process { StartInfo = startInfo })
			{
				process.Start();
				string error = await process.StandardError.ReadToEndAsync();
				await process.WaitForExitAsync();

				if (process.ExitCode != 0)
				{
					throw new Exception($"FFmpeg Error: {error}");
				}
			}

			// Lưu ý: Cần xử lý logic lấy đường dẫn tương đối phù hợp với wwwroot ở tầng API
			return outputM3u8;
		}
	}
}
