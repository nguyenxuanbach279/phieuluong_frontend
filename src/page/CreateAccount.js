import { Formik } from "formik";
import React, { useState } from "react";
import { Button, Form, InputGroup, Table } from "react-bootstrap";
import { MdOutlineVisibility, MdVisibility } from "react-icons/md";
import "../css/CreateAccount.css";
import * as Yup from "yup";

const createAccountSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(2, "Too Short!")
    .max(24, "Too Long!")
    .required("Required"),
});

export default function CreateAccount() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [data, setData] = useState({});

  const clickShowHidePassword = () => {
    setIsShowPassword((pre) => !pre);
  };

  const onClickCreateAccount = (value) => {
    console.log(value)
  }

  return (
    <div className="accountContainer">
      <div className="accountTitleBox">
        <p className="accountTitle">Tạo tài khoản</p>
      </div>
      <Formik
        validationSchema={createAccountSchema}
        onSubmit={(values) => onClickCreateAccount(values)}
        initialValues={{
          email: "",
          password: "",
          position: "Nhân viên",
        }}
      >
        {({ handleSubmit, handleChange, values, errors, touched }) => (
          <Form noValidate className="createAccountBox">
            <div className="formCreateAccount">
              <Form.Group className="formRowBox" id="validationFormik01">
                <Form.Label htmlFor="email">Email</Form.Label>
                <InputGroup>
                  <Form.Control
                    name="email"
                    type="email"
                    id="email"
                    value={values.email}
                    onChange={handleChange}
                    isValid={touched.email && !errors.email}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group className="formRowBox" id="validationFormik02">
                <Form.Label htmlFor="password">Mật khẩu</Form.Label>
                <InputGroup>
                  <Form.Control
                    name="password"
                    type={isShowPassword ? "text" : "password"}
                    id="password"
                    onChange={handleChange}
                    value={values.password}
                    isValid={touched.password && !errors.password}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </InputGroup>

                <div
                  className="visibilityIconCreateAcc"
                  onClick={clickShowHidePassword}
                >
                  {isShowPassword ? <MdVisibility /> : <MdOutlineVisibility />}
                </div>
              </Form.Group>
              <Form.Group className="formRowBox">
                <Form.Label htmlFor="position">Chức vụ</Form.Label>
                <Form.Select
                  value={values.position}
                  name="position"
                  id="position"
                  onChange={handleChange}
                >
                  <option value="Nhân viên">Nhân viên</option>
                  <option value="Quản trị viên">Quản trị viên</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="buttonBox">
              <Button
                type="submit"
                className="createAccountButton"
                onClick={handleSubmit}
              >
                Tạo
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
