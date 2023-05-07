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
} from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import api from "../services/api";
import { AppContext } from "../contexts/app.context";
import { toast } from "react-toastify";
import moment from "moment/moment";

export default function EditEmployee() {
  const { appState } = useContext(AppContext);
  const location = useLocation();
  const [employeeDetail, setEmployeeDetail] = useState({});
  const [employeeName, setEmployeeName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeePhone, setEmployeePhone] = useState("");
  const [employeeDepartmentID, setEmployeeDepartmentID] = useState(1);
  const [employeePosition, setEmployeePosition] = useState("");
  const [employeeSalary, setEmployeeSalary] = useState("");
  const [employeeCoefficyPower, setEmployeeCoefficyPower] = useState("");
  const [employeeCoefficyTimeKeeping, setEmployeeCoefficyTimeKeeping] =
    useState("");
  const [employeeInsurance, setEmployeeInsurance] = useState("");
  const [employeeDoB, setEmployeeDoB] = useState("");
  const [salaryMonth, setSalaryMonth] = useState(1);
  const [taxFee, setTaxFee] = useState("");
  const [employeeStatusPaycheck, setEmployeeStatusPaycheck] = useState("");
  const [employeeStatusPayment, setEmployeeStatusPayment] = useState(0);
  const [employeeStatusEmployee, setEmployeeStatusEmployee] = useState(-1);
  const [employeeAdvance, setEmployeeAdvance] = useState("");
  const [totalSalary, setTotalSalary] = useState(0);

  const departments = [
    "Giám đốc",
    "Quản lý",
    "Sản xuất",
    "Nhân sự",
    "Kế toán",
    "Bán hàng",
    "Hành chính",
  ];

  const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  useEffect(() => {
    setTotalSalary(
      Math.floor(
        ((employeeSalary * employeeCoefficyTimeKeeping) / 22) *
          employeeCoefficyPower -
          employeeInsurance -
          taxFee -
          employeeAdvance
      )
    );
  }, [
    employeeSalary,
    employeeCoefficyTimeKeeping,
    employeeCoefficyPower,
    employeeInsurance,
    taxFee,
    employeeAdvance,
  ]);

  console.log(totalSalary);

  useEffect(() => {
    if (location.pathname === "/appointment/employee/edit") {
      getDetailEmployee();
    }
  }, []);

  const getDetailEmployee = async () => {
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
        setTotalSalary(employeeDataRes.data.data.finalSalary)
      }
    } catch (error) {
      console.log(error);
    }
  };
