import { Navigate, Outlet } from "react-router-dom";
import { AccountContext } from "./AccountContext";
import { useContext } from "react";

export const useAuth = () => {
  const context = useContext(AccountContext);
  if (!context) {
    return <div>Context is not available</div>;
  }
  const { user } = context;
  return user && user.loggedIn === 1;
};

export const PrivateRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};
