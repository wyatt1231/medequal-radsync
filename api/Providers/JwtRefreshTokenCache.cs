using radsync_server.Interfaces;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace radsync_server.Providers
{
    public class JwtRefreshTokenCache : IHostedService, IDisposable
    {
        private Timer _timer;
        private readonly IJwtAuthManager jwt_auth_manager;

        public JwtRefreshTokenCache(IJwtAuthManager jwt_auth_manager)
        {
            this.jwt_auth_manager = jwt_auth_manager;
        }

        public Task StartAsync(CancellationToken stoppingToken)
        {
            // remove expired refresh tokens from cache every minute
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromSeconds(1));
            return Task.CompletedTask;
        }

        private void DoWork(object state)
        {
            jwt_auth_manager.RemoveExpiredRefreshTokens(DateTime.Now);
        }

        public Task StopAsync(CancellationToken stoppingToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
