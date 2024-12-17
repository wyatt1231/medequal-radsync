using radsync_server.Interfaces;
using radsync_server.Providers;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace radsync_server.Hubs
{
    public class ConsultRoomHub : Hub<IConsultRoomHub>
    {
        private readonly static ConnectionMapping<string> consult_rooms =
                 new ConnectionMapping<string>();


        public async Task Join(string consult_req_pk)
        {
            string con_id = Context.ConnectionId;
            await Groups.AddToGroupAsync(con_id, consult_req_pk);
        }

        public async Task Leave(string consult_req_pk)
        {
            string con_id = Context.ConnectionId;

            await Groups.RemoveFromGroupAsync(con_id, consult_req_pk);
        }

        public override async Task OnConnectedAsync()
        {
            string con_id = Context.ConnectionId;
            await Clients.Client(con_id).Connected();
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            string con_id = Context.ConnectionId;
            await Clients.Client(con_id).Disconnected();
            await base.OnDisconnectedAsync(exception);
        }

    }
}
