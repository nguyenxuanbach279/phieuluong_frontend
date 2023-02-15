import React, { useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import "../css/LoginPage.css";
import { FiMail, FiKey } from "react-icons/fi";
import { MdOutlineVisibility, MdVisibility } from "react-icons/md";
import { Formik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Too Short!")
    .max(24, "Too Long!")
    .required("Required"),
});

export default function LoginPage() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const clickShowHidePassword = () => {
    setIsShowPassword((pre) => !pre);
  };

  useEffect(() => {
    toast.error("error");
  }, []);

  return (
    <div className="loginPageContainer">
      <div className="loginBox">
        <div className="loginTitleBox">
          <p className="loginTitle">Login</p>
        </div>
        <Formik
          validationSchema={loginSchema}
          onSubmit={console.log}
          initialValues={{
            email: "",
            password: "",
          }}
        >
          {({ handleSubmit, handleChange, values, errors, touched }) => (
            <Form noValidate className="formLoginBox">
              <Form.Group className="inputBox" controlId="validationFormik01">
                <Form.Label>Email address</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FiMail />
                  </InputGroup.Text>
                  <Form.Control
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="Type your email"
                    // isValid={touched.email && !errors.email}
                    // isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group
                className="inputBox passwordBox"
                controlId="validationFormik02"
              >
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FiKey />
                  </InputGroup.Text>
                  <Form.Control
                    name="password"
                    type={isShowPassword ? "text" : "password"}
                    onChange={handleChange}
                    value={values.password}
                    placeholder="Type your Password"
                    autoComplete="off"
                    // isValid={touched.password && !errors.password}
                    // isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </InputGroup>
                <i className="visibilityIcon" onClick={clickShowHidePassword}>
                  {isShowPassword ? <MdVisibility /> : <MdOutlineVisibility />}
                </i>
              </Form.Group>
              <div className="forgotPasswordBox">
                <a href="/login" className="forgotPasswordText">
                  Forgot password?
                </a>
              </div>
              <div className="loginButtonBox">
                <div className="btnBg"></div>
                <button
                  type="submit"
                  className="loginButton"
                  onClick={handleSubmit}
                >
                  Login
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <ToastContainer position="bottom-center" autoClose={5000} />
    </div>
  );
}
