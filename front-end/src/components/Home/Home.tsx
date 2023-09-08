import { Friend } from "../../types/User";
import { Chat } from "./Chat";
import { Sidebar } from "./Sidebar";
import { Dispatch, SetStateAction, createContext, useState } from "react";
import { UseSocketSetup } from "./useSocketSetup";

type FriendContextType = {
  friendList: Friend[];
  setFriendList: Dispatch<SetStateAction<Friend[]>>;
};
export const FriendContext = createContext<FriendContextType | null>(null);

export const Home = () => {
  const [friendList, setFriendList] = useState<Friend[]>([]);
  UseSocketSetup({ setFriendList });
  const [selectedUser, setSelectedUser] = useState(0);
  return (
    <FriendContext.Provider value={{ friendList, setFriendList }}>
      <div className="grid grid-cols-10 h-screen">
        <div className="col-span-3 border-r border-gray-400">
          <Sidebar
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        </div>
        <div className="col-span-7">
          <Chat selectedUser={selectedUser} />
        </div>
      </div>
    </FriendContext.Provider>
  );
};
