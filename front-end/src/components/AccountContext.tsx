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

export type UserContextType = {
  user: { loggedIn: number; token: string | null };
  setUser: Dispatch<SetStateAction<{ loggedIn: number; token: string | null }>>;
};
export const AccountContext = createContext<UserContextType | null>(null);

export const UserContext = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState({
    loggedIn: -1,
    token: localStorage.getItem("token"),
  });
  const baseUrl = getBaseUrl();
  useEffect(() => {
    axios
      .get(`${baseUrl}/auth/login`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
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
