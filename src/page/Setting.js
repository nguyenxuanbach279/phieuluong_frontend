import React, { useContext, useState } from "react";
import "../css/SettingPage.css";
import * as Yup from "yup";
import { Formik } from "formik";
import { Button, Form, InputGroup } from "react-bootstrap";
import { MdOutlineVisibility, MdVisibility } from "react-icons/md";
import { AppContext } from "../contexts/app.context";

const SettingSchema = Yup.object().shape({
  name: Yup.string().required(),
  phone: Yup.string().required(),
  oldPassword: Yup.string().min(2, "Too Short!").max(24, "Too Long!"),
  password: Yup.string()
    .min(2, "Too Short!")
    .max(24, "Too Long!")
    .when("oldPassword", (oldPassword, field) =>
      oldPassword ? field.required() : field
    ),
  confirmPassword: Yup.string().when("password", (password, field) =>
    password ? field.required().oneOf([Yup.ref("password")]) : field
  ),
});

export default function Setting() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const { appState, dispatch } = useContext(AppContext);
  const clickShowHidePassword = () => {
    setIsShowPassword((pre) => !pre);
  };
  console.log(appState);
  return (
    <div className="settingContainer">
      <div className="settingTitleBox">
        <p className="settingTitle">Cài đặt tài khoản</p>
      </div>

      <div className="settingContent">
        <Formik
          validationSchema={SettingSchema}
          onSubmit={() => {}}
          initialValues={{
            oldPassword: "",
            password: "",
            confirmPassword: "",
            name: appState.accountInfo.name,
            phone: "0123456789",
          }}
        >
          {({ handleSubmit, handleChange, values, errors, touched }) => (
            <Form noValidate className="settingAccountBox">
              <div className="formSettingAccount">
                <Form.Label>Đổi mật khẩu</Form.Label>
                <Form.Group className="formRowBox" id="validationFormik01">
                  <Form.Label htmlFor="oldPassword">Mật khẩu cũ</Form.Label>
                  <InputGroup>
                    <Form.Control
                      name="oldPassword"
                      type="password"
                      id="oldPassword"
                      value={values.oldPassword}
                      onChange={handleChange}
                      isValid={touched.oldPassword && !errors.oldPassword}
                      isInvalid={!!errors.oldPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.oldPassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="formRowBox" id="validationFormik02">
                  <Form.Label htmlFor="password">Mật khẩu mới</Form.Label>
                  <InputGroup>
                    <Form.Control
                      name="password"
                      type={isShowPassword ? "text" : "password"}
                      id="password"
                      onChange={handleChange}
                      value={values.password}
                      isValid={
                        touched.password &&
                        !errors.password &&
                        values.password === appState.accountInfo.password
                      }
                      isInvalid={!!errors.password && values.oldPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>

                  <div
                    className="visibilityIconCreateAcc"
                    onClick={clickShowHidePassword}
                  >
                    {isShowPassword ? (
                      <MdVisibility />
                    ) : (
                      <MdOutlineVisibility />
                    )}
                  </div>
                </Form.Group>
                <Form.Group className="formRowBox" id="validationFormik01">
                  <Form.Label htmlFor="confirmPassword">
                    Nhập lại mật khẩu
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      name="confirmPassword"
                      type="password"
                      id="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      // isValid={
                      //   touched.confirmPassword && !errors.confirmPassword
                      // }
                      isInvalid={!!errors.confirmPassword && values.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Label>Thông tin cá nhân</Form.Label>
                <Form.Group className="formRowBox" id="validationFormik01">
                  <Form.Label htmlFor="name">Họ tên</Form.Label>
                  <InputGroup>
                    <Form.Control
                      name="name"
                      type="text"
                      id="name"
                      value={values.name}
                      onChange={handleChange}
                      isValid={touched.name && !errors.name}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="formRowBox" id="validationFormik01">
                  <Form.Label htmlFor="phone">Số điện thoại</Form.Label>
                  <InputGroup>
                    <Form.Control
                      name="phone"
                      type="text"
                      id="phone"
                      value={values.phone}
                      onChange={handleChange}
                      isValid={touched.phone && !errors.phone}
                      isInvalid={!!errors.phone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </div>
              <div className="buttonBox">
                <Button
                  type="submit"
                  className="createAccountButton"
                  onClick={handleSubmit}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="createAccountButton"
                  onClick={handleSubmit}
                >
                  Lưu
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
