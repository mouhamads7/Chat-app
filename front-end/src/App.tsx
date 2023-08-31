import { UserContext } from "./components/AccountContext";
import { MyRoutes } from "./components/MyRoutes";

export const App = () => {
  return (
    <UserContext>
      <MyRoutes />
    </UserContext>
  );
};