console.log(employeeDetail)
  const onChangeName = (e) => {
    setEmployeeName(e.target.value);
  };

  const onChangePosition = (e) => {
    setEmployeePosition(e.target.value);
  };

  const onChangeSalary = (e) => {
    setEmployeeSalary(e.target.value);
  };

  const onChangeCoefficyPower = (e) => {
    setEmployeeCoefficyPower(e.target.value);
  };

  const onChangeSalaryMonth = (e) => {
    setSalaryMonth(e.target.value);
  };

  const onChangePaymentStatus = (e) => {
    setEmployeeStatusPayment(e.target.value);
  };

  const onChangePhone = (e) => {
    setEmployeePhone(e.target.value);
  };

  const onChangeCoefficyTimeKeeping = (e) => {
    setEmployeeCoefficyTimeKeeping(e.target.value);
  };

  const onChangeDepartmentID = (e) => {
    setEmployeeDepartmentID(e.target.value);
  };

  const onChangeEmployeeDoB = (e) => {
    setEmployeeDoB(e.target.value);
  };

  const onChangeInsurance = (e) => {
    setEmployeeInsurance(e.target.value);
  };

  const onChangeStatusEmployee = (e) => {
    setEmployeeStatusEmployee(e.target.value);
  };

  const onChangeTaxFee = (e) => {
    setTaxFee(e.target.value);
  };

  const onChangeEmployeeCode = (e) => {
    setEmployeeCode(e.target.value);
  };

  const onChangeEmployeeEmail = (e) => {
    setEmployeeEmail(e.target.value);
  };

  const onChangeAdvance = (e) => {
    setEmployeeAdvance(e.target.value);
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
      finalSalary: 1000000,
    };

    console.log(data);

    try {
      if (location.pathname === "/appointment/employee/edit") {
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
        if (createEmployeeRes.status === 200) {
          toast.success("Thêm thành công");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="editEmployeeContainer">
      <div className="editEmployeeTitleBox">
        <p className="editEmployeeTitle">
          {location.pathname === "/appointment/employee/edit"
            ? "Chỉnh sửa thông tin nhân viên"
            : "Tạo nhân viên mới"}
        </p>

        <div className="editEmployeeAction">
          {/* <Button variant="contained" style={{ minWidth: 120, height: 50 }}>
            Hủy
          </Button> */}
          {location.pathname === "/appointment/employee/edit" ? (
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
          <Stack flexDirection="column" rowGap={2} alignItems="center">
            <Stack
              flexDirection="row"
              columnGap={2}
              alignItems="center"
              height={48}
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
            <Stack flexDirection="row" columnGap={2} alignItems="center">
              <Typography className="editEmployeeInfo">Mã nhân viên</Typography>
              <TextField
                value={employeeCode}
                type="text"
                style={{ width: 200 }}
                inputProps={{
                  style: {
                    height: "23px",
                    padding: "12.5px",
                  },
                }}
                onChange={onChangeEmployeeCode}
              />
            </Stack>
            {location.pathname === "/appointment/employee/edit" ? (
              <>
                <Stack flexDirection="row" columnGap={2} alignItems="center">
                  <Typography className="editEmployeeInfo">
                    Địa chỉ gmail
                  </Typography>
                  <TextField
                    value={employeeEmail}
                    type="email"
                    style={{ width: 200 }}
                    inputProps={{
                      style: {
                        readOnly: true,
                        height: "23px",
                        padding: "12.5px",
                      },
                    }}
                  />
                </Stack>
              </>
            ) : (
              <>
                <Stack flexDirection="row" columnGap={2} alignItems="center">
                  <Typography className="editEmployeeInfo">
                    Địa chỉ gmail
                  </Typography>
                  <TextField
                    value={employeeEmail}
                    type="email"
                    style={{ width: 200 }}
                    inputProps={{
                      style: {
                        height: "23px",
                        padding: "12.5px",
                      },
                    }}
                    onChange={onChangeEmployeeEmail}
                  />
                </Stack>
              </>
            )}

            <Stack flexDirection="row" columnGap={2} alignItems="center">
              <Typography className="editEmployeeInfo">Chức vụ</Typography>
              <TextField
                value={employeePosition}
                type="text"
                style={{ width: 200 }}
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
            >
              <Typography className="editEmployeeInfo">Lương cơ bản</Typography>
              <TextField
                value={employeeSalary}
                type="text"
                style={{ width: 200 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">VNĐ</InputAdornment>
                  ),
                }}
                inputProps={{
                  style: {
                    height: "23px",
                    padding: "12.5px",
                  },
                }}
                onChange={onChangeSalary}
              />
            </Stack>
            <Stack flexDirection="row" columnGap={2} alignItems="center">
              <Typography className="editEmployeeInfo">Hệ số</Typography>
              <TextField
                value={employeeCoefficyPower}
                type="text"
                style={{ width: 200 }}
                inputProps={{
                  style: {
                    height: "23px",
                    padding: "12.5px",
                  },
                }}
                onChange={onChangeCoefficyPower}
              />
            </Stack>
            <Stack flexDirection="row" columnGap={2} alignItems="center">
              <Typography className="editEmployeeInfo">
                Số điện thoại
              </Typography>
              <TextField
                value={employeePhone}
                type="text"
                style={{ width: 200 }}
                inputProps={{
                  style: {
                    height: "23px",
                    padding: "12.5px",
                  },
                }}
                onChange={onChangePhone}
              />
            </Stack>
            <Stack flexDirection="row" columnGap={2} alignItems="center">
              <Typography className="editEmployeeInfo">Thanh toán</Typography>
              <FormControl style={{ width: 200, height: 48 }}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={employeeStatusPayment}
                  onChange={onChangePaymentStatus}
                  sx={{ height: 48 }}
                >
                  <MenuItem value="0">Chưa thanh toán</MenuItem>
                  <MenuItem value="1">Đã thanh toán</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>

          <Stack flexDirection="column" rowGap={2} alignItems="flex-start">
            <Stack flexDirection="row" columnGap={2} alignItems="center">
              <Typography className="editEmployeeInfo">
                Chỉ số chấm công
              </Typography>
              <TextField
                value={employeeCoefficyTimeKeeping}
                type="text"
                style={{ width: 200 }}
                onChange={onChangeCoefficyTimeKeeping}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">công</InputAdornment>
                  ),
                }}
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

            <Stack flexDirection="row" columnGap={2} alignItems="center">
              <Typography className="editEmployeeInfo">
                Tiền bảo hiểm
              </Typography>
              <TextField
                value={employeeInsurance}
                type="text"
                onChange={onChangeInsurance}
                style={{ width: 200 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">VNĐ</InputAdornment>
                  ),
                }}
                inputProps={{
                  style: {
                    height: "23px",
                    padding: "12.5px",
                  },
                }}
              />
            </Stack>
            <Stack flexDirection="row" columnGap={2} alignItems="center">
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
            <Stack
              flexDirection="row"
              columnGap={2}
              alignItems="center"
              height={48}
            >
              <Typography className="editEmployeeInfo">Thuế TNCN</Typography>
              <TextField
                value={taxFee}
                type="text"
                style={{ width: 200 }}
                onChange={onChangeTaxFee}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">VNĐ</InputAdornment>
                  ),
                }}
                inputProps={{
                  style: {
                    height: "23px",
                    padding: "12.5px",
                  },
                }}
              />
            </Stack>
            <Stack flexDirection="row" columnGap={2} alignItems="center">
              <Typography className="editEmployeeInfo">
                Tiền ứng trước
              </Typography>
              <TextField
                value={employeeAdvance}
                type="text"
                style={{ width: 200 }}
                onChange={onChangeAdvance}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">VNĐ</InputAdornment>
                  ),
                }}
                inputProps={{
                  style: {
                    height: "23px",
                    padding: "12.5px",
                  },
                }}
              />
            </Stack>
            <Stack flexDirection="row" columnGap={2} alignItems="center">
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
            <Stack flexDirection="row" columnGap={2} alignItems="center">
              <Typography className="editEmployeeInfo">Tháng</Typography>
              <FormControl style={{ width: 200, height: 48 }}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={salaryMonth}
                  onChange={onChangeSalaryMonth}
                  sx={{ height: 48 }}
                >
                  {month.map((item, index) => {
                    return (
                      <MenuItem value={index + 1} key={item}>
                        {item}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Stack>
          </Stack>

          <Stack flexDirection="column" rowGap={2} alignItems="flex-start">
            <Stack flexDirection="row" columnGap={2} alignItems="center">
              <Typography width="280px">
                Tổng lương nhận: {totalSalary.toLocaleString("it-IT")} VNĐ
              </Typography>
            </Stack>
          </Stack>
        </div>
      </div>
    </div>
  );
}
