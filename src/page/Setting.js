import React, { useContext, useState } from "react";
import "../css/SettingPage.css";
import * as Yup from "yup";
import { Formik } from "formik";
import { Button, Form, InputGroup } from "react-bootstrap";
import { MdOutlineVisibility, MdVisibility } from "react-icons/md";
import { AppContext } from "../contexts/app.context";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .notRequired()
    .nullable()
    .min(2, "Too Short!")
    .max(24, "Too Long!"),
  password: Yup.string()
    .notRequired()
    .nullable()
    .min(2, "Too Short!")
    .max(24, "Too Long!")
    .when("oldPassword", (oldPassword, field) =>
      oldPassword ? field.required() : field
    ),
  confirmPassword: Yup.string()
    .notRequired()
    .nullable()
    .when("password", (password, field) =>
      password ? field.required().oneOf([Yup.ref("password")]) : field
    ),
});

const changeUserInfoSchema = Yup.object().shape({
  name: Yup.string().required(),
  phone: Yup.string().required(),
});

export default function Setting() {
  const navigate = useNavigate();
  const { appState, dispatch } = useContext(AppContext);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
    name: appState.accountInfo.name,
    phone: "0123456789",
  });

  const clickShowHidePassword = () => {
    setIsShowPassword((pre) => !pre);
  };

  const handleSubmit = async (values) => {
    const newData = {
      id: appState.accountInfo.id,
      name: values.name,
      email: appState.accountInfo.email,
      password:
        values.password === ""
          ? appState.accountInfo.password
          : values.password,
      isAdmin: appState.accountInfo.isAdmin,
      createdBy: appState.accountInfo.createdBy,
      modifiedBy: appState.accountInfo.name,
    };

    try {
      const updateAccountRes = await api.updateAccount(
        appState.jwtToken,
        newData
      );
      if (updateAccountRes.status === 200) {
        if (
          values.password !== "" &&
          values.oldPassword == appState.accountInfo.password
        ) {
          toast.success("Cập nhập mật khẩu thành công");
          setOpen(true);
        } else {
          const accountInfoRes = await api.getAccountInfo(
            appState.jwtToken,
            appState.accountInfo.id
          );
          const accountInfo = accountInfoRes.data.data;
          console.log(accountInfoRes);
          dispatch({
            type: "SET_ACCOUNT_INFO",
            accountInfo: accountInfo,
          });
          toast.success("Cập nhập thành công");
        }
      } else {
        toast.error("Mật khẩu cũ không đúng");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loginAgain = () => {
    navigate("/login");
    dispatch({
      type: "RESET_STATE",
    });
  };

  return (
    <div className="settingContainer">
      <div className="settingTitleBox">
        <p className="settingTitle">Cài đặt tài khoản</p>
      </div>

      <div className="settingContent">
        <Formik
          validationSchema={changePasswordSchema}
          initialValues={state}
          onSubmit={(values) => handleSubmit(values)}
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
                      isValid={touched.password && !errors.oldPassword}
                      isInvalid={!!errors.oldPassword}
                      autoComplete="current-password"
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
                      autoComplete="new-password"
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
                <Form.Group className="formRowBox" id="validationFormik03">
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
                      isValid={
                        touched.confirmPassword && !errors.confirmPassword
                      }
                      isInvalid={!!errors.confirmPassword && values.password}
                      autoComplete="confirm-password"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
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
                  Lưu
                </Button>
              </div>
            </Form>
          )}
        </Formik>
        <Formik
          validationSchema={changeUserInfoSchema}
          initialValues={state}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ handleSubmit, handleChange, values, errors, touched }) => (
            <Form noValidate className="settingAccountBox">
              <div className="formSettingAccount">
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
                  Lưu
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Yêu cầu đăng nhập lại</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Mật khẩu cập nhập thành công. Bạn có muốn đăng nhập lại?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={loginAgain} autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
