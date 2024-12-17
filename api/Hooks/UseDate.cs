using System;

namespace radsync_server.Hooks
{
    public class UseDate
    {
        public static string DisplayTimespan(TimeSpan? time_span)
        {
            if (time_span == null)
            {
                return "";
            }
            DateTime time = DateTime.Today.Add((TimeSpan)time_span);
            string display_time = time.ToString("hh:mm tt"); // It will give "03:00 AM"
            return display_time;
        }
    }
}
