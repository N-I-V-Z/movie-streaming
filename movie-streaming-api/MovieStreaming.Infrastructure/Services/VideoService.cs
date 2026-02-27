using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MovieStreaming.Application.Interfaces;
using System.Diagnostics;

namespace MovieStreaming.Infrastructure.Services
{
    public class VideoService : IVideoService
    {
        private readonly ILogger<VideoService> _logger;

        public VideoService(ILogger<VideoService> logger)
        {
            _logger = logger;
        }

        public async Task<string> ConvertToHlsAsync(string inputPath, string outputFolder, CancellationToken cancellationToken = default)
        {
            if (!Directory.Exists(outputFolder))
            {
                Directory.CreateDirectory(outputFolder);
            }

            string outputM3u8 = Path.Combine(outputFolder, "index.m3u8");

            // Cấu hình FFmpeg: Baseline profile để tương thích nhiều thiết bị, hls_time=10 giây/segment
            string args = $"-i \"{inputPath}\" " +
                          $"-profile:v baseline -level 3.0 " +
                          $"-start_number 0 -hls_time 10 -hls_list_size 0 " +
                          $"-f hls \"{outputM3u8}\"";

            var startInfo = new ProcessStartInfo
            {
                FileName = "ffmpeg",
                Arguments = args,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            _logger.LogInformation("Bắt đầu convert video sang HLS. Input: {InputPath}", inputPath);

            using (var process = new Process { StartInfo = startInfo })
            {
                process.Start();

                // Đọc lỗi FFmpeg song song để không bị tràn buffer
                var errorTask = process.StandardError.ReadToEndAsync();

                try
                {
                    await process.WaitForExitAsync(cancellationToken);

                    if (process.ExitCode != 0)
                    {
                        var error = await errorTask;
                        _logger.LogError("Lỗi FFmpeg (Exit Code {ExitCode}): {Error}", process.ExitCode, error);
                        throw new Exception("Quá trình xử lý video thất bại.");
                    }
                }
                catch (OperationCanceledException)
                {
                    process.Kill();
                    _logger.LogWarning("Quá trình convert video đã bị hủy bởi người dùng.");
                    throw;
                }
            }

            _logger.LogInformation("Convert video thành công: {OutputPath}", outputM3u8);
            return outputM3u8;
        }
    }
}
