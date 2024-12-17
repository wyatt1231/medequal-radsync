using radsync_server.Config;
using radsync_server.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Concurrent;
using System.Collections.Immutable;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;

namespace radsync_server.Providers
{
    public class JwtAuthManager : IJwtAuthManager
    {
        public IImmutableDictionary<string, RefreshToken> UsersRefreshTokensReadOnlyDictionary => _usersRefreshTokens.ToImmutableDictionary();
        private readonly ConcurrentDictionary<string, RefreshToken> _usersRefreshTokens;  // can store in a database or a distributed cache
        private readonly JwtTokenConfig _jwtTokenConfig;
        private readonly byte[] _secret;

        public JwtAuthManager(JwtTokenConfig jwtTokenConfig)
        {
            _jwtTokenConfig = jwtTokenConfig;
            _usersRefreshTokens = new ConcurrentDictionary<string, RefreshToken>();
            _secret = Encoding.ASCII.GetBytes(jwtTokenConfig.Secret);
        }

        // optional: clean up expired refresh tokens
        public void RemoveExpiredRefreshTokens(DateTime now)
        {
            var expiredTokens = _usersRefreshTokens.Where(x => x.Value.ExpireAt < now).ToList();
            foreach (var expiredToken in expiredTokens)
            {
                _usersRefreshTokens.TryRemove(expiredToken.Key, out _);
            }
        }

        // can be more specific to ip, user agent, device name, etc.
        public void RemoveRefreshTokenByUserId(string UserId)
        {
            var refreshTokens = _usersRefreshTokens.Where(x => x.Value.UserId == UserId).ToList();
            foreach (var refreshToken in refreshTokens)
            {
                _usersRefreshTokens.TryRemove(refreshToken.Key, out _);
            }
        }

        public JwtAuthResult GenerateTokens(string UserId, Claim[] claims, DateTime now, bool rememberme)
        {
            var shouldAddAudienceClaim = string.IsNullOrWhiteSpace(claims?.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Aud)?.Value);
            var jwtToken = new JwtSecurityToken(
                 _jwtTokenConfig.Issuer,
                 shouldAddAudienceClaim ? _jwtTokenConfig.Audience : string.Empty,
                 claims,
                 expires: now.AddMinutes(_jwtTokenConfig.AccessTokenExpiration),
                 signingCredentials: new SigningCredentials(new SymmetricSecurityKey(_secret), SecurityAlgorithms.HmacSha256Signature));
            var accessToken = new JwtSecurityTokenHandler().WriteToken(jwtToken);

            var refreshToken = new RefreshToken
            {
                UserId = UserId,
                TokenString = GenerateRefreshTokenString(),
                ExpireAt = now.AddMinutes(rememberme ? 12780000 : _jwtTokenConfig.RefreshTokenExpiration)
            };

            _usersRefreshTokens.AddOrUpdate(refreshToken.TokenString, refreshToken, (s, t) => refreshToken);

            return new JwtAuthResult
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                rememberme = rememberme
            };
        }

        public JwtAuthResult Refresh(string refreshToken, string accessToken, DateTime now, bool rememberme)
        {
            var (principal, jwtToken) = DecodeJwtToken(accessToken);
            if (jwtToken == null || !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256Signature))
            {
                throw new SecurityTokenException("Invalid token");
            }

            var UserId = principal.Identity.Name;
            if (!_usersRefreshTokens.TryGetValue(refreshToken, out var existingRefreshToken))
            {
                throw new SecurityTokenException("Invalid token");
            }
            if (existingRefreshToken.UserId != UserId || existingRefreshToken.ExpireAt < now)
            {
                throw new SecurityTokenException("Invalid token");
            }

            return GenerateTokens(UserId, principal.Claims.ToArray(), now, rememberme); // need to recover the original claims
        }

        public (ClaimsPrincipal, JwtSecurityToken) DecodeJwtToken(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                throw new SecurityTokenException("Invalid token");
            }
            var principal = new JwtSecurityTokenHandler()
                .ValidateToken(token,
                    new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = _jwtTokenConfig.Issuer,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(_secret),
                        ValidAudience = _jwtTokenConfig.Audience,
                        ValidateAudience = true,
                        ValidateLifetime = false,
                        ClockSkew = TimeSpan.Zero
                    },
                    out var validatedToken);
            return (principal, validatedToken as JwtSecurityToken);
        }

        private static string GenerateRefreshTokenString()
        {
            var randomNumber = new byte[32];
            using var randomNumberGenerator = RandomNumberGenerator.Create();
            randomNumberGenerator.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public class JwtAuthResult
        {
            [JsonPropertyName("accessToken")]
            public string AccessToken { get; set; }

            [JsonPropertyName("refreshToken")]
            public RefreshToken RefreshToken { get; set; }

            public bool rememberme { get; set; }
        }

        public class RefreshToken
        {
            [JsonPropertyName("UserId")]
            public string UserId { get; set; }    // can be used for usage tracking
                                                  // can optionally include other metadata, such as user agent, ip address, device name, and so on
            public string TokenString { get; set; }

            public DateTime ExpireAt { get; set; }
        }
    }
}
