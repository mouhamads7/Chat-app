import { useContext } from "react";
import { AccountContext } from "./AccountContext";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Login } from "./login/Login";
import { Signup } from "./login/Signup";
import { PrivateRoutes } from "./PrivateRoutes";
import { Home } from "./Home/Home";

export const MyRoutes = () => {
  const context = useContext(AccountContext);
  if (!context) {
    return <div>Context is not available</div>;
  }
  const { user } = context;

  return user.loggedIn === -1 ? (
    <p>Loading</p>
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};
