using Dapper;
using radsync_server.Config;
using radsync_server.Interfaces;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Threading.Tasks;

namespace radsync_server.Repositories
{
    public class ConfigRepository : IConfigRepository
    {
        private readonly IConfiguration _config;


        public ConfigRepository(IConfiguration config)
        {
            _config = config;
        }

        public async Task<string> GetHospitalNameAsync()
        {
            using MySqlConnection con = new MySqlConnection(_config.GetConnectionString(Constants.MYSQL_CONNECTION));
            await con.OpenAsync();
            using var tran = await con.BeginTransactionAsync();
            string hosp_name = await con.QuerySingleOrDefaultAsync<string>("SELECT  `GetDefaultValue`('hospname') LIMIT 1"
                , null, transaction: tran);
            await tran.CommitAsync();
            return hosp_name;
        }


        public async Task<string> GetHospitalLogoAsync()
        {
            using MySqlConnection con = new MySqlConnection(_config.GetConnectionString(Constants.MYSQL_CONNECTION));
            await con.OpenAsync();
            using var tran = await con.BeginTransactionAsync();

            string hospital_logo = Convert.ToBase64String(await con.QuerySingleAsync<byte[]>(
                                    $@"SELECT hosplogo  FROM hospitallogo WHERE hospcode = `GetDefaultValue`('hospinitial') LIMIT 1;"
                                   , null, transaction: tran));
            await tran.CommitAsync();
            return hospital_logo;
        }


    }
}
