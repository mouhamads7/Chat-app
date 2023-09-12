import { Form, Formik } from "formik";
import { TextField } from "../TextField";
import { userSchema } from "chat-app-mouhamads7";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/User";
import axios from "axios";
import { AccountContext } from "../AccountContext";
import { useContext, useState } from "react";
// import { useAuth } from "../PrivateRoutes";
import { getBaseUrl } from "../getBaseUrl";

export const Login = () => {
  const navigate = useNavigate();
  const baseUrl = getBaseUrl();
  // const isLogin = useAuth();

  const [error, setError] = useState(null);
  const context = useContext(AccountContext);
  if (!context) {
    return <div>Context is not available</div>;
  }

  const { setUser } = context;

  const login = (user: User) => {
    axios
      .post(`${baseUrl}/auth/login`, user, {
        withCredentials: true,
      })
      .then((res) => {
        navigate("/home", { state: res.data });
        setUser({ ...res.data });
      })
      .catch((err) => {
        console.log(err);
        setError(err.response.data.message);
      });
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
          {error && <p className="text-rose-700 text-center pb-2">{error}</p>}
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
