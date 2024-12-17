using Dapper;
using radsync_server.Config;
using radsync_server.Interfaces;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static radsync_server.DataTransferObjects.LibraryDtos;

namespace radsync_server.Repositories
{
    public class LibraryRepository : ILibraryRepository
    {
        private readonly IConfiguration configuration;
        public LibraryRepository(IConfiguration configuration)
        {
            this.configuration = configuration;
        }
        public async Task<List<GetLibraryDto>> GetMedLib()
        {
            using MySqlConnection con = new MySqlConnection(configuration.GetConnectionString(Constants.MYSQL_CONNECTION));

            await con.OpenAsync();
            using var tran = await con.BeginTransactionAsync();


            string sql_query = $@"SELECT *  FROM  (
                                    SELECT ds.stockcode AS id,CONCAT(im.stockdesc,' | ' ,im.packdesc,' | ',im.unitdesc) AS label FROM deptstocks ds 
                                      JOIN invmaster im ON im.stockcode = ds.`stockcode` 
                                      WHERE ds.deptcode = 0002 AND ds.invactive = 'Y'
                                    ) 
	                              AS tmp
                                 GROUP BY label";

            List<GetLibraryDto> data = (await con.QueryAsync<GetLibraryDto>(sql_query, null, transaction: tran)).ToList();

            return data;
        }

        public async Task<List<GetLibraryDto>> GetFreqLib()
        {
            using MySqlConnection con = new MySqlConnection(configuration.GetConnectionString(Constants.MYSQL_CONNECTION));

            await con.OpenAsync();
            using var tran = await con.BeginTransactionAsync();


            string sql_query = $@"SELECT *  FROM  (
                                     SELECT freqcode AS id,freqdesc AS label FROM freqdosage
                                    ) 
	                             AS tmp";

            List<GetLibraryDto> data = (await con.QueryAsync<GetLibraryDto>(sql_query, null, transaction: tran)).ToList();
            return data;
        }

    }
}
