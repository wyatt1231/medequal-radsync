using System.Threading.Tasks;

namespace radsync_server.Interfaces
{
    public interface IConfigRepository
    {
        Task<string> GetHospitalNameAsync();
        Task<string> GetHospitalLogoAsync();
    }
}
