import { useEffect, useRef, useState } from 'react';

/**
*   usePagination handles pagination for our paginated tables.
*
*   It should be called from within useTableStateManagement, and not directly.
*   It also expects the use of caching in the resource's reducer.
*
*   `total` is the total number of items that the account has.
*   `callFetchFunction` is the function to fetch the relevant item along with all params.
*/
const usePagination = (
    total = 0,
    callFetchFunction = () => null
) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);
    // hasFetched[i] represents percentage of data that we have fetched for that page
    // IE [1, .5] means we have fetched 100% of page 1, 50% of page 2
    const [hasFetchedPage, setHasFetchedPage] = useState([]);
    const prevLimitRef = useRef(limit);

    const resetHasFetchedPage = () => {
        // create empty array with length = # of pages
        const tempHasFetched = new Array(Math.ceil(total / limit));
        // set hasFetchedPage[0] to 1 because we fetched first page
        tempHasFetched.splice(0, 1, 1);
        setHasFetchedPage(tempHasFetched);
    };

    useEffect(() => {
        resetHasFetchedPage();
    }, [total]);

    useEffect(() => {
        if (
            // We do not need to fetch data that we already have.
            !(hasFetchedPage[page - 1] === 1)
        ) {
            callFetchFunction({
                page,
                limit,
            });
            const tempHasFetched = hasFetchedPage;
            tempHasFetched.splice(page - 1, 1, 1);
            setHasFetchedPage(tempHasFetched);
        }
    }, [page]);

    useEffect(() => {
        setPage(1);
        // create temporary array using new limit
        const tempHasFetchedArray = new Array(Math.ceil(total / limit));
        // map over hasFetchedPage array
        for (let i = 0; i < hasFetchedPage.length; i += 1) {
            // changeAmountRemaining = old limit / new limit
            let changeAmountRemaining = prevLimitRef.current / limit;
            if (hasFetchedPage[i] === 1) {
                // distribute the changeAmountRemaining across the entries in the new temp array
                while (changeAmountRemaining > 0) {
                    // find the location to insert
                    const loc = Math.floor(
                        ((i + 1) * (prevLimitRef.current / limit)) - changeAmountRemaining
                    );
                    // percentage of data that we already have at the location
                    const percentAtLoc = tempHasFetchedArray[loc];
                    // max percentage of data we can add at a location
                    const percentToAddAtLoc = percentAtLoc ? 1 - percentAtLoc : 1;
                    if (percentAtLoc) {
                        tempHasFetchedArray[loc] += percentToAddAtLoc;
                    } else {
                        tempHasFetchedArray[loc] =
                            changeAmountRemaining > 1 ? 1 : changeAmountRemaining;
                    }
                    // reduce the changeAmountRemaining by however much we just added
                    changeAmountRemaining = changeAmountRemaining > 1 ?
                        changeAmountRemaining - percentToAddAtLoc
                        : 0;
                }
            }
        }
        setHasFetchedPage(tempHasFetchedArray);
        callFetchFunction({
            page,
            limit,
        });
        prevLimitRef.current = limit;
    }, [limit]);

    const onClickNext = () => {
        setPage(page + 1);
    };

    const onClickPrevious = () => {
        setPage(page - 1);
    };

    return [
        page,
        setPage,
        limit,
        setLimit,
        onClickNext,
        onClickPrevious,
        resetHasFetchedPage
    ];
};

export default usePagination;
