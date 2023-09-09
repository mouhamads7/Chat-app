import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { useContext, useState } from "react";
import { FriendContext } from "./Home";
import { AddUserModal } from "./AddUserModal";

type props = {
  selectedUser: number;
  setSelectedUser: (i: number) => void;
};
export const Sidebar = ({ selectedUser, setSelectedUser }: props) => {
  const [isOpen, setIsOpen] = useState(false);
  const context = useContext(FriendContext);
  if (!context) {
    return <div>Context is not available</div>;
  }
  const { friendList } = context;

  return (
    <div className="py-4 text-white">
      <div className="flex justify-around border-b pb-3">
        <h1 className="font-bold">Add Friend</h1>
        <ChatBubbleBottomCenterTextIcon
          className="w-7 h-7 bg-gray-600 p-1 rounded-md cursor-pointer"
          onClick={() => setIsOpen(true)}
        />
      </div>
      <div className="flex flex-col items-center pt-3">
        {friendList.map((friend, index) => (
          <div
            key={index}
            className={buttonStyle(index, selectedUser)}
            onClick={() => setSelectedUser(index)}
          >
            <div
              className={classNames("w-4 h-4 rounded-full mt-1 mr-2", {
                "bg-red-500": friend.connected === "false",
                "bg-green-500": friend.connected === "true",
              })}
            ></div>
            <p>{friend.username}</p>
          </div>
        ))}
      </div>
      <AddUserModal isOpen={isOpen} onOpen={setIsOpen} />
    </div>
  );
};

const buttonStyle = (userNumber: number, selectedUser: number) =>
  classNames(
    "flex mb-2 cursor-pointer active:border active:border-cyan-600",
    "active:border-b-2 active:border-b-cyan-600 focus:outline-none",
    {
      " justify-center  border-b-2  border-b-cyan-600 w-28 py-1 text-cyan-600":
        selectedUser === userNumber,
    }
  );
