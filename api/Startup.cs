using Api.Middleware;

using radsync_server.Hubs;
using radsync_server.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace radsync_server
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            //DatabaseConfig.conStr = configuration.GetConnectionString(Constants.MYSQL_CONNECTION);
            //DefaultConfig.app_name = Configuration["DEFAULTS:app_name"];
            //DefaultConfig.APPLICATION_NAME = Configuration["DEFAULTS:APPLICATION_NAME"];
            //DefaultConfig.ftp_ip = Configuration["FTP:ip"];
            //DefaultConfig.ftp_user = Configuration["FTP:user"];
            //DefaultConfig.ftp_pass = Configuration["FTP:pass"];
            //DefaultConfig.paymongo_secret_key = Configuration["PAY:paymongo_secret_key"];
            //DefaultConfig.paymongo_public_key = Configuration["PAY:paymongo_public_key"];
            //DefaultConfig.paymongo_payment_url = Configuration["PAY:paymongo_payment_url"];
            //DefaultConfig.paymongo_source_url = Configuration["PAY:paymongo_source_url"];
            //DefaultConfig.paymongo_pay_intent_url = Configuration["PAY:paymongo_pay_intent_url"];
            //DefaultConfig._providerEmailAddress = Configuration["EMAIL:_providerEmailAddress"];
            //DefaultConfig._providerEmailPass = Configuration["EMAIL:_providerEmailPass"];
            //DefaultConfig._clientBaseUrl = Configuration["EMAIL:_clientBaseUrl"];
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.InstallServicesInAssembly(Configuration);

            //can try to add a documention attribute.
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {



            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseMiddleware<ExceptionHandlingMiddleware>();

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });


            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Radsync v1");
            });

            //app.UseSwagger(c =>
            //{
            //    c.RouteTemplate = "api/swagger/{documentName}/swagger.json";
            //});



            //app.UseSwaggerUI(c =>
            //{
            //    c.SwaggerEndpoint("/api/swagger/v1/swagger.json", "Sample API");
            //    //c.RoutePrefix = "api/swagger";
            //});




            //app.UseStaticFiles();
            //app.UseHttpsRedirection();
            app.UseRouting();

            app.UseCors(builder => builder
               .AllowAnyHeader()
               .AllowAnyMethod()
               .SetIsOriginAllowed((host) => true)
               .AllowCredentials()
           );

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ConsultHub>("/api/hubs/consult_hub");
                endpoints.MapHub<ConsultRoomHub>("/api/hubs/ConsultRoomHub");
            });



        }


    }
}
