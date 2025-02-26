namespace Api.DataTransferObjects
{
    public class PagingDtos
    {
        public class PagingDto
        {
            public FilterDto filter { get; set; }
            public SortDto sort { get; set; }
            public int page { get; set; }
            public int days_ago { get; set; }
            public int size { get; set; }
            public int total { get; set; }
            public string other_filters { get; set; }
        }

        public  class FilterDto
        {
           public string columnField { get; set; }
           public string operatorValue { get; set; }
           public string value { get; set; }
           public string type { get; set; }
        }

        public class SortDto
        {
            public string field { get; set; }
            public string sort { get; set; }
        }

       
    }
}
