import React, { useContext } from "react";
import { Form, InputGroup } from "react-bootstrap";
import "../css/LoginPage.css";
import { FiMail } from "react-icons/fi";
import { CiLogin } from "react-icons/ci";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { AppContext } from "../contexts/app.context";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Email không phù hợp").required("Trường này bắt buộc nhập"),
});

function ForgotPassword() {
  const navigate = useNavigate();
  const { setIsLoading } = useContext(AppContext);
  const handleSubmit = async (values) => {
    setIsLoading(true)
    try {
      const recoverPasswordRes = await api.forgotPassword(values.email);
      console.log(recoverPasswordRes);
      if (recoverPasswordRes.data.status === 200) {
        navigate("/login");
      } else if (recoverPasswordRes.data.status === 301) {
        toast.error("Email không tồn tại");
      }
    } catch (error) {
      toast.error("error");
    }
    setIsLoading(false)
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
          <IconButton>
            <CiLogin style={{ color: "#000" }} />
          </IconButton>
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
                  />
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
