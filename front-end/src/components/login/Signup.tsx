import { Form, Formik } from "formik";
import { TextField } from "../TextField";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { User } from "../../types/User";
import { useContext, useState } from "react";
import { AccountContext } from "../AccountContext";
import { getBaseUrl } from "../getBaseUrl";

export const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const context = useContext(AccountContext);
  const baseUrl = getBaseUrl();
  if (!context) {
    return <div>Context is not available</div>;
  }
  const { setUser } = context;

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("This field is required")
      .matches(/^[aA-zZ0-9\s]+$/, "Only alphabets are allowed for this field "),
    password: Yup.string().required("This field is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords are not matching")
      .required("This field is required"),
  });

  const signup = (user: User) => {
    axios
      .post(`${baseUrl}/auth/signup`, user, {
        withCredentials: true,
      })
      .then((res) => {
        navigate("/home", { state: res.data });
        setUser({ ...res.data });
        localStorage.setItem("token", res.data.token);
      })
      .catch((err) => {
        console.log(err);
        setError(err.response.data.message);
      });
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{
        username: "Momo",
        password: "Windows11$",
        confirmPassword: "Windows11$",
      }}
      onSubmit={(values) => {
        signup(values);
      }}
    >
      <div className="flex justify-center items-center h-screen">
        <Form className="text-white">
          <p className="text-4xl font-extrabold pb-8 text-center">Sign up</p>
          {error && <p className="text-rose-700 text-center pb-2">{error}</p>}
          <TextField label="Username" name="username" />
          <TextField label="Password" name="password" type="password" />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
          />
          <div className="flex justify-center cursor-pointer">
            <button
              type="submit"
              className="px-2 py-1 rounded-md text-black fonct-bold bg-emerald-500 mr-2"
            >
              Create Account
            </button>
            <div className="flex bg-gray-400 rounded-md pl-2 py-1 pr-3">
              <ArrowLeftIcon className="h-4 w-5 mt-1" />
              <button type="button" onClick={() => navigate("/login")}>
                Back
              </button>
            </div>
          </div>
        </Form>
      </div>
    </Formik>
  );
};
