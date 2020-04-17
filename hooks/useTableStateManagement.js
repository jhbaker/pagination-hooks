import { useEffect, useRef, useState } from 'react';

import useFilters from 'components/shared/hooks/useFilters';
import usePagination from 'components/shared/hooks/usePagination';
import useTableSorting from 'components/shared/hooks/useTableSorting';

/**
*   useTableStateManagement manages pagination, sorting, and filters for tables.
*
*
*   `total` is the total number of items that the account has.
*   `selectedVenueId` is the venueId that they have currently selected.
*   `fetchFunction` is the function to fetch the relevant table resource.
*   `resetTableResourceState` is the function to reset the Redux state of the relevant item.
*   `hasPagination` determines whether or not the hook should handle pagination.
*   `hasTableSorting` determines whether or not the hook should handle sorting.
*   `hasFilters` determines whether or not the hook should handle filters.
*/
const useTableStateManagement = (
    total = 0,
    selectedVenueId,
    fetchFunction = () => null,
    resetTableResourceState = () => null,
    hasPagination,
    hasTableSorting,
    hasFilters
) => {
    const [paramsForFetch, setParamsForFetch] = useState(
        {
            page: 1,
            limit: 25,
            venueId: selectedVenueId
        }
    );
    // By default, useEffect fires once on initial render. This ref is used to skip said firing.
    const didMountTableRef = useRef(false);

    const callFetchFunction = params => {
        const newFetchParams = { ...paramsForFetch, ...params };
        setParamsForFetch(newFetchParams);
        if (selectedVenueId) {
            fetchFunction(newFetchParams);
        }
    };

    const [
        page,
        setPage,
        limit,
        setLimit,
        onClickNext,
        onClickPrevious,
        resetHasFetchedPage,
    ] = hasPagination ? usePagination(
        total,
        callFetchFunction
    ) : [];

    const resetTable = () => {
        // Due to caching in our reducer, we need to reset our Redux store.
        resetTableResourceState();
        // Reset our hasFetched array
        resetHasFetchedPage();
    };

    const [
        sort,
        setSort,
    ] = hasTableSorting ? useTableSorting(
        callFetchFunction,
        resetTable,
        setPage
    ) : [];

    const [
        searchTerm,
        setSearchTerm,
        resetTableFilters,
    ] = hasFilters ? useFilters(
        callFetchFunction,
        resetTable,
        setPage
    ) : [];

    useEffect(() => {
        if (didMountTableRef.current) {
            // Due to caching in our reducer, we need to reset our Redux store.
            resetTableResourceState();
            // Go back to page 1 on any venue change.
            setPage(1);
            setParamsForFetch({ ...paramsForFetch, venueId: selectedVenueId });
        } else {
            didMountTableRef.current = true;
        }
    }, [selectedVenueId]);

    return [
        page,
        setPage,
        limit,
        setLimit,
        onClickNext,
        onClickPrevious,
        sort,
        setSort,
        searchTerm,
        setSearchTerm,
        resetTableFilters,
    ];
};

export default useTableStateManagement;
