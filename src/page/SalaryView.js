import React, { useContext, useEffect, useState } from "react";
import "../css/SalaryView.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";
import { AppContext } from "../contexts/app.context";
import api from "../services/api";
import moment from "moment";
export default function SalaryView() {
  const { appState, dispatch } = useContext(AppContext);
  const [employeeDetail, setEmployeeDetail] = useState("");
  const [open, setOpen] = React.useState(true);
  const [password, setPassword] = useState("")
  const location = useLocation();
  const { search } = location;
  const id = search.slice(4);

  // useEffect(() => {
  //   getDetailEmployee();
  // }, []);

  const getDetailEmployee = async () => {
    try {
      const employeeDataRes = await api.getInfoEmployee(appState.jwtToken, id);
      if (employeeDataRes.status === 200) {
        setEmployeeDetail(employeeDataRes.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changePassword = (e) => {
    setPassword(e.target.value)
  }

  const clickSendPassword = () => {
    
  }

  const totalSalary =
    ((employeeDetail.basicSalary * employeeDetail.coefficyTimeKeeping) / 22) *
      employeeDetail.coefficyPower -
    employeeDetail.insurance -
    employeeDetail.taxFee -
    employeeDetail.advance;

  const departments = [
    "Giám đốc",
    "Quản lý",
    "Sản xuất",
    "Nhân sự",
    "Kế toán",
    "Bán hàng",
    "Hành chính",
  ];

  const submitSalary = async () => {
    try {
      const updateStatusRes = api.updateEmployeePayCheckStatus(id, 2);
      if (updateStatusRes.status === 200) {
        toast.success("Xác nhận phiếu lương thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const reportSalary = () => {
    try {
      const updateStatusRes = api.updateEmployeePayCheckStatus(id, 3);
      if (updateStatusRes.status === 200) {
        toast.success("Phản hồi của bạn đã được ghi nhận");
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(employeeDetail);

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
                  <Typography>{employeeDetail.coefficyTimeKeeping}</Typography>
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
                Tổng lương được nhận: {totalSalary?.toLocaleString("it-IT")}{" "}
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
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Yêu cầu nhập mật khẩu</DialogTitle>
        <DialogContent
          sx={{
            minWidth: 500,
            minHeight: 50
          }}
        >
          <TextField fullWidth type="text" variant="standard" value={password} onChange={changePassword}/>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" sx={{width: 80, height: 40}} onClick={() => clickSendPassword}>Gửi</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
