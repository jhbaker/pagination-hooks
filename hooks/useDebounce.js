import { useState, useEffect } from 'react';

/**
*   useDebounce debounces fetches for a specific value.
*
*   `value` is the value that we want to watch to debounce fetches
*   `delay` is the number of ms to debounce the fetch request
*/
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set debouncedValue to value after the specified delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // cleanup
        return () => {
            clearTimeout(handler);
        };
    }, [value]);

    return debouncedValue;
};

export default useDebounce;
