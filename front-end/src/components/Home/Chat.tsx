import { Dispatch, SetStateAction, useContext, useEffect, useRef } from "react";
import { FriendContext } from "./Home";
import { Message } from "../../types/User";
import { ChatBox } from "./ChatBox";
import classNames from "classnames";

type props = {
  selectedUser: number;
  userid: string;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
};

export const Chat = ({
  selectedUser,
  userid,
  messages,
  setMessages,
}: props) => {
  const goDownDiv = useRef<HTMLDivElement | null>(null);
  const context = useContext(FriendContext);
  useEffect(() => {
    goDownDiv.current?.scrollIntoView();
  });
  if (!context) {
    return <div>Context is not available</div>;
  }
  const { friendList } = context;

  return friendList.length > 0 ? (
    <div className="h-full flex flex-col justify-end items-end overflow-y-auto">
      {friendList.map((f, index1) => (
        <div
          className={
            selectedUser === index1
              ? "flex flex-col-reverse px-2 w-full h-full"
              : "hidden"
          }
          key={`friend:${index1}`}
        >
          {messages
            .filter((m) => m.to === f.userid || m.from === f.userid)
            .map((message, index2) => (
              <p
                className={classNames(
                  "font-lg mb-2 rounded-lg max-w-[90%] text-black p-2 break-words",
                  {
                    "bg-blue-200 self-end": message.to === f.userid,
                    "bg-gray-200 self-start": message.to !== f.userid,
                  }
                )}
                key={`msg:${index2}`}
              >
                {message.content}
              </p>
            ))}
        </div>
      ))}
      <div ref={goDownDiv}></div>
      <ChatBox userid={userid} setMessages={setMessages} />
    </div>
  ) : (
    <p className="text-white text-center pt-5 font-medium">
      No friend. Add a friend to start chatting
    </p>
  );
};
