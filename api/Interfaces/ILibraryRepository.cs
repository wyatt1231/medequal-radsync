using System.Collections.Generic;
using System.Threading.Tasks;
using static radsync_server.DataTransferObjects.LibraryDtos;

namespace radsync_server.Interfaces
{
    public interface ILibraryRepository
    {
        Task<List<GetLibraryDto>> GetMedLib();
        Task<List<GetLibraryDto>> GetFreqLib();
    }
}
