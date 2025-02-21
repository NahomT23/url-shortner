import { useState } from "react";

// Define the types for the arguments of the callback function
type Callback<T, U> = (options: U, ...args: any[]) => Promise<T>;

// Define the types for the hook's options (an empty object is fine as the default)
interface Options {
  [key: string]: any;
}

// Define the return type of the hook
interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: any;
  fn: (...args: any[]) => Promise<void>;
}


const useFetch = <T, U extends Options = {}>(cb: Callback<T, U>, options: U = {} as U): UseFetchReturn<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);
  
    const fn = async (...args: any[]) => {
      setLoading(true);
      setError(null);
      try {
        const response = await cb(options, ...args);
        setData(response);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    return { data, loading, error, fn };
  };

  
export default useFetch;
