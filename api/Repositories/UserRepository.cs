using Api.Context;

using Dapper;

using Microsoft.Extensions.Configuration;

using MySql.Data.MySqlClient;

using Newtonsoft.Json;

using radsync_server.Config;
using radsync_server.Interfaces;

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;

using static Api.DataTransferObjects.UserDtos;
using static radsync_server.DataTransferObjects.AuthDtos;
using static radsync_server.DataTransferObjects.ResponseDtos;

namespace radsync_server.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IConfiguration configuration;
        private readonly MySqlDbContext mysql_db_context;

        public UserRepository(IConfiguration configuration, MySqlDbContext mysql_db_context)
        {
            this.configuration = configuration;
            this.mysql_db_context = mysql_db_context;
        }

        public async Task<List<UserDto>> AuthAsync(LoginDto payload)
        {
            using MySqlConnection con = new MySqlConnection(configuration.GetConnectionString(Constants.MYSQL_CONNECTION));
            await con.OpenAsync();
            using var tran = await con.BeginTransactionAsync();

            List<UserDto> list_user_roles = new List<UserDto>();

            string username = await con.QuerySingleOrDefaultAsync<string>(
                $@"SELECT
                    um.username
                    FROM `usermaster` um 
                    LEFT JOIN userpermission up ON um.username = up.username
                    WHERE 
                    um.`password` = AES_ENCRYPT(@password,@username)  LIMIT 1; "

                , payload, transaction: tran);

            if (string.IsNullOrEmpty(username)) return null;

            int is_allow_login = await con.QuerySingleOrDefaultAsync<int>(
                              $@" SELECT COUNT(up.`username`) FROM  `userpermission` up 
                                     WHERE 
                                     up.`modid` IN ('radsync','admin') AND up.`username` = @username AND up.`logid` = 'login';"
                              , payload, transaction: tran);

            if (is_allow_login < 1) return list_user_roles;

            //string doccode = await con.QuerySingleOrDefaultAsync<string>(
            //              $@"SELECT doccode FROM docmaster 
            //                     WHERE doccode = REPLACE(CONVERT(@username USING utf8),`GetDefaultValue`('DOC_PORTAL_USER_PREFIX'),'') LIMIT 1;"
            //              , payload, transaction: tran);

            string doccode = await con.QuerySingleOrDefaultAsync<string>(
                          $@"select d.doccode from deptdoctor d  where d.useraccount  = @username limit 1;"
                          , payload, transaction: tran);

            if (!String.IsNullOrEmpty(doccode))
            {
                //username = doccode;
                list_user_roles.Add(new UserDto
                {
                    username = username,
                    user_type = "DOCTOR"
                });
            }
            else
            {
                list_user_roles.Add(new UserDto
                {
                    username = username,
                    user_type = "ADMIN"
                });
            }

            //int admin_count = await con.QuerySingleOrDefaultAsync<int>(
            //              $@" SELECT COUNT(up.`username`) FROM  `userpermission` up 
            //                 WHERE 
            //                 up.`modid` IN ('radsync','admin') AND up.`username` = @username AND up.`logid` = 'login';"
            //              , payload, transaction: tran);

            //if (admin_count > 0)
            //{
            //    list_user_roles.Add(new UserDto
            //    {
            //        username = username,
            //        user_type = "ADMIN"
            //    });
            //}

            await tran.CommitAsync();
            return list_user_roles;
        }

        public async Task<UserDto> UserAsync(UserDto payload)
        {
            using MySqlConnection con = new MySqlConnection(configuration.GetConnectionString(Constants.MYSQL_CONNECTION));
            con.Open();
            using MySqlTransaction tran = await con.BeginTransactionAsync();

            string query = "";



            if (String.Equals(payload.user_type, UserConfig.DOCTOR, StringComparison.OrdinalIgnoreCase))
            {
                query = $@"SELECT username, empname, '' AS user_type, empname FROM usermaster
                   WHERE username = CONCAT(`GetDefaultValue`('DOC_PORTAL_USER_PREFIX'),@username) LIMIT 1;";
            }
            else
            {
                query = $@"SELECT username, empname, '' as user_type, empname FROM usermaster
                   WHERE username = @username limit 1;";
            }

            var user = await con.QuerySingleOrDefaultAsync<UserDto>(query, payload, transaction: tran);

            user.username = payload.username;
            Debug.Print("UserAsync");
            Debug.Print(JsonConvert.SerializeObject(user, Formatting.Indented));

            await tran.CommitAsync();
            return user;
        }

        public async Task<ResponseDto> ChangePasswordAsync(PasswordDto payload, UserDto user_payload)
        {
            using MySqlConnection con = new MySqlConnection(configuration.GetConnectionString(Constants.MYSQL_CONNECTION));
            con.Open();
            using MySqlTransaction tran = await con.BeginTransactionAsync();

            if (String.Equals(user_payload.user_type, UserConfig.DOCTOR, StringComparison.OrdinalIgnoreCase))
            {
                user_payload.username = await con.QuerySingleAsync<string>(
              $@"SELECT CONCAT(`GetDefaultValue`('DOC_PORTAL_USER_PREFIX'),@username);"
              , user_payload, transaction: tran);
            }


            //check if old_password is correct
            int found_user = await con.QuerySingleAsync<int>(
                $@"SELECT COUNT(*) FROM  usermaster WHERE
                    `password` = AES_ENCRYPT(@old_password,'{user_payload.username}') LIMIT 1;"
                , payload, transaction: tran);

            if (found_user > 0)
            {
                //if old pass is correct, change the password
                int updated_rows = await con.ExecuteAsync(
                    $@"UPDATE usermaster SET
                       `password` = AES_ENCRYPT(@new_password,'{user_payload.username}')
                       WHERE username = '{user_payload.username}';"
                    , payload, transaction: tran);

                if (updated_rows > 0)
                {
                    await tran.CommitAsync();
                    return new ResponseDto
                    {
                        success = true,
                        message = "Your password has been updated!"
                    };
                }

                return new ResponseDto
                {
                    success = false,
                    message = "We are not able to update your password!"
                };
            }

            return new ResponseDto
            {
                success = false,
                message = "The old password that you have entered is incorrect!"
            };
        }

        public async Task VerifyDoctorAccess(string patno, UserDto user)
        {
            var con = await this.mysql_db_context.GetConnectionAsync();
            var transaction = await this.mysql_db_context.BeginTransactionAsync();

            if (user.username == null || user.user_type == null)
            {
                throw new Exception($"The record of patient {patno} is either not found or you do not have the right privileges to access it.");
            }

            if (String.Equals(user.user_type, UserConfig.DOCTOR, StringComparison.OrdinalIgnoreCase))
            {
                string find_doc_pat_query = $@"SELECT COUNT(patno) FROM doctortran WHERE doccode = @doccode LIMIT 1;";

                int find_doc_pat_result = await con.QuerySingleOrDefaultAsync<int>(find_doc_pat_query, new { doccode = user.username }, transaction: transaction);

                if (find_doc_pat_result < 1)
                {
                    throw new Exception($"The record of patient {patno} is either not found or you do not have the right privileges to access it.");
                }
            }
            else
            {
                throw new Exception($"You are not allowed to do this action.");
            }
        }

    }
}
