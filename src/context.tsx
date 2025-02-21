import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "./db/apiAuth";
import useFetch from "./hooks/use-fetch";
import supabase from "./db/supabase";


interface User {
  id: string;
  user_metadata: any;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser || null); // Set user to `null` if no user is found
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch the user on initial load
    fetchUser();

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user as User); // Update user state with the new session
      } else if (event === "SIGNED_OUT") {
        setUser(null); // Clear user state on logout
      }
    });

    // Cleanup listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = !!user && user.role === "authenticated";

  return (
    <UrlContext.Provider
      value={{
        user: user || null,
        fetchUser,
        loading,
        isAuthenticated,
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