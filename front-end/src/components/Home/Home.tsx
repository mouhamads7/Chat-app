import { Friend, Message } from "../../types/User";
import { Chat } from "./Chat";
import { Sidebar } from "./Sidebar";
import { Dispatch, SetStateAction, createContext, useState } from "react";
import { useSocketSetup } from "./useSocketSetup";
import { useLocation } from "react-router-dom";

type FriendContextType = {
  friendList: Friend[];
  setFriendList: Dispatch<SetStateAction<Friend[]>>;
};

export const FriendContext = createContext<FriendContextType | null>(null);

export const Home = () => {
  const location = useLocation();
  const [friendList, setFriendList] = useState<Friend[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  useSocketSetup({ setFriendList, setMessages });

  const [selectedUser, setSelectedUser] = useState(0);

  return (
    <FriendContext.Provider value={{ friendList, setFriendList }}>
      <div className="grid grid-cols-10 h-screen">
        <div className="col-span-4 md:col-span-3 border-r border-gray-400 static">
          <p className="text-white text-center font-semibold text-lg">
            Welcome {location.state.username}
          </p>
          <Sidebar
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
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
    </FriendContext.Provider>
  );
};
