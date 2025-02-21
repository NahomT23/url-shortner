import { useUrlState } from "@/context";
import { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useUrlState();

  useEffect(() => {
    if (!isAuthenticated && loading === false) {
      navigate("/auth");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <BarLoader width={"100%"} color="white" />;
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default RequireAuth;
