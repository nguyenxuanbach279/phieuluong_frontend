import React, { useContext, useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { Button } from "@mui/material";
import { Formik } from "formik";
import { MdOutlineVisibility, MdVisibility } from "react-icons/md";
import "../css/CreateAccount.css";
import * as Yup from "yup";
import { AppContext } from "../contexts/app.context";
import api from "../services/api";
import { toast } from "react-toastify";

const createAccountSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(2, "Too Short!")
    .max(24, "Too Long!")
    .required("Required"),
});

export default function CreateAccount() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const { appState, setIsLoading } = useContext(AppContext);

  useEffect(() => {
    if (appState.accountInfo.isAdmin == 0) {
      toast.error("Bạn cần cấp quyền");
    }
  }, []);

  const clickShowHidePassword = () => {
    setIsShowPassword((pre) => !pre);
  };

  const onClickCreateAccount = async (value) => {
    const isAdmin = value.position === "Kế toán" ? 0 : 1;

    const newAccount = {
      id: `abc${Math.floor(Math.random() * 1000)}`,
      name: "User name",
      email: value.email,
      password: value.password,
      isAdmin: isAdmin,
      createdBy: appState.accountInfo.name,
      modifiedBy: appState.accountInfo.name,
    };
    setIsLoading(true)
    try {
      const createNewAccountRes = await api.createNewAccount(
        appState.jwtToken,
        newAccount
      );
      if (createNewAccountRes.data.status === 200) {
        toast.success(createNewAccountRes.data.message);
      } else {
        toast.error(createNewAccountRes.data.message);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false)
  };

  return (
    <div className="accountContainer">
      {appState.accountInfo.isAdmin == 1 && (
        <>
          <div className="accountTitleBox">
            <p className="accountTitle">Tạo tài khoản</p>
          </div>
          <div className="createAccountContent">
            <Formik
              validationSchema={createAccountSchema}
              onSubmit={(values) => onClickCreateAccount(values)}
              initialValues={{
                email: "",
                password: "",
                position: "Kế toán",
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
                        {isShowPassword ? (
                          <MdVisibility />
                        ) : (
                          <MdOutlineVisibility />
                        )}
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
                        <option value="Nhân viên">Kế Toán</option>
                        <option value="Quản trị viên">Quản lý</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                  <div className="buttonBox">
                    <Button
                      type="submit"
                      variant="contained"
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
        </>
      )}
    </div>
  );
}
