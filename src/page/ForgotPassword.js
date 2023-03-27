import React, { useEffect, useState, useContext } from "react";
import { Form, InputGroup } from "react-bootstrap";
import "../css/LoginPage.css";
import { FiMail, FiKey } from "react-icons/fi";
import { CiLogin } from "react-icons/ci";
import { Formik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

function ForgotPassword() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const recoverPasswordRes = await api.forgotPassword(values.email);
      if (recoverPasswordRes.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      toast.error("error");
    }
  };

  const clickBackToLoginPage = () => {
    navigate("/login");
  };

  return (
    <div className="loginPageContainer">
      <div className="loginBox">
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 40,
            height: 40,
            fontSize: 32,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onClick={clickBackToLoginPage}
        >
          <CiLogin />
        </div>
        <div className="loginTitleBox">
          <p className="loginTitle">Quên mật khẩu</p>
        </div>
        <Formik
          validationSchema={loginSchema}
          initialValues={{
            email: "",
          }}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ handleSubmit, handleChange, values, errors, touched }) => (
            <Form noValidate className="formLoginBox">
              <Form.Group className="inputBox" controlId="validationFormik01">
                <Form.Label>Địa chỉ Email</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FiMail />
                  </InputGroup.Text>
                  <Form.Control
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ email"
                    // isValid={touched.email && !errors.email}
                    // isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <div className="loginButtonBox">
                <div className="btnBg"></div>
                <button
                  type="submit"
                  className="loginButton"
                  onClick={handleSubmit}
                >
                  Gửi
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
export default ForgotPassword;
