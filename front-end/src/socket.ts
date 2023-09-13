import { io } from "socket.io-client";

type User = {
  loggedIn: number;
  token: string | null;
};

const serverUrl = import.meta.env.VITE_SERVER_URL;
export const socket = (user: User) =>
  io(serverUrl, {
    autoConnect: false,
    withCredentials: true,
    auth: {
      token: user.token,
    },
  });
