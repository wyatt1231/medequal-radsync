using System;

namespace radsync_server.Models
{
    public class NotifyMaintenanceModel
    {
        public bool will_maintenance { get; set; }
        public DateTime? maintenance_datetime { get; set; }


    }
}
