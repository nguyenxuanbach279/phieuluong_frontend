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
  const [employeeSalary, setEmployeeSalary] = useState("");
  const [employeeCoefficyPower, setEmployeeCoefficyPower] = useState("");
  const [employeeCoefficyTimeKeeping, setEmployeeCoefficyTimeKeeping] =
    useState("");
  const [employeeInsurance, setEmployeeInsurance] = useState("");
  const [employeeDoB, setEmployeeDoB] = useState("");
  const [salaryMonth, setSalaryMonth] = useState(1);
  const [taxFee, setTaxFee] = useState("");
  const [employeeStatusPaycheck, setEmployeeStatusPaycheck] = useState(0);
  const [employeeStatusPayment, setEmployeeStatusPayment] = useState(0);
  const [employeeStatusEmployee, setEmployeeStatusEmployee] = useState(-1);
  const [employeeAdvance, setEmployeeAdvance] = useState("");
  const [totalSalary, setTotalSalary] = useState(0);
  const [time, setTime] = useState("");
  const [year, setYear] = useState("");
  const [salaryBonus, setSalaryBonus] = useState("");
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
    if (location.pathname === "/appointment/employee/edit") {
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

  const onChangeReasonBonus = (e) => {
    setReasonBonus(e.target.value);
  };

  const onChangeSalaryBonus = (e) => {
    setSalaryBonus(e.target.value);
  };

  const onChangeYear = (e) => {
    setYear(e.target.value);
  };

  const [connection, setConnection] = useState();
  const [inputText, setInputText] = useState("");
  const [valueSendMessage, setValueSendMessage] = useState("");
  const [valueSendUser, setValueSendUser] = useState("");

  useEffect(() => {
    const connect = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7101/hubs/notification", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    setConnection(connect);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on("messageReceived", (username, message, sendDate) => {
            onMessageReceived(username, message, sendDate);
            setNoticationIsOpen(true);
            setName(username);
            setTime(sendDate);
          });
        })
        .catch((error) => console.log(error));
    }
  }, [connection]);

  const changeTableSalary = () => {
    sendNewMessage();
  };

  const onMessageReceived = (username, message) => {
    setValueSendMessage(message);
    setValueSendUser(username);
  };
  const sendNewMessage = () => {
    if (connection) {
      connection
        .send("newMessage", appState?.accountInfo.name, "Update", new Date())
        .then((x) => console.log("sent"));
    }
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
      if (location.pathname === "/appointment/employee/edit") {
        const updateInfoEmployeeRes = await api.updateInfoEmployee(
          appState.jwtToken,
          data
        );
        if (updateInfoEmployeeRes.status === 200) {
          toast.success("Cập nhập thành công");
          changeTableSalary();
        }
      } else {
        const createEmployeeRes = await api.createEmployee(
          appState.jwtToken,
          data
        );
        if (createEmployeeRes?.data?.status === 201) {
          toast.success("Thêm thành công");
          changeTableSalary();
        } else {
          toast.error(createEmployeeRes?.data?.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  console.log(historySalary);

  return (
    <div className="editEmployeeContainer">
      <div className="editEmployeeTitleBox">
        <p className="editEmployeeTitle">
          {location.pathname === "/appointment/employee/edit"
            ? `Thông tin phiếu lương`
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

                {location.pathname === "/appointment/employee/edit" ? (
                  <Typography>{employeeName}</Typography>
                ) : (
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
                )}
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

                {location.pathname === "/appointment/employee/edit" ? (
                  <Typography>{employeeEmail}</Typography>
                ) : (
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
                )}
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

                {location.pathname === "/appointment/employee/edit" ? (
                  <Typography>{employeePosition}</Typography>
                ) : (
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
                )}
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

                {location.pathname === "/appointment/employee/edit" ? (
                  <Typography>{employeePhone}</Typography>
                ) : (
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
                )}
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
                {location.pathname === "/appointment/employee/edit" ? (
                  <Typography>
                    {employeeStatus[employeeStatusEmployee]}
                  </Typography>
                ) : (
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
                )}
              </Stack>
              <Stack
                flexDirection="row"
                columnGap={2}
                alignItems="center"
                height={48}
                width="100%"
              >
                <Typography className="editEmployeeInfo">
                  Lương cơ bản
                </Typography>
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
              <Stack
                flexDirection="row"
                columnGap={2}
                alignItems="center"
                width="100%"
              >
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
                width="100%"
              >
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

              <Stack
                flexDirection="row"
                columnGap={2}
                alignItems="center"
                width="100%"
              >
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

              <Stack
                flexDirection="row"
                columnGap={2}
                alignItems="center"
                width="100%"
              >
                <Typography className="editEmployeeInfo">
                  Lý do thưởng
                </Typography>
                <TextField
                  value={reasonBonus}
                  type="text"
                  style={{ width: 200 }}
                  inputProps={{
                    style: {
                      height: "23px",
                      padding: "12.5px",
                    },
                  }}
                  onChange={onChangeReasonBonus}
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

                {location.pathname === "/appointment/employee/edit" ? (
                  <Typography>{employeeCode}</Typography>
                ) : (
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
                )}
              </Stack>
              <Stack
                flexDirection="row"
                columnGap={2}
                alignItems="center"
                height={48}
              >
                <Typography className="editEmployeeInfo">Phòng ban</Typography>
                {location.pathname === "/appointment/employee/edit" ? (
                  <Typography>
                    {departments[employeeDepartmentID - 1]}
                  </Typography>
                ) : (
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
                )}
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
                {location.pathname === "/appointment/employee/edit" ? (
                  <Typography>
                    {moment(employeeDoB, "YYYY-MM-DD").format("DD/MM/YYYY")}
                  </Typography>
                ) : (
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
                )}
              </Stack>
              <Stack
                flexDirection="row"
                columnGap={2}
                alignItems="center"
                height={48}
              >
                <Typography className="editEmployeeInfo">Tháng</Typography>
                {location.pathname === "/appointment/employee/edit" ? (
                  <Typography>{salaryMonth}</Typography>
                ) : (
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
                )}
              </Stack>
              <Stack
                flexDirection="row"
                columnGap={2}
                alignItems="center"
                height={48}
                justifyContent="flex-start"
                width="100%"
              >
                <Typography className="editEmployeeInfo">Năm</Typography>

                {location.pathname === "/appointment/employee/edit" ? (
                  <Typography>{year}</Typography>
                ) : (
                  <TextField
                    value={year}
                    type="text"
                    sx={{ width: 200 }}
                    inputProps={{
                      style: {
                        height: "23px",
                        padding: "12.5px",
                      },
                    }}
                    onChange={onChangeYear}
                  />
                )}
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
                <Typography className="editEmployeeInfo">
                  Tiền thưởng
                </Typography>
                <TextField
                  value={salaryBonus}
                  type="text"
                  onChange={onChangeSalaryBonus}
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
              <Stack
                flexDirection="row"
                columnGap={2}
                alignItems="center"
                height={48}
              >
                <Typography width="140px" fontWeight={700}>
                  Lương thực nhận:
                </Typography>
                <Typography>
                  {totalSalary.toLocaleString("it-IT")} VNĐ
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {location.pathname === "/appointment/employee/edit" ? (
            <>
              {" "}
              <Stack mt="20px">
                <Stack flexDirection="row" columnGap="12px">
                  <Typography fontWeight="500">
                    Thông tin ngân hàng:{" "}
                  </Typography>
                  {bankBranch &&
                  bankCode &&
                  bankName &&
                  accountName &&
                  accountNumber ? (
                    <Stack>
                      <Typography>
                        {bankCode} - {bankBranch}
                      </Typography>
                      <Typography>
                        {accountName} - {accountNumber}
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography fontStyle="italic">Không có thông tin</Typography>
                  )}
                </Stack>
              </Stack>
              <Typography sx={{ mt: "40px", fontWeight: 700, fontSize: 22 }}>
                Lịch sử bảng lương của nhân viên
              </Typography>
              <Box className="historySalaryTable">
                {historySalary && (
                  <TableContainer
                    sx={{
                      height: 450,
                      borderTop: "none",
                      minWidth: 600,
                    }}
                  >
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{ textAlign: "center", padding: "8px" }}
                          >
                            Thời gian
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "center", padding: "8px" }}
                          >
                            <Typography
                              style={{ fontSize: "14px", fontWeight: 500 }}
                            >
                              Lương cơ bản
                            </Typography>
                            <Typography
                              style={{
                                fontSize: "10px",
                                fontWeight: 400,
                                fontStyle: "italic",
                              }}
                            >
                              (VNĐ)
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "center", padding: "8px" }}
                          >
                            <Typography
                              style={{ fontSize: "14px", fontWeight: 500 }}
                            >
                              Thuế TNCN
                            </Typography>
                            <Typography
                              style={{
                                fontSize: "10px",
                                fontWeight: 400,
                                fontStyle: "italic",
                              }}
                            >
                              (VNĐ)
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "center", padding: "8px" }}
                          >
                            <Typography
                              style={{ fontSize: "14px", fontWeight: 500 }}
                            >
                              Chỉ số chấm công
                            </Typography>
                            <Typography
                              style={{
                                fontSize: "10px",
                                fontWeight: 400,
                                fontStyle: "italic",
                              }}
                            >
                              (Ngày công)
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "center", padding: "8px" }}
                          >
                            <Typography
                              style={{ fontSize: "14px", fontWeight: 500 }}
                            >
                              Tiền ứng trước
                            </Typography>
                            <Typography
                              style={{
                                fontSize: "10px",
                                fontWeight: 400,
                                fontStyle: "italic",
                              }}
                            >
                              (VNĐ)
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "center", padding: "8px" }}
                          >
                            <Typography
                              style={{ fontSize: "14px", fontWeight: 500 }}
                            >
                              Hệ số
                            </Typography>
                            <Typography
                              style={{
                                fontSize: "10px",
                                fontWeight: 400,
                                fontStyle: "italic",
                              }}
                            >
                              (*)
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "center", padding: "8px" }}
                          >
                            <Typography
                              style={{ fontSize: "14px", fontWeight: 500 }}
                            >
                              Tiền bảo hiểm
                            </Typography>
                            <Typography
                              style={{
                                fontSize: "10px",
                                fontWeight: 400,
                                fontStyle: "italic",
                              }}
                            >
                              (VNĐ)
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "center", padding: "8px" }}
                          >
                            <Typography
                              style={{ fontSize: "14px", fontWeight: 500 }}
                            >
                              Tiền thưởng
                            </Typography>
                            <Typography
                              style={{
                                fontSize: "10px",
                                fontWeight: 400,
                                fontStyle: "italic",
                              }}
                            >
                              (VNĐ)
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "center", padding: "8px" }}
                          >
                            <Typography
                              style={{ fontSize: "14px", fontWeight: 500 }}
                            >
                              Lương thực nhận
                            </Typography>
                            <Typography
                              style={{
                                fontSize: "10px",
                                fontWeight: 400,
                                fontStyle: "italic",
                              }}
                            >
                              (VNĐ)
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {JSON.parse(historySalary).map((item, index) => {
                          console.log(item);
                          return (
                            <TableRow key={index} hover>
                              {item.Month < 10 ? (
                                <TableCell
                                  sx={{ textAlign: "center", padding: "8px" }}
                                >
                                  0{item.Month}/{item.Year}
                                </TableCell>
                              ) : (
                                <TableCell
                                  sx={{ textAlign: "center", padding: "8px" }}
                                >
                                  {item.Month}/{item.Year}
                                </TableCell>
                              )}

                              <TableCell
                                sx={{ textAlign: "center", padding: "8px" }}
                              >
                                {item.BasicSalary.toLocaleString("it-IT")}
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "center", padding: "8px" }}
                              >
                                {item.TaxFee.toLocaleString("it-IT")}
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "center", padding: "8px" }}
                              >
                                {item.CoefficyTimeKeeping}
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "center", padding: "8px" }}
                              >
                                {item.Advance.toLocaleString("it-IT")}
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "center", padding: "8px" }}
                              >
                                {item.CoefficyPower}
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "center", padding: "8px" }}
                              >
                                {item.Insurance.toLocaleString("it-IT")}
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "center", padding: "8px" }}
                              >
                                {item.SalaryBonus.toLocaleString("it-IT")}
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "center", padding: "8px" }}
                              >
                                {item.FinalSalary.toLocaleString("it-IT")}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
