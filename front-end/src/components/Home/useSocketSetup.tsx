import { useContext, useEffect } from "react";
import { socket } from "../../socket";
import { AccountContext } from "../AccountContext";
import { Friend } from "../../types/User";

type props = {
  setFriendList: (l: Friend[]) => void;
};

export const UseSocketSetup = ({ setFriendList }: props) => {
  const context = useContext(AccountContext);
  if (!context) {
    return <div>Context is not available</div>;
  }
  const { setUser } = context;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    socket.connect();
    socket.on("friends", (friendList) => {
      setFriendList(friendList);
    });
    socket.on("connected", (connected: boolean, username: string) => {
      setFriendList((friendList) => {
        return [...friendList].map((f) => {
          if (f.username === username) {
            f.connected = connected;
          }
          return f;
        });
      });
    });
    socket.on("connect_error", () => {
      setUser({ loggedIn: 0 });
    });
    return () => {
      socket.off("connect_error");
    };
  }, [setFriendList, setUser]);
};
