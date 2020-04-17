import { useEffect, useRef, useState } from 'react';

/**
*   useTableSorting handles sorting for our paginated tables.
*
*   It should be called from within useTableStateManagement, and not directly.
*
*   `callFetchFunction` is the function to fetch the relevant item along with all params.
*   `resetTable` is the function to reset the Redux state and local state.
*   `setPage` is the function to set the current page of our paginated table.
*/
const useTableSorting = (
    callFetchFunction = () => null,
    resetTable = () => null,
    setPage = () => null
) => {
    const [sort, setSort] = useState([]);
    // By default, useEffect fires once on initial render. This ref is used to skip said firing.
    const didMountSortsRef = useRef(false);

    useEffect(() => {
        if (didMountSortsRef.current) {
            // Due to caching in the reducer, we need to reset our Redux store.
            resetTable();
            // Go back to page 1 on any sort change.
            setPage(1);
            callFetchFunction({
                page: 1,
                sort
            });
        } else {
            didMountSortsRef.current = true;
        }
    }, [sort]);

    return [sort, setSort];
};

export default useTableSorting;
