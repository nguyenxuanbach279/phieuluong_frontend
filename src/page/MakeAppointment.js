import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Form, FormControl, Modal } from "react-bootstrap";
import { RiDeleteBin6Line } from "react-icons/ri";
import { VscPreview } from "react-icons/vsc";
import { BiDownload } from "react-icons/bi";
import "../css/Account.css";
import "../css/MakeAppointment.css";
import {
  Checkbox,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  FormControl as FormControlMui,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import api from "../services/api";
import { AppContext } from "../contexts/app.context";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineUpload } from "react-icons/ai";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import moment from "moment/moment";
import * as XLSX from "xlsx";
import axios from "axios";
import TestSignalr from "./Notification";
import * as signalR from "@aspnet/signalr";

export default function MakeAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    appState,
    dispatch,
    setIsLoading,
    noticationIsOpen,
    setNoticationIsOpen,
    name,
    setName,
    previousUrl,
    setPreviousUrl,
  } = useContext(AppContext);
  const [employeeList, setEmployeeList] = useState([]);
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [keySearch, setKeySearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [typeOfAppointment, setTypeOfAppointment] = useState("Gửi luôn");
  const [selected, setSelected] = useState([]);
  const [mailInTable, setMailInTable] = useState([]);
  const [datetime, setDatetime] = useState(dayjs(new Date()));
  const [employeePrepareDelete, setEmployeePrepareDelete] = useState({});
  const [open, setOpen] = useState(false);
  const [openSalaryPreview, setOpenSalaryPreview] = useState(false);
  const [employeeDetail, setEmployeeDetail] = useState();
  const [time, setTime] = useState("");
  const [check, setCheck] = useState(0);
  const [countGetApi, setCountGetApi] = useState(0);
  const [isOpenModalConfirmPayment, setIsOpenModalConfirmPayment] =
    useState(false);
  const [employeeSelected, setEmployeeSelected] = useState([]);

  const temp1 = useMemo(() => {
    const temp = employeeList.reduce((total, item) => {
      if (selected.includes(item.email)) {
        total.push(item);
      }
      return total;
    }, []);
    setEmployeeSelected(temp);
  }, [selected]);

  const handleOpenModalConfirmPayment = () => {
    setIsOpenModalConfirmPayment(true);
  };
  const handleCloseModalConfirmPayment = () => {
    setIsOpenModalConfirmPayment(false);
  };
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

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
            setName(username);
            setTime(sendDate);
            setNoticationIsOpen(true);
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
  const handleClose = () => {
    setEmployeePrepareDelete({});
    setOpen(false);
  };

  const handleCloseSalaryPreview = () => {
    setEmployeeDetail();
    setOpenSalaryPreview(false);
  };

  useEffect(() => {
    getEmployeeList(1);
    setCountGetApi((prev) => prev + 1);
  }, [keySearch, pageSize]);

  useEffect(() => {}, []);

  const departments = [
    "Giám đốc",
    "Quản lý",
    "Sản xuất",
    "Nhân sự",
    "Kế toán",
    "Bán hàng",
    "Hành chính",
  ];

  const paycheck = ["Chưa gửi", "Đã gửi", "Xác nhận", "Không xác nhận"];

  const getEmployeeList = async (page) => {
    setIsLoading(true);
    try {
      const employeeListRes = await api.getEmployeeList(
        appState.jwtToken,
        page,
        pageSize,
        keySearch
      );
      setMailInTable(
        employeeListRes.data.data.data.map((employee) => employee.email)
      );
      if (employeeListRes.status === 200) {
        setEmployeeList(employeeListRes.data.data.data);
        setTotalEmployee(employeeListRes.data.data.totalRecord);
      }
    } catch (error) {
      // xu ly loi
      console.log(error);
    }
    setIsLoading(false);
  };

  const onChangePage = (event, page) => {
    setPageNumber(page);
    getEmployeeList(page);
    setSelected([]);
  };

  const onChangeKeySearch = (e) => {
    setKeySearch(e.target.value.toString());
  };

  const clickPrepareDeleteEmployee = (employee) => {
    setOpen(true);
    setEmployeePrepareDelete(employee);
  };

  const clickDeleteEmployee = async () => {
    setIsLoading(true);
    changeTableSalary();
    try {
      const deleteEmployeeRes = await api.deleteEmployee(
        appState.jwtToken,
        employeePrepareDelete.id
      );
      if (deleteEmployeeRes.status === 200) {
        setOpen(false);
        toast.success("Xóa thành công");
        getEmployeeList(pageNumber);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const clickConfirmPayment = async () => {
    setIsLoading(true);
    const data = employeeListChoosed();
    const temp = data.filter((item) => item.statusPaycheck == 2);
    const isAllConfirm = temp.length === data.length;
    setIsOpenModalConfirmPayment(false);
    try {
      if (isAllConfirm) {
        const confirmPaymentRes = await api.confirmPayment(
          appState.jwtToken,
          data
        );
        if (confirmPaymentRes.status === 200) {
          toast.success("Đã xác nhận thành công");
        } else {
          toast.error("Có lỗi xảy ra khi gửi");
        }
      } else {
        toast.warning("Có nhân viên chưa xác nhận");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const employeeListChoosed = useCallback(() => {
    const temp = employeeList.filter((item) => {
      if (selected.includes(item.email)) {
        return item;
      }
    });
    return temp;
  }, [selected, employeeList]);

  const handleChangePageSize = (event) => {
    setPageSize(event.target.value);
  };

  const handleChange = (e) => {
    setTypeOfAppointment(e.target.value);
  };

  const handleSubmitModal = async () => {};

  const isAllSelected =
    mailInTable.length > 0 && selected.length === mailInTable.length;

  const onChangeValue = (event) => {
    const value = event.target.value;
    if (value === "all") {
      setSelected(selected.length === mailInTable.length ? [] : mailInTable);
      return;
    }
    const list = [...selected];
    const index = list.indexOf(value);
    index === -1 ? list.push(value) : list.splice(index, 1);
    setSelected(list);
  };

  const clickEditEmployee = (employee) => {
    dispatch({
      type: "SET_EMPLOYEEID_EDIT",
      employeeIdEdit: employee.id,
    });
    navigate(`/appointment/employee/edit`);
  };

  const clickCreateEmployeePage = () => {
    navigate("/appointment/employee/create");
  };

  const clickSendPaycheck = async () => {
    setIsLoading(true);
    const data = employeeListChoosed();
    setShowModal(false);
    if (typeOfAppointment == "Gửi luôn") {
      try {
        const sendNowRes = await api.sendPaycheckNow(appState.jwtToken, data);
        if (sendNowRes.status === 200) {
          toast.success("Gửi thành công");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const time = datetime["$d"];
      const formatString = "YYYY-MM-DDTHH:mm:00";
      const result = moment(
        time,
        "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)"
      ).format(formatString);
      const temp = data.map((item) => {
        return { idEmployee: item.id, sendDate: result };
      });
      try {
        const sendNowRes = await api.sendPaycheckSetCalendar(
          appState.jwtToken,
          temp
        );
        if (sendNowRes.status === 200) {
          toast.success("Đặt lịch thành công");
          setShowModal(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    setIsLoading(false);
  };

  const onChangeFile = async (e) => {
    const temp = e.target.files;
    const data = new FormData();
    Object.values(temp).forEach((file) => {
      data.append("fileExcel", file);
    });
    setIsLoading(true);
    try {
      const uploadFileRes = await api.uploadExcel(appState.jwtToken, data);
      if (uploadFileRes.status === 200) {
        getEmployeeList(1);
        changeTableSalary();
        toast.success("Upload thành công");
        if (e) {
          e.target.files = null;
        }
      }
    } catch (error) {
      toast.error("error");
      console.log(error);
    }
    setIsLoading(false);
  };

  const clickPreviewEmployee = async (employee) => {
    setOpenSalaryPreview(true);
    setIsLoading(true);
    try {
      const employeeDataRes = await api.getInfoEmployee(
        appState.jwtToken,
        employee.id
      );
      if (employeeDataRes.status === 200) {
        setEmployeeDetail(employeeDataRes.data.data);
      }
    } catch (error) {}
    setIsLoading(false);
  };

  const getExcelData = async () => {
    setIsLoading(true);
    try {
      if (selected.length === 0) {
        const response = await axios({
          url: `https://localhost:7101/api/Client/ExportToExcel`,
          method: "GET",
          responseType: "arraybuffer",
          headers: {
            Authorization: `Bearer ${appState.jwtToken}`,
          },
        });
        if (response.status === 200) {
          window.open("https://localhost:7101/api/Client/ExportToExcel");
          toast.success("Tải xuống thành công");
          setIsLoading(false);
          // return response.data; ms download dc
        }
      } else {
        const temp = employeeListChoosed();
        const listId = temp.map((item) => item.id);
        console.log(listId);
        const response = await axios({
          url: `https://localhost:7101/api/Client/ExportByID`,
          method: "POST",
          data: listId,
          responseType: "arraybuffer",
          headers: {
            Authorization: `Bearer ${appState.jwtToken}`,
          },
        });
        if (response.status === 200) {
          // window.open('https://localhost:7101/api/Client/ExportByID')
          toast.success("Tải xuống thành công");
          setIsLoading(false);
          return response.data; //ms download dc
        }
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const createExcelFile = (excelData) => {
    const workbook = XLSX.read(excelData, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    return excelBlob;
  };

  const downloadExcelFile = (excelBlob) => {
    const excelUrl = URL.createObjectURL(excelBlob);
    const link = document.createElement("a");
    link.href = excelUrl;
    link.download = "excel_file.xlsx";
    document.body.appendChild(link);
    link.click();
  };

  const clickExportExcel = async () => {
    try {
      const excelData = await getExcelData();
      const excelBlob = createExcelFile(excelData);
      downloadExcelFile(excelBlob);
    } catch (error) {
      console.log(error);
    }
  };

  const hasNotication = (bool) => {
    setNoticationIsOpen(bool);
  };

  return (
    <>
      <div className="employeeListContainer">
        <div className="employeeListTitleBox">
          <p className="employeeListTitle">
            Bảng lương tháng {employeeList[0]?.month} năm{" "}
            {employeeList[0]?.year}
          </p>
          <div style={{ display: "flex", columnGap: 8 }}>
            <FormControl
              name="keysearch"
              type="text"
              value={keySearch}
              onChange={onChangeKeySearch}
              placeholder="Tìm kiếm ..."
              className="keySearchInput"
            />
            <Button
              variant="contained"
              component="label"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                columnGap: 4,
              }}
              onClick={() => clickExportExcel()}
            >
              Export
              <BiDownload fontSize="20px" />
            </Button>
            <Button
              variant="contained"
              component="label"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                columnGap: 4,
              }}
            >
              Upload
              <input
                hidden
                accept=".csv,application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                multiple
                type="file"
                onChange={onChangeFile}
              />
              <AiOutlineUpload fontSize="20px" />
            </Button>
          </div>
        </div>
        <div className="employeeContentBox">
          <div className="employeeTable">
            <TableContainer
              sx={{
                height: 460,
                minWidth: 800,
                overflowX: "auto",
              }}
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                      <Checkbox
                        value="all"
                        onChange={onChangeValue}
                        checked={isAllSelected}
                        style={{ width: 20 }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: "120px",
                        padding: "4px",
                        overflow: "hidden",
                      }}
                    >
                      MSNV
                    </TableCell>
                    <TableCell>Họ tên</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                      Chức vụ
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                      Phòng ban
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                      Ngày gửi
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                      Trạng thái
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                      Xem trước
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                      Xóa
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeeList.map((employee) => {
                    return (
                      <TableRow
                        key={employee.id}
                        style={{ verticalAlign: "middle" }}
                        hover
                      >
                        <TableCell
                          sx={{ textAlign: "center", padding: "4px 12px" }}
                        >
                          <Checkbox
                            value={employee.email}
                            onChange={onChangeValue}
                            checked={selected.includes(employee.email)}
                            style={{ width: 20 }}
                          />
                        </TableCell>
                        <TableCell>{employee.employeeCode}</TableCell>
                        <TableCell onClick={() => clickEditEmployee(employee)}>
                          <Link style={{ color: "#000" }}>{employee.name}</Link>
                        </TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell
                          style={{
                            width: 100,
                            textAlign: "center",
                            padding: "4px",
                          }}
                        >
                          {employee.currentLevel}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                          {departments[employee.departmentID - 1]}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                          {employee.sendDate
                            ? moment(
                                employee.sendDate,
                                "YYYY-MM-DDTHH:mm:ss"
                              ).format("DD-MM-YYYY")
                            : "Chưa gửi"}
                        </TableCell>
                        <TableCell
                          style={{
                            width: 100,
                            textAlign: "center",
                            padding: "4px",
                          }}
                        >
                          {paycheck[employee.statusPaycheck]}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                          <IconButton
                            onClick={() => clickPreviewEmployee(employee)}
                          >
                            <VscPreview />
                          </IconButton>
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                          <IconButton
                            onClick={() => clickPrepareDeleteEmployee(employee)}
                          >
                            <RiDeleteBin6Line />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div className="footerEmployeePage">
            <Stack flexDirection="row" columnGap={2} alignItems="center">
              <Pagination
                count={Math.ceil(totalEmployee / pageSize)}
                variant="outlined"
                page={pageNumber}
                shape="rounded"
                onChange={onChangePage}
              />
              <FormControlMui sx={{ width: 80 }}>
                <InputLabel id="demo-simple-select-label">Size</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={pageSize}
                  label="Size"
                  onChange={handleChangePageSize}
                >
                  <MenuItem value={8}>8</MenuItem>
                  <MenuItem value={16}>16</MenuItem>
                  <MenuItem value={totalEmployee}>Tất cả</MenuItem>
                </Select>
              </FormControlMui>
              <Typography>Số lượng bản ghi: {totalEmployee}</Typography>
            </Stack>
            <Stack
              flexDirection="row"
              columnGap={2}
              alignItems="center"
              justifyContent="center"
            >
              {/* <Button
                variant="contained"
                onClick={clickCreateEmployeePage}
                style={{ minWidth: 120, height: 40 }}
              >
                Thêm nhân viên
              </Button>
              <Button
                variant="contained"
                onClick={handleOpenModalConfirmPayment}
                style={{ minWidth: 120, height: 40 }}
                disabled={!Boolean(selected.length)}
              >
                Thanh toán
              </Button> */}
              <Button
                variant="contained"
                onClick={handleShowModal}
                style={{ minWidth: 120, height: 40 }}
                disabled={!Boolean(selected.length)}
              >
                Gửi
              </Button>
            </Stack>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Tùy chọn gửi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitModal}>
            <Form.Group controlId="kindOfStand">
              <Form.Check
                value="Gửi luôn"
                type="radio"
                aria-label="radio 1"
                label="Gửi luôn"
                onChange={handleChange}
                checked={typeOfAppointment === "Gửi luôn"}
              />
              <Form.Check
                value="Đặt lịch"
                type="radio"
                aria-label="radio 2"
                label="Đặt lịch"
                onChange={handleChange}
                checked={typeOfAppointment === "Đặt lịch"}
              />
              {typeOfAppointment === "Đặt lịch" ? (
                <>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateTimePicker"]}>
                      <DateTimePicker
                        label="Chọn ngày giờ"
                        value={datetime}
                        onChange={(newValue) => setDatetime(newValue)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </>
              ) : (
                <></>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="contained"
            onClick={handleCloseModal}
            style={{ minWidth: 80, marginRight: 8 }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={clickSendPaycheck}
            style={{ minWidth: 80 }}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      <Dialog
        open={open}
        onClose={handleCloseSalaryPreview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Xác nhận xóa nhân viên
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn chắc chắn muốn xóa nhân viên {employeePrepareDelete.name} chứ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleClose}
            style={{ minWidth: 100 }}
          >
            Hủy
          </Button>
          <Button variant="contained" onClick={clickDeleteEmployee} autoFocus>
            Xóa nhân viên
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openSalaryPreview}
        onClose={handleCloseSalaryPreview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "1000px", // Set your width here
            },
          },
        }}
      >
        {employeeDetail && (
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
                    {departments[employeeDetail.departmentID - 1]}
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
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="salaryviewInfo">
                    Tiền thưởng:
                  </Typography>
                  <Typography>
                    {employeeDetail.salaryBonus?.toLocaleString("it-IT")}{" "}
                    <span style={{ fontSize: 14 }}>VNĐ</span>
                  </Typography>
                </Stack>
              </Stack>
            </div>
            <div className="totalSalary">
              <p>
                Tổng lương được nhận:{" "}
                {employeeDetail.finalSalary?.toLocaleString("it-IT")}{" "}
                <span style={{ fontSize: 14 }}>VNĐ</span>
              </p>
            </div>
          </div>
        )}
      </Dialog>
      {appState.accountInfo.name !== name && (
        <TestSignalr
          isOpen={noticationIsOpen}
          hasNotication={hasNotication}
          time={time}
          name={name}
          getEmployeeList={getEmployeeList}
        />
      )}

      <Dialog
        open={isOpenModalConfirmPayment}
        onClose={handleCloseModalConfirmPayment}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "500px",
            },
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">Xác nhận thanh toán</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Xác nhận thanh toán với{" "}
            {employeeSelected.map((item) => {
              return <span key={item.id}>{item.name}, </span>;
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleCloseModalConfirmPayment}
            style={{ minWidth: 100 }}
          >
            Hủy
          </Button>
          <Button variant="contained" onClick={clickConfirmPayment} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
