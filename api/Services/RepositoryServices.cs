using Api.Context;

using radsync_server.Config;
using radsync_server.Interfaces;
using radsync_server.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace radsync_server.Services
{
    public class RepositoryServices : IServices
    {
        public void InstallServices(IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IStudyRepository, StudyRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IConfigRepository, ConfigRepository>();
            services.AddScoped<ILibraryRepository, LibraryRepository>();

        }
    }
}
