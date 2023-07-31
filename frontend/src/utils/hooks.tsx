import useSWR, { unstable_serialize, useSWRConfig, preload } from "swr";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";

/**
 * This hook is needed for inputs that depend on URL search params.
 * @param paramKey - The URL search parameter whose value will be set by an input.
 */
export const useUrlParamFilter = (paramKey: string) => {
  const [urlParams, setUrlParams] = useSearchParams();
  const [value, setValue] = useState("");
  const defaultValue = urlParams.get(paramKey);

  useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);

  const handleChange = useCallback((newValue: string) => {
    if (newValue === defaultValue) return;
    const newUrlParams = new URLSearchParams(urlParams);

    if (newValue) newUrlParams.set(paramKey, newValue);
    else newUrlParams.delete(paramKey);

    setValue(newValue);
    newUrlParams.delete("page");
    setUrlParams(newUrlParams);
  }, [defaultValue, urlParams, paramKey, setUrlParams]);

  return [value, handleChange, urlParams] as const;
};

type PromiseWithResolve = {
  resolve: (value: boolean) => void;
};

/**
 * This hook returs a confirmation dialog component and a funcation that can 
 * invoke that dialog resulting in a promise that resolves with a boolean value.
 */
export const useConfirm = () => {
  const [promise, setPromise] = useState<PromiseWithResolve | null>(null);
  const [message, setMessage] = useState("");

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  /**
   * Show a confirmation dialog with the provided message.
   * @param message - The message to display in the confirmation dialog.
   * @returns A promise that resolves with a boolean value indicating user's choice.
   */
  const confirm = useCallback((message: string): Promise<boolean> => {
    setMessage(message);
    return new Promise<boolean>((resolve) => setPromise({ resolve }));
  }, []);

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null} onClose={handleClose}>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm}>Ok</Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );

  return [confirm, ConfirmationDialog] as const;
};

/**
 * This hook returns a counter element and its count state.
 */
export const useCounter = () => {
  const [count, setCount] = useState(1);

  const handleIncrement = useCallback(
    () => setCount(prevCount => prevCount + 1), []
  );

  const handleDecrement = useCallback(
    () => setCount(prevCount => prevCount - 1), []
  );

  const Counter = () => (
    <ButtonGroup size="small" aria-label="increment / decrement">
      <Button disabled={count === 0} onClick={handleDecrement}>-</Button>
      <Button disabled sx={{ "&:disabled": { color: "#717171" } }}>{count}</Button>
      <Button onClick={handleIncrement}>+</Button>
    </ButtonGroup>
  );

  return [count, Counter] as const;
};

type AsyncStatus = "idle" | "loading" | "success" | "error";

/**
 * A hook that takes an asynchronous function and returns an object with 
 * properties that represent the state of the asynchronous operation.
 * @param asyncFunction - An asynchronous function whose status will be returned.
 */
export const useAsync = <T, Args extends any[]>(asyncFunction: (...args: Args) => Promise<T>) => { // eslint-disable-line
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<any | null>(null); // eslint-disable-line

  /**
   * Execute the asynchronous function and update the state accordingly.
   * @param args - Arguments to pass to the asynchronous function.
   * @returns A promise that resolves with an object representing the result of the async operation.
   */
  const execute = useCallback(async (...args: Args) => {
    setStatus("loading");
    setValue(null);
    setError(null);

    try {
      const response = await asyncFunction(...args);
      setValue(response);
      setStatus("success");
      return { value: response, status: "success" as AsyncStatus };
    } catch (error) {
      setError(error);
      setStatus("error");
      return { value: null, status: "error" as AsyncStatus };
    }
  }, [asyncFunction]);

  return { execute, status, value, error } as const;
};

/**
 * A hook to debounce a value. Useful for preventing too many updates
 * of a frequently changing peace of state.
 * 
 * @param value - The value to be debounced.
 * @param delay - Delay in milliseconds (`500` by default).
 * 
 * @example
 *  const Search = () => {
 *    const [value, setValue] = useState("");
 *    const debouncedValue = useDebounce(value, 500);
 * 
 *    useEffect(() => {
 *      // fetch the current search value and update the state
 *      // (will trigger only in 500ms after last setValue call)
 *    }, [debouncedValue]);
 * 
 *    return (
 *      <input 
 *        type="text"
 *        value={value}
 *        placeholder="Search"
 *        onChange={({ target }) => setValue(target.value)}
 *      />
 *    );
 *  };
 */
export const useDebounce = <T,>(value: T, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

type PageResponse<T> = {
  data: T[];
  results: number;
  limit: number;
};

type SingleItemFetcher<T> = (id: string) => Promise<PageResponse<T>>;

type PageFetcher<T> = (filterParams: URLSearchParams) => Promise<PageResponse<T>>;

/**
 * This hook fetches a single item by ID, utilizing SWR for data caching and fetching.
 * It returns an object representing the state of the asynchronous operation.
 * @param queryKey - The query key of associated with the pieces of SWR cache. 
 * @param id - The ID of the item to fetch.
 * @param getDataById - Fetcher function to retrieve the item by ID (called in case the item is not found in paginated cache).
*/
export const useGetSingleData = <T,>(queryKey: string, id: string, getDataById: SingleItemFetcher<T>) => {
  const { cache } = useSWRConfig();
  const filterParams = new URLSearchParams(location.search);
  const fullQueryKey = [queryKey, filterParams.toString()];

  const filteredPage = cache.get(unstable_serialize(fullQueryKey))?.data as PageResponse<T>;
  const dataInPage = filteredPage?.data.find(item => (item as any)._id === id); // eslint-disable-line

  // Fetch the data by its ID using SWR if it is not found in the page data
  const { data, error, isLoading } = useSWR(
    dataInPage ? null : [queryKey, id], () => getDataById(id)
  );

  return {
    data: dataInPage || data?.data[0] as T || undefined,
    isLoading: !(dataInPage || data) || isLoading,
    error,
  };
};

/**
 * Custom hook for paginated SWR data fetching.
 * @template T - The type of the fetched data.
 * @param queryKey - The query key for useSWR. Usually the API endpoint URL.
 * @param fetcher - The fetcher function to fetch paginated data.
 * @returns An object containing the paginated SWR data and other related info.
 */
export const usePaginatedData = <T,>(queryKey: string, fetcher: PageFetcher<T>) => {
  const [filterParams] = useSearchParams();
  const paramsString = filterParams.toString();
  const currentPage = Number(filterParams.get("page")) || 1;

  const { data, isLoading, error } = useSWR(
    [queryKey, paramsString], () => fetcher(filterParams)
  );

  // Preload the next page to improve user experience
  useEffect(() => {
    const filtersCopy = new URLSearchParams(paramsString);
    filtersCopy.set("page", `${currentPage + 1}`);
    preload([queryKey, filtersCopy.toString()], () => fetcher(filtersCopy));
  }, [currentPage, paramsString, queryKey, fetcher]);

  return {
    error,
    data: data?.data || [],
    isLoading: !data || isLoading,
    results: data?.results || 0,
    limit: data?.limit || 0,
    filterParams,
  } as const;
};