import axios from "axios";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { getBaseUrl } from "./getBaseUrl";

type UserContextType = {
  user: { loggedIn: number };
  setUser: Dispatch<SetStateAction<{ loggedIn: number }>>;
};
export const AccountContext = createContext<UserContextType | null>(null);

export const UserContext = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState({ loggedIn: -1 });
  const baseUrl = getBaseUrl();
  useEffect(() => {
    axios
      .get(`${baseUrl}/auth/login`, {
        withCredentials: true,
      })
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
