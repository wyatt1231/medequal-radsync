using radsync_server.Config;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace radsync_server.Hooks
{
    public class UseClaims
    {

        public static string PriorityRole(ClaimsIdentity identity)
        {
            var role_claims = identity.Claims.Where(c => c.Type == (identity).RoleClaimType).ToList();

            List<string> list_roles = role_claims.Select((rc) => rc.Value).ToList();

            if (list_roles.Any(UserConfig.DOCTOR.Contains))
            {
                return UserConfig.DOCTOR;
            }
            else if (list_roles.Any(UserConfig.ADMIN.Contains))
            {
                return UserConfig.ADMIN;
            }
            else
            {
                return null;
            }
        }

    }
}
