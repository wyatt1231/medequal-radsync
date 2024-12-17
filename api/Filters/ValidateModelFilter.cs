using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections.Generic;

namespace radsync_server.Filters
{
    public class ValidateModelFilter : ActionFilterAttribute
    {


        public override void OnActionExecuting(ActionExecutingContext actionContext)
        {
            if (!actionContext.ModelState.IsValid)
            {
                var errors = actionContext.ModelState.Values;

                var listErrors = new List<string>();

                foreach (var err in errors)
                {
                    foreach (var errMessage in err.Errors)
                    {
                        if (!errMessage.ErrorMessage.Trim().Equals(""))
                        {
                            listErrors.Add(errMessage.ErrorMessage);
                        }
                    }

                    actionContext.Result = new Microsoft.AspNetCore.Mvc.BadRequestObjectResult(new
                    {
                        succces = false,
                        errors = listErrors,
                        message = ""
                    });
                }
            }
        }
    }
}
