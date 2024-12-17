using Api.Context;

using radsync_server.Config;

using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;

namespace radsync_server.Services
{
    public class ConfigServices : IServices
    {
        public void InstallServices(IServiceCollection services, IConfiguration configuration)
        {
            services.AddAutoMapper(typeof(Startup));


            services.AddCors(options => options.AddPolicy("ApiCorsPolicy", builder =>
            {
                builder.WithOrigins("http://192.168.0.104:3000", "http://192.168.0.104:44302", "http:localhost:3000").AllowAnyMethod().AllowAnyHeader();
            }));


            //    services.AddControllers().AddJsonOptions(options =>
            //options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

            services.AddControllers().AddNewtonsoftJson(options =>
                                    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                );



            services.AddMvc(options =>
            {
                options.MaxModelBindingCollectionSize = int.MaxValue;
            });

            services.Configure<FormOptions>(options =>
            {
                options.ValueCountLimit = int.MaxValue;
            });


            services.AddSwaggerGen(swagger =>
            {
                //This is to generate the Default UI of Swagger Documentation    
                swagger.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Radsync REST API",
                    Description = ""
                });
                // To Enable authorization using Swagger (JWT)    
                swagger.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter 'Bearer' [space] and then your valid token in the text input below.\r\n\r\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\"",
                });
                swagger.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                          new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                            },
                            new string[] { }

                    }
                });
            });
            //services.AddSwaggerGenNewtonsoftSupport();
            services.AddSignalR();


            string connectionString = configuration.GetConnectionString(Constants.MYSQL_CONNECTION);
            services.AddScoped(_ => new MySqlDbContext(connectionString));



        }
    }
}
