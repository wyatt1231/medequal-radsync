using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace radsync_server.DataTransferObjects
{
    public class LibraryDtos
    {
        public class GetLibraryDto
        {
            public string id { get; set; }
            public string label { get; set; }
        }
    }
}
