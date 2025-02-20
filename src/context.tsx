import React, { createContext, ReactNode, useContext, useEffect } from "react";
import { getCurrentUser } from "./db/apiAuth";
import useFetch from "./hooks/use-fetch";

interface User {
  role?: string;
}


interface UrlContextType {
  user: User | null; // `user` can be `null` or `User`
  fetchUser: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const UrlContext = createContext<UrlContextType>({
  user: null,
  fetchUser: () => {},
  loading: true,
  isAuthenticated: false,
});


interface UrlProviderProps {
  children: ReactNode;
}

const UrlProvider: React.FC<UrlProviderProps> = ({ children }) => {
  const { data: user, loading, fn: fetchUser } = useFetch<User | null | undefined>(getCurrentUser);

  const isAuthenticated = !!user && user.role === "authenticated";

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UrlContext.Provider
      value={{
        user: user || null, // Ensure `user` is `null` if `undefined`
        fetchUser,
        loading,
        isAuthenticated: isAuthenticated,
      }}
    >
      {children}
    </UrlContext.Provider>
  );
};


export const useUrlState = () => {
  return useContext(UrlContext);
};

export default UrlProvider;