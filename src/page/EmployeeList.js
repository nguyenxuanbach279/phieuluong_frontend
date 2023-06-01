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
import { BsThreeDotsVertical } from "react-icons/bs";

export default function EmployeeList() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    appState,
    dispatch,
    setIsLoading,
  } = useContext(AppContext);
  const [employeeList, setEmployeeList] = useState([]);
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [keySearch, setKeySearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [mailInTable, setMailInTable] = useState([]);
  const [employeePrepareDelete, setEmployeePrepareDelete] = useState({});
  const [open, setOpen] = useState(false);
  const [openSalaryPreview, setOpenSalaryPreview] = useState(false);
  const [employeeDetail, setEmployeeDetail] = useState();
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

  const paycheck = ["Đang làm", "Nghỉ việc", "Nghỉ thai sản"];

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

  const handleChangePageSize = (event) => {
    setPageSize(event.target.value);
  };

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
    navigate(`/staff/edit`);
  };

  const clickCreateEmployeePage = () => {
    navigate("/staff/create");
  };

  console.log(employeeList)

  return (
    <>
      <div className="employeeListContainer">
        <div className="employeeListTitleBox">
          <p className="employeeListTitle">
            Bảng danh sách nhân viên
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
                      Ngày sinh
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                      Số điện thoại
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
                          {employee.doB
                            ? moment(
                                employee.doB,
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
                          {employee.phone}
                        </TableCell>
                        <TableCell
                          style={{
                            width: 100,
                            textAlign: "left",
                            padding: "4px",
                          }}
                        >
                          {paycheck[employee.statusPaycheck]}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                          <IconButton
                            onClick={() => navigate(`/employee-detail/${employee.id}`)}
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
              <Button
                variant="contained"
                onClick={clickCreateEmployeePage}
                style={{ minWidth: 120, height: 40 }}
              >
                Thêm nhân viên
              </Button>
            </Stack>
          </div>
        </div>
      </div>
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
    </>
  );
}
