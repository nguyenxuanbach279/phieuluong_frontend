import React, { useContext, useEffect, useState } from "react";
import { Button, FormControl, Table } from "react-bootstrap";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import "../css/Account.css";
import { Pagination } from "@mui/material";
import api from "../services/api";
import { AppContext } from "../contexts/app.context";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState([]);
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keySearch, setKeySearch] = useState("");
  const { appState, dispatch } = useContext(AppContext);

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

      console.log(employeeListRes);
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

  const onClickCreateAccount = () => {
    navigate("/account/create");
  };

  return (
    <div className="accountListContainer">
      <div className="accountListTitleBox">
        <p className="accountListTitle">Danh sách tài khoản</p>
        <FormControl
          name="keysearch"
          type="text"
          value={keySearch}
          onChange={onChangeKeySearch}
          placeholder="Type your email"
          className="keySearchInput"
        />
      </div>
      <div className="accountContentBox">
        <div className="accountTable">
        <Table>
          <thead>
            <tr>
              <th>MSNV</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Chức vụ</th>
              <th>Phòng ban</th>
              <th>Chi tiết</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {employeeList.map((employee) => {
              return (
                <tr key={employee.id}>
                  <td>{employee.employeeCode}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.currentLevel}</td>
                  <td>Kế toán</td>
                  <td>
                    <BsThreeDotsVertical />
                  </td>
                  <td>
                    <RiDeleteBin6Line />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        </div>

        <div className="footerAccountPage">
          <Pagination
            count={Math.ceil(totalEmployee / pageSize)}
            variant="outlined"
            page={pageNumber}
            shape="rounded"
            onChange={onChangePage}
          />
          <Button onClick={onClickCreateAccount}>Tạo tài khoản</Button>
        </div>
      </div>
    </div>
  );
}
