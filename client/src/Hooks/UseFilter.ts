import { useCallback, useEffect, useState } from "react";
import { ITblInitialSort } from "../Interfaces/TableInterfaces";

const UseFilter = (
  defaultSearch: any,
  initialTableSort: Array<ITblInitialSort>
) => {
  const [tableSearch, setTableSearch] = useState(defaultSearch);
  const [tableLimit, setTableLimit] = useState(defaultSearch?.page?.limit);
  const [tablePage, setTablePage] = useState(0);

  if (initialTableSort.length <= 0) {
    console.error(`please make sure that the sort has value`);
  }

  const [selectedSortIndex, setSelectedSortIndex] = useState(0);
  const [activeSort, setActiveSort] = useState<any>(null);

  const handleChagenSelectedSortIndex = useCallback(index => {
    setSelectedSortIndex(index);
  }, []);

  const handleSetTableSearch = useCallback(newState => {
    setTableSearch({
      ...newState,
      sort: activeSort,
      page: {
        begin: tablePage,
        limit: tableLimit,
      },
    });
  }, []);

  const handleSetLimit = useCallback(newLimit => {
    setTableLimit(newLimit);
  }, []);

  const handleSetPage = useCallback(newPage => {
    setTablePage(newPage);
  }, []);

  const handleChangePage = useCallback(
    (event, page) => {
      handleSetPage(page);
    },
    [handleSetPage]
  );

  const handleChangeRowsPerPage = useCallback(
    event => {
      if (typeof event.target.value !== "undefined") {
        handleSetLimit(parseInt(event.target.value));
        handleSetPage(0);
      }
    },
    [handleSetLimit, handleSetPage]
  );

  useEffect(() => {
    let mounted = true;

    const generateSearchFilters = () => {
      const foundSortItem = initialTableSort[selectedSortIndex];

      if (!!foundSortItem?.value) {
        // if (foundSortItem?.value) {
        // }
        mounted && setActiveSort(foundSortItem.value);
      }
    };

    mounted && generateSearchFilters();

    return () => {
      mounted = false;
    };
  }, [initialTableSort, selectedSortIndex]);

  useEffect(() => {
    handleSetTableSearch(defaultSearch);
  }, [defaultSearch]);

  return [
    tableSearch,
    tableLimit,
    tablePage,
    activeSort,
    selectedSortIndex,
    handleSetTableSearch,
    // handleSetLimit,
    // handleSetPage,
    // handleSetCount,
    handleChangePage,
    handleChangeRowsPerPage,
    handleChagenSelectedSortIndex,
  ];
};

export default UseFilter;
