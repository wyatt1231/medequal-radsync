using radsync_server.Config;
using radsync_server.Interfaces;
using radsync_server.Providers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using System.Threading.Tasks;

namespace radsync_server.Services
{
    public class JwtServices : IServices
    {
        public void InstallServices(IServiceCollection services, IConfiguration configuration)
        {

            var jwtTokenConfig = configuration.GetSection("jwtTokenConfig").Get<JwtTokenConfig>();
            services.AddSingleton(jwtTokenConfig);

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;

                x.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];

                        var path = context.HttpContext.Request.Path;

                        //if (path.StartsWithSegments("/api/hubs/timer"))
                        //{
                        //    if (!string.IsNullOrEmpty(accessToken))
                        //    {
                        //        context.Token = accessToken;
                        //    }
                        //}
                        //else

                        //if (path.StartsWithSegments("/api/hubs/consult_hub"))
                        //{
                        //    if (!string.IsNullOrEmpty(accessToken))
                        //    {
                        //        context.Token = accessToken;
                        //    }
                        //}

                        return Task.CompletedTask;
                    }
                };

                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwtTokenConfig.Issuer,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtTokenConfig.Secret)),
                    ValidAudience = jwtTokenConfig.Audience,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

            services.AddSingleton<IJwtAuthManager, JwtAuthManager>();
            services.AddHostedService<JwtRefreshTokenCache>();


        }
    }
}
