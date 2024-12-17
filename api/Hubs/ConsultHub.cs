using radsync_server.Interfaces;
using radsync_server.Providers;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace radsync_server.Hubs
{
    public class ConsultHub : Hub<IConsultHub>
    {
        private readonly static ConnectionMapping<string> rooms =
                 new ConnectionMapping<string>();


        public async Task JoinConsultRoom(string consult_req_pk)
        {
            string con_id = Context.ConnectionId;
            await Groups.AddToGroupAsync(con_id, consult_req_pk);
        }

        public async Task LeaveConsultRoom(string consult_req_pk)
        {
            string con_id = Context.ConnectionId;
            await Groups.RemoveFromGroupAsync(con_id, consult_req_pk);
        }

        public override async Task OnConnectedAsync()
        {
            string con_id = Context.ConnectionId;
            await Clients.Client(con_id).Connected(con_id);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            string con_id = Context.ConnectionId;
            await Clients.Client(con_id).Connected(con_id);
            await base.OnDisconnectedAsync(exception);
        }

    }
}
