using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MovieStreaming.Application.Interfaces;
using MovieStreaming.Infrastructure.Data;
using MovieStreaming.Infrastructure.Services;

namespace MovieStreaming.Infrastructure
{
	public static class DependencyInjection
	{
		public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
		{
			services.AddDbContext<AppDbContext>(options =>
				options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

			services.AddScoped<IVideoService, VideoService>();

			return services;
		}
	}
}
