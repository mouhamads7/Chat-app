/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { Friend, Message } from "../../types/User";
import { Chat } from "./Chat";
import { Sidebar } from "./Sidebar";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSocketSetup } from "./useSocketSetup";
import { useLocation } from "react-router-dom";
import { socket as sconn } from "../../socket";
import { AccountContext } from "../AccountContext";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";

type FriendContextType = {
  friendList: Friend[];
  setFriendList: Dispatch<SetStateAction<Friend[]>>;
};

export const FriendContext = createContext<FriendContextType | null>(null);
export const SocketContext = createContext<any>(null);

export const Home = () => {
  const location = useLocation();
  const [friendList, setFriendList] = useState<Friend[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const context = useContext(AccountContext);
  if (!context) {
    return <div>Context is not available</div>;
  }
  const { user } = context;
  const [socket, setSocket] = useState(() => sconn(user));
  useEffect(() => {
    setSocket(() => sconn(user));
  }, [user]);

  useSocketSetup({ setFriendList, setMessages, socket });

  const [selectedUser, setSelectedUser] = useState(0);

  return (
    <FriendContext.Provider value={{ friendList, setFriendList }}>
      <SocketContext.Provider value={{ socket }}>
        <div className="grid grid-cols-10 h-screen">
          <div className="col-span-4 md:col-span-3 border-r h-full border-gray-400 flex justify-center">
            <div className="flex flex-col justify-between fixed pt-4 w-1/3 md:w-1/4 h-full">
              <div>
                <p className="text-white text-center font-semibold text-lg">
                  Hello {location.state.username}
                </p>
                <Sidebar
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                />
              </div>
              <div
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
                className="flex justify-center bg-gray-600 mb-10 bottom-10 left-[1rem] md:left-[30%] lg:left[33%] py-2 rounded-lg cursor-pointer hover:bg-gray-800 active:bg-slate-900"
              >
                <p className="text-white font-medium">Logout</p>
                <ArrowLeftOnRectangleIcon className="w-7 h-7 p-1 stroke-white" />
              </div>
            </div>
          </div>
          <div className="col-span-6 md:col-span-7">
            <Chat
              selectedUser={selectedUser}
              userid={friendList[selectedUser]?.userid}
              messages={messages}
              setMessages={setMessages}
            />
          </div>
        </div>
      </SocketContext.Provider>
    </FriendContext.Provider>
  );
};
