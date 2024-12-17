
using Api.Context;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

using System;
using System.Threading.Tasks;

using static radsync_server.DataTransferObjects.ResponseDtos;

namespace Api.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;
        private readonly IWebHostEnvironment web_host_env;
        //private readonly MySqlDbContext mysql_db_context;


        public ExceptionHandlingMiddleware(
            RequestDelegate next,
             IWebHostEnvironment web_host_env,
            ILogger<ExceptionHandlingMiddleware> logger
            //MySqlDbContext mysql_db_context
           )
        {
            _next = next;
            _logger = logger;
            this.web_host_env = web_host_env;
            //this.mysql_db_context = mysql_db_context;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {
                if (web_host_env.EnvironmentName == "Dev")
                {
                    _logger.LogError(exception, "Exception occurred: {Message}", exception.Message);
                }


                string msg = exception.Message;
                string removeStr = "See the inner exception for details.";
                int index = msg.IndexOf(removeStr);
                msg = index < 0 ? msg : msg.Remove(index, removeStr.Length);

                //await mysql_db_context.RollbackTransactionAsync();
                context.Response.StatusCode = 500;
                await context.Response.WriteAsJsonAsync(new ResponseDto
                {
                    success = false,
                    status = "error",
                    message = msg,
                });

            }
        }
    }
}



