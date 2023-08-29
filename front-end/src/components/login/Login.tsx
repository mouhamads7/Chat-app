import { Form, Formik } from "formik";
import { TextField } from "../TextField";
import { userSchema } from "chat-app-mouhamads7";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/User";
import axios from "axios";

export const Login = () => {
  // const validationSchema = Yup.object().shape({
  //   username: Yup.string().required("This field is required"),
  //   password: Yup.string().required("This field is required"),
  // });

  const navigate = useNavigate();

  const login = (user: User) => {
    axios
      .post("http://localhost:3001/auth/login", user, {
        withCredentials: true,
      })
      .then(() => navigate("/home"))
      .catch((err) => console.log(err));
  };
  return (
    <Formik
      validationSchema={userSchema}
      initialValues={{ username: "Momo", password: "Windows11$" }}
      onSubmit={(values) => {
        login(values);
      }}
    >
      <div className="flex justify-center items-center h-screen">
        <Form className="text-white">
          <p className="text-4xl font-extrabold pb-8 text-center">Log In</p>
          <TextField label="Username" name="username" />
          <TextField label="Password" name="password" type="password" />
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-2 py-1 rounded-md text-black fonct-bold bg-emerald-500 mr-2"
            >
              Log in
            </button>
            <button
              type="button"
              className=" px-2 py-1 rounded-md bg-gray-400"
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>
          </div>
        </Form>
      </div>
    </Formik>
  );
};
