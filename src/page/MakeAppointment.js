import React, { useContext, useEffect, useState } from "react";
import { Button, Form, FormControl, Modal, Table } from "react-bootstrap";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import "../css/Account.css";
import "../css/MakeAppointment.css";
import { Checkbox, Pagination } from "@mui/material";
import api from "../services/api";
import { AppContext } from "../contexts/app.context";
import { useNavigate } from "react-router-dom";
import { AiOutlineUpload } from "react-icons/ai";

export default function MakeAppointment() {
  const navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState([]);
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [keySearch, setKeySearch] = useState("");
  const { appState, dispatch } = useContext(AppContext);
  const [show, setShow] = useState(false);
  const [typeOfAppointment, setTypeOfAppointment] = useState("Gửi luôn");
  const [date, setDate] = useState(new Date());

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getEmployeeList(1);
  }, [keySearch]);

  const getEmployeeList = async (page) => {
    try {
      const employeeListRes = await api.getEmployeeList(
        appState.jwtToken,
        page,
        pageSize,
        keySearch
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
  };

  const onChangeKeySearch = (e) => {
    setKeySearch(e.target.value);
  };

  const clickDeleteEmployee = async (employee) => {
    try {
      const deleteEmployeeRes = await api.deleteEmployee(
        appState.jwtToken,
        employee.id
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setTypeOfAppointment(e.target.value);
  };

  const handleSubmitModal = async () => {

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
              placeholder="Type your email"
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
            <Table>
              <thead>
                <tr>
                  <th></th>
                  <th>MSNV</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Chức vụ</th>
                  <th>Phòng ban</th>
                  <th>Lương</th>
                  <th>Tháng</th>
                  <th>Xem trước</th>
                  <th>Ngày gửi</th>
                  <th>Trạng thái</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {employeeList.map((employee) => {
                  return (
                    <tr key={employee.id} style={{ verticalAlign: "middle" }}>
                      <td>
                        <Checkbox style={{ width: 20 }} />
                      </td>
                      <td>{employee.employeeCode}</td>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td style={{ width: 100 }}>{employee.currentLevel}</td>
                      <td>Kế toán</td>
                      <td>1000000</td>
                      <td>9</td>
                      <td>
                        <BsThreeDotsVertical />
                      </td>
                      <td>01/01/2023</td>
                      <td style={{ width: 100 }}>Xác nhận</td>
                      <td>
                        <RiDeleteBin6Line
                          onClick={() => clickDeleteEmployee(employee)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>

          <div className="footerEmployeePage">
            <Pagination
              count={Math.ceil(totalEmployee / pageSize)}
              variant="outlined"
              page={pageNumber}
              shape="rounded"
              onChange={onChangePage}
            />
            <Button
              variant="primary"
              onClick={handleShow}
              style={{ minWidth: 120 }}
            >
              Gửi
            </Button>
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
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
              <Form.Label>Ngày</Form.Label>
              <Form.Control
                type="date"
                name="duedate"
                placeholder="Due date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{ minWidth: 80 }}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleClose}
            style={{ minWidth: 80 }}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
