import React, { useCallback, useContext, useEffect, useState } from "react";
import "../css/EditEmployee.css";
import {
  Button,
  FormControl,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Typography,
  Divider,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import api from "../services/api";
import { AppContext } from "../contexts/app.context";
import { toast } from "react-toastify";
import moment from "moment/moment";
import * as signalR from "@aspnet/signalr";
import { Table } from "react-bootstrap";

export default function EditEmployee() {
    var d = new Date()
  const { appState, setIsLoading, setNoticationIsOpen, name, setName } =
    useContext(AppContext);
  const location = useLocation();
  const [employeeDetail, setEmployeeDetail] = useState({});
  const [employeeName, setEmployeeName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeePhone, setEmployeePhone] = useState("");
  const [employeeDepartmentID, setEmployeeDepartmentID] = useState(1);
  const [employeePosition, setEmployeePosition] = useState("");
  const [employeeSalary, setEmployeeSalary] = useState(0);
  const [employeeCoefficyPower, setEmployeeCoefficyPower] = useState(0);
  const [employeeCoefficyTimeKeeping, setEmployeeCoefficyTimeKeeping] =
    useState(0);
  const [employeeInsurance, setEmployeeInsurance] = useState(0);
  const [employeeDoB, setEmployeeDoB] = useState("");
  const [salaryMonth, setSalaryMonth] = useState(5);
  const [taxFee, setTaxFee] = useState(0);
  const [employeeStatusPaycheck, setEmployeeStatusPaycheck] = useState(0);
  const [employeeStatusPayment, setEmployeeStatusPayment] = useState(0);
  const [employeeStatusEmployee, setEmployeeStatusEmployee] = useState(-1);
  const [employeeAdvance, setEmployeeAdvance] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const [year, setYear] = useState(2023);
  const [salaryBonus, setSalaryBonus] = useState(0);
  const [reasonBonus, setReasonBonus] = useState("");
  const [historySalary, setHistorySalary] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const departments = [
    "Giám đốc",
    "Quản lý",
    "Sản xuất",
    "Nhân sự",
    "Kế toán",
    "Bán hàng",
    "Hành chính",
  ];

  const employeeStatus = [
    "Chưa cập nhập",
    "Đang làm",
    "Nghỉ việc",
    "Nghỉ thai sản",
  ];

  const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  useEffect(() => {
    setTotalSalary(
      Math.floor(
        ((employeeSalary * employeeCoefficyTimeKeeping) / 22) *
          employeeCoefficyPower -
          employeeInsurance -
          taxFee -
          employeeAdvance -
          salaryBonus * -1
      )
    );
  }, [
    employeeSalary,
    employeeCoefficyTimeKeeping,
    employeeCoefficyPower,
    employeeInsurance,
    taxFee,
    employeeAdvance,
    salaryBonus,
  ]);

  useEffect(() => {
    if (location.pathname === "/staff/edit") {
      getDetailEmployee();
    }
  }, []);

  const getDetailEmployee = async () => {
    setIsLoading(true);
    try {
      const employeeDataRes = await api.getInfoEmployee(
        appState.jwtToken,
        appState.employeeIdEdit
      );
      if (employeeDataRes.status === 200) {
        setEmployeeDetail(employeeDataRes.data.data);
        setEmployeeName(employeeDataRes.data.data.name);
        setEmployeeCode(employeeDataRes.data.data.employeeCode);
        setEmployeeEmail(employeeDataRes.data.data.email);
        setEmployeePosition(employeeDataRes.data.data.currentLevel);
        setEmployeeSalary(employeeDataRes.data.data.basicSalary);
        setEmployeeCoefficyPower(employeeDataRes.data.data.coefficyPower);
        setEmployeePhone(employeeDataRes.data.data.phone);
        setEmployeeDepartmentID(employeeDataRes.data.data.departmentID);
        setEmployeeCoefficyTimeKeeping(
          employeeDataRes.data.data.coefficyTimeKeeping
        );
        setEmployeeDoB(
          moment(employeeDataRes.data.data.doB, "YYYY-MM-DDTHH:mm:ss").format(
            "YYYY-MM-DD"
          )
        );
        setEmployeeInsurance(employeeDataRes.data.data.insurance);
        setSalaryMonth(employeeDataRes.data.data.month);
        setEmployeeStatusPaycheck(employeeDataRes.data.data.statusPaycheck);
        setEmployeeStatusPayment(employeeDataRes.data.data.paymentStatus);
        setTaxFee(employeeDataRes.data.data.taxFee);
        setEmployeeAdvance(employeeDataRes.data.data.advance);
        setEmployeeStatusEmployee(employeeDataRes.data.data.statusEmployee);
        setSalaryMonth(employeeDataRes.data.data.month);
        setTotalSalary(employeeDataRes.data.data.finalSalary);
        setYear(employeeDataRes.data.data.year);
        setSalaryBonus(employeeDataRes.data.data.salaryBonus);
        setReasonBonus(employeeDataRes.data.data.reasonBonus);
        setHistorySalary(employeeDataRes.data.data.historySalary);
        setBankName(employeeDataRes.data.data.bankName);
        setBankCode(employeeDataRes.data.data.bankCode);
        setBankBranch(employeeDataRes.data.data.bankBranch);
        setAccountName(employeeDataRes.data.data.accountName);
        setAccountNumber(employeeDataRes.data.data.accountNumber);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const onChangeName = (e) => {
    setEmployeeName(e.target.value);
  };

  const onChangePosition = (e) => {
    setEmployeePosition(e.target.value);
  };

  const onChangePhone = (e) => {
    setEmployeePhone(e.target.value);
  };

  const onChangeDepartmentID = (e) => {
    setEmployeeDepartmentID(e.target.value);
  };

  const onChangeEmployeeDoB = (e) => {
    setEmployeeDoB(e.target.value);
  };

  const onChangeStatusEmployee = (e) => {
    setEmployeeStatusEmployee(e.target.value);
  };

  const onChangeEmployeeCode = (e) => {
    setEmployeeCode(e.target.value);
  };

  const onChangeEmployeeEmail = (e) => {
    setEmployeeEmail(e.target.value);
  };

  const clickSaveEmployeeInfo = async () => {
    const data = {
      id: employeeDetail.id || `abc${Math.floor(Math.random() * 1000000)}`,
      name: employeeName,
      doB: employeeDoB,
      email: employeeEmail,
      currentLevel: employeePosition,
      departmentID: employeeDepartmentID,
      phone: employeePhone,
      employeeCode: employeeCode,
      statusEmployee: parseInt(employeeStatusEmployee),
      basicSalary: employeeSalary,
      coefficyTimeKeeping: employeeCoefficyTimeKeeping,
      coefficyPower: employeeCoefficyPower,
      taxFee: taxFee,
      insurance: employeeInsurance,
      advance: employeeAdvance,
      month: salaryMonth,
      statusPaycheck: employeeStatusPaycheck,
      paymentStatus: employeeStatusPayment,
      finalSalary: totalSalary,
      reasonBonus: reasonBonus,
      salaryBonus: salaryBonus,
      year: year,
      historySalary: historySalary,
      bankName: bankName,
      bankBranch: bankBranch,
      bankCode: bankCode,
      accountName: accountName,
      accountNumber: accountNumber,
    };

    setIsLoading(true);

    try {
      if (location.pathname === "/staff/edit") {
        const updateInfoEmployeeRes = await api.updateInfoEmployee(
          appState.jwtToken,
          data
        );
        if (updateInfoEmployeeRes.status === 200) {
          toast.success("Cập nhập thành công");
        }
      } else {
        const createEmployeeRes = await api.createEmployee(
          appState.jwtToken,
          data
        );
        if (createEmployeeRes?.data?.status === 201) {
          toast.success("Thêm thành công");
        } else {
          toast.error(createEmployeeRes?.data?.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="editEmployeeContainer">
      <div className="editEmployeeTitleBox">
        <p className="editEmployeeTitle">
          {location.pathname === "/staff/edit"
            ? `Chỉnh sửa thông tin nhân viên`
            : "Tạo nhân viên mới"}
        </p>

        <div className="editEmployeeAction">
          {location.pathname === "/staff/edit" ? (
            <>
              <Button
                variant="contained"
                style={{ minWidth: 120, height: 50 }}
                onClick={clickSaveEmployeeInfo}
              >
                Lưu
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                style={{ minWidth: 120, height: 50 }}
                onClick={clickSaveEmployeeInfo}
              >
                Tạo
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="editEmployeeContentBox">
        <div className="editEmployeeBox">
          <Stack flexDirection="row" columnGap="80px">
            <Stack flexDirection="column" rowGap={2} alignItems="center">
              <Stack
                flexDirection="row"
                columnGap={2}
                alignItems="center"
                height={48}
                justifyContent="flex-start"
                width="100%"
              >
                <Typography className="editEmployeeInfo">Họ và tên</Typography>

                <TextField
                  value={employeeName}
                  type="text"
                  sx={{ width: 200 }}
                  inputProps={{
                    style: {
                      height: "23px",
                      padding: "12.5px",
                    },
                  }}
                  onChange={onChangeName}
                />
              </Stack>

              <Stack
                flexDirection="row"
                columnGap={2}
                alignItems="center"
                height={48}
                justifyContent="flex-start"
                width="100%"
              >
                <Typography className="editEmployeeInfo">
                  Địa chỉ gmail
                </Typography>

                <TextField
                  value={employeeEmail}
                  type="text"
                  sx={{ width: 200 }}
                  inputProps={{
                    style: {
                      height: "23px",
                      padding: "12.5px",
                    },
                  }}
                  onChange={onChangeEmployeeEmail}
                />
              </Stack>
              <Stack
                flexDirection="row"
                columnGap={2}
                alignItems="center"
                height={48}
                justifyContent="flex-start"
                width="100%"
              >
                <Typography className="editEmployeeInfo">Chức vụ</Typography>

                <TextField
                  value={employeePosition}
                  type="text"
                  sx={{ width: 200 }}
                  inputProps={{
                    style: {
                      height: "23px",
                      padding: "12.5px",
                    },
                  }}
                  onChange={onChangePosition}
                />
              </Stack>
              <Stack
                flexDirection="row"
                columnGap={2}
                alignItems="center"
                height={48}
                justifyContent="flex-start"
                width="100%"
              >
                <Typography className="editEmployeeInfo">
                  Số điện thoại
                </Typography>

                <TextField
                  value={employeePhone}
                  type="text"
                  sx={{ width: 200 }}
                  inputProps={{
                    style: {
                      height: "23px",
                      padding: "12.5px",
                    },
                  }}
                  onChange={onChangePhone}
                />
              </Stack>
            </Stack>

            <Stack flexDirection="column" rowGap={2} alignItems="flex-start">
              <Stack
                flexDirection="row"
                columnGap={2}
                alignItems="center"
                height={48}
                justifyContent="flex-start"
                width="100%"
              >
                <Typography className="editEmployeeInfo">
                  Mã nhân viên
                </Typography>

                <TextField
                  value={employeeCode}
                  type="text"
                  sx={{ width: 200 }}
                  inputProps={{
                    style: {
                      height: "23px",
                      padding: "12.5px",
                    },
                  }}
                  onChange={onChangeEmployeeCode}
                />
              </Stack>
              <Stack
                flexDirection="row"
                columnGap={2}
                alignItems="center"
                height={48}
              >
                <Typography className="editEmployeeInfo">Phòng ban</Typography>

                <FormControl style={{ width: 200, height: 48 }}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={employeeDepartmentID}
                    onChange={onChangeDepartmentID}
                    sx={{ height: 48 }}
                  >
                    {departments.map((item, index) => {
                      return (
                        <MenuItem value={index + 1} key={item}>
                          {item}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Stack>

              <Stack
                flexDirection="row"
                columnGap={2}
                alignItems="center"
                justifyContent="flex-start"
                height={48}
              >
                <Typography className="editEmployeeInfo" align="left">
                  Ngày sinh
                </Typography>

                <TextField
                  value={employeeDoB}
                  type="date"
                  onChange={onChangeEmployeeDoB}
                  sx={{ width: 200 }}
                  inputProps={{
                    style: {
                      height: "23px",
                      padding: "12.5px",
                    },
                  }}
                />
              </Stack>
              <Stack
                flexDirection="row"
                columnGap={2}
                alignItems="center"
                justifyContent="flex-start"
                width="100%"
                height={48}
              >
                <Typography className="editEmployeeInfo">Trạng thái</Typography>

                <FormControl style={{ width: 200, height: 48 }}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={employeeStatusEmployee}
                    onChange={onChangeStatusEmployee}
                    sx={{ height: 48 }}
                  >
                    <MenuItem value="0">Chưa cập nhập</MenuItem>
                    <MenuItem value="1">Đang làm</MenuItem>
                    <MenuItem value="2">Nghỉ việc</MenuItem>
                    <MenuItem value="3">Nghỉ thai sản</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </Stack>
        </div>
      </div>
    </div>
  );
}
