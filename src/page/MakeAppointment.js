import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Form, FormControl, Modal } from "react-bootstrap";
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
} from "@mui/material";
import api from "../services/api";
import { AppContext } from "../contexts/app.context";
import { useNavigate } from "react-router-dom";
import { AiOutlineUpload } from "react-icons/ai";
import { VscPreview } from "react-icons/vsc";

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

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

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

  console.log(employeeList  )

  const onChangePage = (event, page) => {
    setPageNumber(page);
    getEmployeeList(page);
  };

  const onChangeKeySearch = (e) => {
    setKeySearch(e.target.value.toString());
  };

  const clickDeleteEmployee = async (employee) => {
    try {
      const deleteEmployeeRes = await api.deleteEmployee(
        appState.jwtToken,
        employee.id
      );
      getEmployeeList(pageNumber);
    } catch (error) {
      console.log(error);
    }
  };

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
    navigate(`/employee/edit`);
  };

  const clickCreateEmployeePage = () => {
    navigate("/employee/create");
  };

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
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                columnGap: 4,
              }}
            >
              Upload File <AiOutlineUpload />
            </Button>
          </div>
        </div>
        <div className="employeeContentBox">
          <div className="employeeTable">
            <TableContainer sx={{ height: 460 }}>
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
                    {/* <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                      Lương
                    </TableCell> */}
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
                            value={employee.employeeCode}
                            onChange={onChangeValue}
                            checked={selected.includes(employee.employeeCode)}
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
                        {/* <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                          1000000
                        </TableCell> */}
                        <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                          {employee.month}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                          01/01/2023
                        </TableCell>
                        <TableCell
                          style={{
                            width: 100,
                            textAlign: "center",
                            padding: "4px",
                          }}
                        >
                          Xác nhận
                        </TableCell>
                        <TableCell
                          sx={{ textAlign: "center", padding: "4px" }}
                          onClick={() => clickEditEmployee(employee)}
                        >
                          <BsThreeDotsVertical />
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                          <RiDeleteBin6Line
                            onClick={() => clickDeleteEmployee(employee)}
                          />
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
                variant="primary"
                onClick={clickCreateEmployeePage}
                style={{ minWidth: 120, height: 50 }}
              >
                Thêm nhân viên
              </Button>
              <Button
                variant="primary"
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
                  <Form.Label>Ngày</Form.Label>
                  <Form.Control
                    type="date"
                    name="duedate"
                    placeholder="Due date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </>
              ) : (
                <></>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            style={{ minWidth: 80 }}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleCloseModal}
            style={{ minWidth: 80 }}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
