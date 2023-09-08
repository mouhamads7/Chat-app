import axios from "axios";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

type UserContextType = {
  user: { loggedIn: number };
  setUser: Dispatch<SetStateAction<{ loggedIn: number }>>;
};
export const AccountContext = createContext<UserContextType | null>(null);

export const UserContext = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState({ loggedIn: -1 });
  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/login", { withCredentials: true })
      .then((res) => {
        if (res.data.loggedIn === false) {
          setUser({ ...res.data });
        }
        setUser({ ...res.data });
      })
      .catch((err) => {
        console.log(err);
        setUser({ ...err.response.data });
      });
  }, []);
  return (
    <AccountContext.Provider value={{ user, setUser }}>
      {children}
    </AccountContext.Provider>
  );
};
