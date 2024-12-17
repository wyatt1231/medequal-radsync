using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace radsync_server.Services
{
    interface IServices
    {
        //TO REGISTER ALL SERVICES (IMPORTANT)
        void InstallServices(IServiceCollection services, IConfiguration configuration);
    }
}
