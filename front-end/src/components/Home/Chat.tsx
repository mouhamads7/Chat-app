import { useContext } from "react";
import { FriendContext } from "./Home";

export const Chat = ({ selectedUser }: { selectedUser: number }) => {
  const context = useContext(FriendContext);
  if (!context) {
    return <div>Context is not available</div>;
  }
  const { friendList } = context;

  return friendList.length > 0 ? (
    <div>
      <div className={selectedUser === 0 ? "block" : "hidden"}>Chatttt</div>
      <div className={selectedUser === 1 ? "block" : "hidden"}>Chat2</div>
    </div>
  ) : (
    <p className="text-white text-center pt-5 font-medium">
      No friend. Add a friend to start chatting
    </p>
  );
};
