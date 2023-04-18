import React, { useCallback, useContext, useEffect, useState } from "react";
import { Form, FormControl, Modal } from "react-bootstrap";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import "../css/Account.css";
import "../css/MakeAppointment.css";
import {
  Box,
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
  TablePagination,
  TableRow,
  Typography,
  FormControl as FormControlMui,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import api from "../services/api";
import { AppContext } from "../contexts/app.context";
import { useNavigate } from "react-router-dom";
import { AiOutlineUpload } from "react-icons/ai";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import moment from "moment/moment";

export default function MakeAppointment() {
  const navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState([]);
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [keySearch, setKeySearch] = useState("");
  const { appState, dispatch } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [typeOfAppointment, setTypeOfAppointment] = useState("Gửi luôn");
  const [date, setDate] = useState(new Date());
  const [selected, setSelected] = useState([]);
  const [mailInTable, setMailInTable] = useState([]);
  const [employeeEdit, setEmployeeEdit] = useState({});
  const [datetime, setDatetime] = useState(dayjs(new Date()));
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  console.log(employeeList);

  const [employeePrepareDelete, setEmployeePrepareDelete] = useState({});
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setEmployeePrepareDelete({});
    setOpen(false);
  };

  useEffect(() => {
    getEmployeeList(1);
  }, [keySearch, pageSize]);

  const departmants = [
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
    const data = employeeListChoosed();
    if (typeOfAppointment == "Gửi luôn") {
      try {
        const sendNowRes = await api.sendPaycheckNow(appState.jwtToken, data);
        if (sendNowRes.status === 200) {
          toast.success("Gửi thành công");
          setShowModal(false);
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
  };

  const onChangeFile = async (e) => {
    const temp = e.target.files;
    // console.log(Object.values(temp));

    const data = new FormData();
    Object.values(temp).forEach((file) => {
      data.append("fileExcel", file);
    });
    console.log(data);
    try {
      const uploadFileRes = await api.uploadExcel(appState.jwtToken, data);
      if (uploadFileRes.status === 200) {
        console.log(uploadFileRes);
        toast.success("Upload thành công");
      }
    } catch (error) {
      toast.error("error");
      console.log(error);
    }
  };

  // console.log(datetime["$d"].toISOString());

  return (
    <>
      <div className="employeeListContainer">
        <div className="employeeListTitleBox">
          <p className="employeeListTitle">Bảng lương</p>
          <div style={{ display: "flex", columnGap: 8 }}>
            <FormControl
              name="keysearch"
              type="text"
              value={keySearch}
              onChange={onChangeKeySearch}
              placeholder="Search ..."
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
            >
              Upload
              <input
                hidden
                accept=".csv,application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                multiple
                type="file"
                onChange={onChangeFile}
              />
              <AiOutlineUpload />
            </Button>
          </div>
        </div>
        <div className="employeeContentBox">
          <div className="employeeTable">
            <TableContainer
              sx={{
                maxHeight: 460,
                borderTop: "none",
                minWidth: 600,
                // boxShadow: "rgba(0,0,0,0.24) 0px 4px 8px",
              }}
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>
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
                      Tháng
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                      Ngày gửi
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                      Trạng thái
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                      Chi tiết
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
                      >
                        <TableCell>
                          <Checkbox
                            value={employee.email}
                            onChange={onChangeValue}
                            checked={selected.includes(employee.email)}
                            style={{ width: 20 }}
                          />
                        </TableCell>
                        <TableCell>{employee.employeeCode}</TableCell>
                        <TableCell>{employee.name}</TableCell>
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
                          {departmants[employee.departmentID - 1]}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                          {employee.month}
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
                            onClick={() => clickEditEmployee(employee)}
                          >
                            <BsThreeDotsVertical />
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
                  label="Page size"
                  onChange={handleChangePageSize}
                >
                  <MenuItem value={8}>8</MenuItem>
                  <MenuItem value={16}>16</MenuItem>
                  <MenuItem value={24}>20</MenuItem>
                </Select>
              </FormControlMui>
              <Typography>Số lượng bản ghi: {totalEmployee}</Typography>
            </Stack>
            <Stack flexDirection="row" columnGap={2} alignItems="center">
              <Button
                variant="contained"
                onClick={clickCreateEmployeePage}
                style={{ minWidth: 120, height: 50 }}
              >
                Thêm nhân viên
              </Button>
              <Button
                variant="contained"
                onClick={handleShowModal}
                style={{ minWidth: 120, height: 50 }}
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
        onClose={handleClose}
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
          <Button onClick={handleClose} style={{ minWidth: 100 }}>
            Hủy
          </Button>
          <Button onClick={clickDeleteEmployee} autoFocus>
            Xóa nhân viên
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
