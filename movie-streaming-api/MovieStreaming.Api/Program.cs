using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.OpenApi;
using MovieStreaming.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure Kestrel
builder.WebHost.ConfigureKestrel(options =>
{
	options.Limits.MaxRequestBodySize = 1024 * 1024 * 1024; // 1GB
});

// 2. Add Infrastructure Services (Includes DB and Video Service)
builder.Services.AddInfrastructure(builder.Configuration);

// 3. Add UI/API Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
	c.SwaggerDoc("v1", new OpenApiInfo { Title = "Movie Streaming API", Version = "v1" });
});

builder.Services.Configure<FormOptions>(options =>
{
	options.MultipartBodyLengthLimit = 1024 * 1024 * 1024; // 1GB
});

builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowAll", policy =>
	{
		policy.AllowAnyOrigin()
			  .AllowAnyMethod()
			  .AllowAnyHeader();
	});
});

var app = builder.Build();

// 4. Pipeline Configuration
app.UseMiddleware<MovieStreaming.Api.Middlewares.ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI(c =>
	{
		c.SwaggerEndpoint("/swagger/v1/swagger.json", "Movie Streaming API V1");
		c.RoutePrefix = "swagger";
	});
}

app.UseCors("AllowAll");

var provider = new FileExtensionContentTypeProvider();
provider.Mappings[".m3u8"] = "application/x-mpegURL";
provider.Mappings[".ts"] = "video/MP2T";

app.UseStaticFiles(new StaticFileOptions
{
	ContentTypeProvider = provider
});

app.UseAuthorization();
app.MapControllers();

app.Run();
