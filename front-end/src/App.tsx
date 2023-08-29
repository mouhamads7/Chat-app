import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Login } from "./components/login/Login";
import { Signup } from "./components/login/Signup";
import { PrivateRoutes } from "./components/PrivateRoutes";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/home" element={<div>Hello</div>} />
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};
