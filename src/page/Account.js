import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import "../css/Account.css";
import axios from "axios";
import { PaginationComponent } from "../components";
import api from "../services/api";

export default function Account() {
  const [employeeList, setEmployeeList] = useState([]);
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keySearch, setKeySearch] = useState("a");

  useEffect(() => {
    getEmployeeList(1);
  }, []);

  const getEmployeeList = async (page) => {
    try {
      const employeeListRes = await api.getEmployeeList(page, pageSize, keySearch);

      console.log(employeeListRes)
      if (employeeListRes.status === 200) {
        setEmployeeList(employeeListRes.data.data.data);
        setTotalEmployee(employeeListRes.data.totalRecord);
      }
    } catch (error) {
      // xu ly loi
      console.log(error);
    }
  };

  const onChangePage = (page) => {
    getEmployeeList(page);
  };

  return (
    <div className="accountListContainer">
      <div className="accountListTitleBox">
        <p className="accountListTitle">Danh sách tài khoản</p>
      </div>
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
                <td>
                  {employee.firstName} {employee.lastName}
                </td>
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

      <PaginationComponent
        totalPages={Math.ceil(totalEmployee / pageSize)}
        totalRecord={totalEmployee}
        page={pageNumber}
        size={pageSize}
        onChangePage={onChangePage}
      />
    </div>
  );
}
