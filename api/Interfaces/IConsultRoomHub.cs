using System.Threading.Tasks;

namespace radsync_server.Interfaces
{
    public interface IConsultRoomHub
    {
        Task ReceiveMessage();
        Task ChangedConsultSummary();
        Task StatusChanged();
        Task Connected();
        Task Disconnected();
    }
}
