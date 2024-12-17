using System;
using System.Collections.Immutable;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using static radsync_server.Providers.JwtAuthManager;

namespace radsync_server.Interfaces
{
    public interface IJwtAuthManager
    {
        IImmutableDictionary<string, RefreshToken> UsersRefreshTokensReadOnlyDictionary { get; }
        JwtAuthResult GenerateTokens(string UserId, Claim[] claims, DateTime now, bool rememberme);
        JwtAuthResult Refresh(string refreshToken, string accessToken, DateTime now, bool remember);
        void RemoveExpiredRefreshTokens(DateTime now);
        void RemoveRefreshTokenByUserId(string userId);
        (ClaimsPrincipal, JwtSecurityToken) DecodeJwtToken(string token);
    }
}
