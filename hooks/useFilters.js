import { useEffect, useRef, useState } from 'react';

import useDebounce from 'components/shared/hooks/useDebounce';

/**
*   useFilters handles filters for paginated tables.
*
*   It should be called from within useTableStateManagement, and not directly.
*
*   `callFetchFunction` is the function to fetch the relevant item along with all params.
*   `resetTable` is the function to reset the Redux state and local state.
*   `setPage` is the function to set the current page of our paginated table.
*/
const useFilters = (
    callFetchFunction,
    resetTable,
    setPage
) => {
    const [searchTerm, setSearchTerm] = useState('');
    const didMountFiltersRef = useRef(false);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (didMountFiltersRef.current) {
            // For caching, we need to reset our Redux store.
            resetTable();
            // Go back to page 1 on any filter change.
            setPage(1);
            callFetchFunction({
                page: 1,
                searchTerm
            });
        } else {
            didMountFiltersRef.current = true;
        }
    }, [debouncedSearchTerm]);

    const resetTableFilters = () => {
        setSearchTerm('');
    };

    return [searchTerm, setSearchTerm, resetTableFilters];
};

export default useFilters;
