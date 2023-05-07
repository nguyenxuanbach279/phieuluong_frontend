import React, { useState } from "react";
import "../css/SalaryView.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import moment from "moment";
import { MdOutlineVisibility, MdVisibility } from "react-icons/md";
export default function SalaryView() {
  const [employeeDetail, setEmployeeDetail] = useState("");
  const [open, setOpen] = React.useState(true);
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const location = useLocation();
  const { search } = location;
  const id = search.slice(4);

  const getDetailEmployee = async () => {
    try {
      const employeeDataRes = await api.getInfoEmployeePrivate(id, password);
      if (employeeDataRes.status === 200) {
        setEmployeeDetail(employeeDataRes.data.data);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changePassword = (e) => {
    setPassword(e.target.value);
  };

  const clickSendPassword = () => {
    getDetailEmployee();
  };

  const totalSalary = Math.floor(
    ((employeeDetail.basicSalary * employeeDetail.coefficyTimeKeeping) / 22) *
      employeeDetail.coefficyPower -
      employeeDetail.insurance -
      employeeDetail.taxFee -
      employeeDetail.advance
  );

  const departments = [
    "Giám đốc",
    "Quản lý",
    "Sản xuất",
    "Nhân sự",
    "Kế toán",
    "Bán hàng",
    "Hành chính",
  ];

  console.log(password);

  const submitSalary = async () => {
    try {
      const updateStatusRes = await api.updateEmployeePayCheckStatus(id, 2);
      if (updateStatusRes.status === 200) {
        toast.success("Xác nhận phiếu lương thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const reportSalary = async () => {
    try {
      const updateStatusRes = await api.updateEmployeePayCheckStatus(id, 3);
      if (updateStatusRes.status === 200) {
        toast.success("Không xác nhận phiếu lương");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clickShowHidePassword = () => {
    setIsShowPassword((pre) => !pre);
  };

  return (
    <>
      {employeeDetail ? (
        <div className="salaryViewContainer">
          <div className="salaryViewBox">
            <p className="salaryViewTitle">
              Xác thực phiếu lương tháng{" "}
              {employeeDetail.month < 10
                ? `0${employeeDetail.month}`
                : employeeDetail.month}
            </p>
            <div className="salaryDetail">
              <Stack flexDirection="column" rowGap={2} alignItems="flex-start">
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="editEmployeeInfo">
                    Họ và tên:
                  </Typography>
                  <Typography>{employeeDetail.name}</Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="editEmployeeInfo">
                    Mã nhân viên:
                  </Typography>
                  <Typography>{employeeDetail.employeeCode}</Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="editEmployeeInfo">
                    Địa chỉ gmail:
                  </Typography>
                  <Typography>{employeeDetail.email}</Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="editEmployeeInfo">Chức vụ:</Typography>
                  <Typography>{employeeDetail.currentLevel}</Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="editEmployeeInfo">
                    Lương cơ bản:
                  </Typography>
                  <Typography>
                    {employeeDetail?.basicSalary?.toLocaleString("it-IT")}{" "}
                    <span style={{ fontSize: 14 }}>VNĐ</span>
                  </Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="editEmployeeInfo">Hệ số:</Typography>
                  <Typography>
                    {employeeDetail.coefficyPower?.toFixed(2)}
                  </Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="editEmployeeInfo">
                    Số điện thoại:
                  </Typography>
                  <Typography>{employeeDetail.phone}</Typography>
                </Stack>
              </Stack>
              <Stack flexDirection="column" rowGap={2} alignItems="flex-start">
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="salaryviewInfo">Phòng ban:</Typography>
                  <Typography>
                    {departments[employeeDetail.departmentID]}
                  </Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="salaryviewInfo">
                    Chỉ số chấm công:
                  </Typography>
                  <Typography>
                    {employeeDetail.coefficyTimeKeeping} công
                  </Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="salaryviewInfo">Ngày sinh:</Typography>
                  <Typography>
                    {moment(employeeDetail.doB, "YYYY-MM-DDTHH:mm:ss").format(
                      "DD-MM-YYYY"
                    )}
                  </Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="salaryviewInfo">
                    Tiền bảo hiểm:
                  </Typography>
                  <Typography>
                    {employeeDetail.insurance?.toLocaleString("it-IT")}{" "}
                    <span style={{ fontSize: 14 }}>VNĐ</span>
                  </Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="salaryviewInfo">Thuế TNCN:</Typography>
                  <Typography>
                    {employeeDetail.taxFee?.toLocaleString("it-IT")}{" "}
                    <span style={{ fontSize: 14 }}>VNĐ</span>
                  </Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="salaryviewInfo">
                    Tiền ứng trước:
                  </Typography>
                  <Typography>
                    {employeeDetail.advance?.toLocaleString("it-IT")}{" "}
                    <span style={{ fontSize: 14 }}>VNĐ</span>
                  </Typography>
                </Stack>
              </Stack>
            </div>
            <div className="totalSalary">
              <p>
                Tổng lương được nhận: {employeeDetail.finalSalary?.toLocaleString("it-IT")}{" "}
                <span style={{ fontSize: 14 }}>VNĐ</span>
              </p>
            </div>
            <div className="salaryViewActions">
              <Button variant="contained" onClick={reportSalary}>
                Không xác nhận
              </Button>
              <Button variant="contained" onClick={submitSalary}>
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Yêu cầu nhập mật khẩu</DialogTitle>
        <DialogContent
          sx={{
            minWidth: 500,
            minHeight: 50,
            display: "flex",
          }}
        >
          <TextField
            fullWidth
            type={isShowPassword ? "text" : "password"}
            variant="standard"
            value={password}
            onChange={changePassword}
          />
          <div
            className="visibilityIconCreateAcc"
            onClick={clickShowHidePassword}
          >
            {isShowPassword ? <MdVisibility /> : <MdOutlineVisibility />}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            sx={{ width: 80, height: 40 }}
            onClick={clickSendPassword}
          >
            Gửi
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
