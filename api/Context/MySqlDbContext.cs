using MySql.Data.MySqlClient;

using System;
using System.Threading.Tasks;

namespace Api.Context
{
    public class MySqlDbContext : IAsyncDisposable
    {
        private readonly string _connectionString;
        private MySqlConnection _connection;
        private MySqlTransaction _transaction;

        public MySqlDbContext(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<MySqlConnection> GetConnectionAsync()
        {
            if (_connection == null)
            {
                _connection = new MySqlConnection(_connectionString);
                await _connection.OpenAsync();
            }
            return _connection;
        }

        public async Task<MySqlTransaction> BeginTransactionAsync()
        {
            if (_transaction == null)
            {
                _transaction = (await GetConnectionAsync()).BeginTransaction();
            }
            return _transaction;
        }

        public async Task CommitTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public async ValueTask DisposeAsync()
        {
            if (_transaction != null)
            {
                await _transaction.DisposeAsync();
            }

            if (_connection != null)
            {
                await _connection.DisposeAsync();
            }
        }
    }
}
