/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { AccountContext } from "../AccountContext";
import { Friend, Message } from "../../types/User";

type props = {
  setFriendList: Dispatch<SetStateAction<Friend[]>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  socket: any;
};

export const useSocketSetup = ({
  setFriendList,
  setMessages,
  socket,
}: props) => {
  const context = useContext(AccountContext);

  if (!context) {
    return <div>Context is not available</div>;
  }
  const { setUser } = context;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    socket.connect();
    socket.on("receive_message", (message: Message) => {
      setMessages((prevM) => [message, ...prevM]);
    });
    socket.on("friends", (friendList: SetStateAction<Friend[]>) => {
      setFriendList(friendList);
    });
    socket.on("messages", (messages: SetStateAction<Message[]>) => {
      setMessages(messages);
    });
    socket.on("connected", (connected: string, username: string) => {
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
      setUser({ loggedIn: 0, token: "" });
    });
    return () => {
      socket.off("connect_error");
      socket.off("connected");
      socket.off("friends");
      socket.off("messages");
      socket.off("receive_message");
    };
  }, [setFriendList, setMessages, setUser, socket]);
};
