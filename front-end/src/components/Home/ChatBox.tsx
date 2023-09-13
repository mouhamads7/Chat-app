import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import { Message } from "../../types/User";
import { Dispatch, SetStateAction, useContext } from "react";
import { SocketContext } from "./Home";

export const ChatBox = ({
  userid,
  setMessages,
}: {
  userid: string;
  setMessages: Dispatch<SetStateAction<Message[]>>;
}) => {
  const context = useContext(SocketContext);
  if (!context) {
    return <div>Context is not available</div>;
  }
  const { socket } = context;
  return (
    <Formik
      initialValues={{ to: "", from: "", content: "" }}
      validationSchema={Yup.object({
        content: Yup.string().required().min(1).max(255),
      })}
      onSubmit={(values, { resetForm }) => {
        const message = { to: userid, from: "null", content: values.content };
        socket.emit("send_message", message);
        setMessages((prevMessages) => [message, ...prevMessages]);
        resetForm();
      }}
    >
      <Form className="flex pb-5 px-5 fixed bottom-0 bg-cyan-950 p-2 w-[60%] md:w-[70%]">
        <Field
          type="text"
          name="content"
          className="w-full drop-shadow-xl bg-cyan-950 text-white border rounded-md py-2 px-2 mr-2"
          placeholder="Type your message here..."
        />
        <button
          type="submit"
          className="px-3 rounded-md text-black font-semibold bg-emerald-400"
        >
          Send
        </button>
      </Form>
    </Formik>
  );
};
