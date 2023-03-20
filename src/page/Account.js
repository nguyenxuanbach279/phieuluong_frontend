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
  const [accountList, setAccountList] = useState([]);
  const [totalAccount, setTotalAccount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keySearch, setKeySearch] = useState("");
  const { appState, dispatch } = useContext(AppContext);

  useEffect(() => {
    getAccountList(1);
  }, [keySearch]);

  const getAccountList = async (page) => {
    try {
      const accountListRes = await api.getEmployeeList(
        appState.jwtToken,
        page,
        pageSize,
        keySearch
      );
      if (accountListRes.status === 200) {
        setAccountList(accountListRes.data.data.data);
        setTotalAccount(accountListRes.data.data.totalRecord);
      }
    } catch (error) {
      // xu ly loi
      console.log(error);
    }
  };

  const onChangePage = (event, page) => {
    setPageNumber(page);
    getAccountList(page);
  };

  const onChangeKeySearch = (e) => {
    setKeySearch(e.target.value);
  };

  const onClickCreateAccount = () => {
    navigate("/account/create");
  };

  const clickDeleteAccount = async (account) => {
    try {
      const deleteAccountRes = await api.deleteAccount(appState.jwtToken, account.email)
    } catch (error) {
      console.log(error)
    }
  }

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
              <th>Người tạo</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {accountList.map((account) => {
              return (
                <tr key={account.id}>
                  <td>{account.employeeCode}</td>
                  <td>{account.name}</td>
                  <td>{account.email}</td>
                  <td>{account.currentLevel}</td>
                  <td>Kế toán</td>
                  <td>
                    <BsThreeDotsVertical />
                  </td>
                  <td>
                    <RiDeleteBin6Line onClick={() => clickDeleteAccount(account)}/>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        </div>

        <div className="footerAccountPage">
          <Pagination
            count={Math.ceil(totalAccount / pageSize)}
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
