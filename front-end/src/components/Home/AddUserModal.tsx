import { Formik, Form } from "formik";
import { TextField } from "../TextField";
import { useContext, useEffect, useRef, useState } from "react";
import { friendSchema } from "chat-app-mouhamads7";
import { socket } from "../../socket";
import { FriendContext } from "./Home";
import { Friend } from "../../types/User";

type props = {
  isOpen: boolean;
  onOpen: (v: boolean) => void;
};

type addUserType = {
  error: string;
  done: boolean;
  addedFriend: Friend;
};

export const AddUserModal = ({ isOpen, onOpen }: props) => {
  const [error, setError] = useState("");
  const popupRef = useRef() as React.MutableRefObject<HTMLFormElement>;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const closePopup = (e: any) => {
      if (popupRef.current !== null && !popupRef.current?.contains(e.target))
        onOpen(false);
    };
    document.addEventListener("mousedown", closePopup);

    return () => document.removeEventListener("mousedown", closePopup);
  }, []);
  const context = useContext(FriendContext);
  if (!context) {
    return <div>Context is not available</div>;
  }
  const { setFriendList } = context;
  if (isOpen) {
    return (
      <Formik
        initialValues={{ username: "", connected: true }}
        validationSchema={friendSchema}
        onSubmit={(values) => {
          socket.emit(
            "add_user",
            values.username,
            ({ error, done, addedFriend }: addUserType) => {
              if (done) {
                setFriendList((c) => [addedFriend, ...c]);
                onOpen(false);
                setError("");
              } else {
                setError(error);
              }
            }
          );
        }}
      >
        {({ resetForm }) => (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
            <Form className="bg-cyan-950 p-2 md:p-6 rounded" ref={popupRef}>
              <p className="text-2xl text-center text-white pb-2 font-extrabold text-green-color">
                Add a user
              </p>
              {error && (
                <p className="text-rose-700 text-center pb-2">{error}</p>
              )}
              <TextField label="Friend's name" name="username" />
              <div className="flex justify-around">
                <button
                  type="button"
                  className=" px-2 py-1 rounded-md bg-gray-400 drop-shadow"
                  onClick={() => {
                    onOpen(false);
                    resetForm;
                    setError("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2 py-1 rounded-md font-semibold text-black fonct-bold bg-blue-300 mr-2 drop-shadow"
                >
                  Submit
                </button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    );
  }
};
