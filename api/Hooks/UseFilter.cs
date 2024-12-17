using radsync_server.Models;
using System;

namespace radsync_server.Hooks
{
    public static class UseFilter
    {

        public static string GenerateSearchEqualOrDefault(string start_str, string col, string keyword)
        {
            if (col.Trim().Equals("") || keyword.Trim().Equals(""))
            {
                return "";
            }

            return $" {start_str} {col} = if({keyword} = '',{col},{keyword})";
        }

        public static string GenTablePagination(SortDto sort, PageDto page)
        {

            if (sort != null && page != null)
            {
                return $" ORDER BY `{sort.column}` {(String.Equals("ASC", sort.direction.ToString(), StringComparison.OrdinalIgnoreCase) ? "ASC" : "DESC")}" +
                       $" LIMIT { page.begin * page.limit}, { page.limit + 1} ";
            }
            else
            {
                return "";
            }

        }

        public static string GenWhereDateClause(string column_name, string sign, DateTime? value)
        {

            if (value != null)
            {
                if (column_name != null && sign != null)
                {
                    string date = ((DateTime)value).ToString("yyyy-MM-dd");


                    string where = $" AND DATE({column_name}) {sign} '{date}' ";

                    return where;
                }
                else
                {
                    return "";
                }
            }
            else
            {
                return "";
            }



        }

    }
}
