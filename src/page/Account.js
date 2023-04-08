import React, { useContext, useEffect, useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import "../css/Account.css";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import api from "../services/api";
import { AppContext } from "../contexts/app.context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Account() {
  const navigate = useNavigate();
  const [accountList, setAccountList] = useState([]);
  const [keySearch, setKeySearch] = useState("");
  const [accountPrepareDelete, setAccountPrepareDelete] = useState({});
  const { appState, dispatch } = useContext(AppContext);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setAccountPrepareDelete({});
    setOpen(false);
  };

  useEffect(() => {
    if(appState.accountInfo.isAdmin == 1){
      getAccountList();
    }
    else{
      toast.error("Bạn cần cấp quyền")
    }
  }, [keySearch]);

  const getAccountList = async () => {
    try {
      const accountListRes = await api.getAccountList(appState.jwtToken);
      if (accountListRes.status === 200) {
        setAccountList(accountListRes.data.data);
      }
    } catch (error) {
      // xu ly loi
      console.log(error);
    }
  };

  const onChangeKeySearch = (e) => {
    setKeySearch(e.target.value);
  };

  const onClickCreateAccount = () => {
    navigate("/account/create");
  };

  const clickDeleteAccountIcon = (account) => {
    setAccountPrepareDelete(account);
    setOpen(true);
  };

  const clickDeleteAccount = async () => {
    try {
      const deleteAccountRes = await api.deleteAccount(
        appState.jwtToken,
        accountPrepareDelete.email
      );
      if(deleteAccountRes.status === 200){
        setOpen(false);
        getAccountList();
        toast.success("Xóa tài khoản thành công")
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="accountListContainer">
      <div className="accountListTitleBox">
        <p className="accountListTitle">Danh sách tài khoản</p>
        {/* <FormControl
          name="keysearch"
          type="text"
          value={keySearch}
          onChange={onChangeKeySearch}
          placeholder="Type your email"
          className="keySearchInput"
        /> */}
      </div>
      <div className="accountContentBox">
        <div className="accountTable">
          <TableContainer sx={{ maxHeight: 450 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Họ tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Chức vụ</TableCell>
                  <TableCell>Người tạo</TableCell>
                  <TableCell>Xóa</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accountList.map((account, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>
                        {account.isAdmin === 1 ? "Quản lý" : "Kế toán"}
                      </TableCell>
                      <TableCell>{account.createdBy}</TableCell>
                      <TableCell>
                        <RiDeleteBin6Line
                          onClick={() => clickDeleteAccountIcon(account)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div className="footerAccountPage">
          {/* <Pagination
            count={Math.ceil(totalAccount / pageSize)}
            variant="outlined"
            page={pageNumber}
            shape="rounded"
            onChange={onChangePage}
          /> */}
          <Button onClick={onClickCreateAccount}>Tạo tài khoản</Button>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Xác nhận xóa tài khoản
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn chắc chắn muốn xóa tài khoản {accountPrepareDelete.name} chứ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ minWidth: 100 }}>
            Hủy
          </Button>
          <Button onClick={clickDeleteAccount} autoFocus>
            Xóa tài khoản
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
