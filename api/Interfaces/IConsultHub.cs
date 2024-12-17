using System.Threading.Tasks;

namespace radsync_server.Interfaces
{
    public interface IConsultHub
    {
        Task ReceiveConsultChat();
        Task ConsultStatusChanged();
        Task ConsultNotif();
        Task ChangedConsultSummary();
        //Task Connected(string con_id);
        //Task Disconnected(string con_id);

        Task Connected(string con_id);
        Task Disconnected(string con_id);

    }
}
