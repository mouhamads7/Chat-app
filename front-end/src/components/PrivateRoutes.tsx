import { Navigate, Outlet } from "react-router-dom";

export const useAuth = () => {
  const user = { loggedIn: false };
  return user && user.loggedIn;
};

export const PrivateRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};
