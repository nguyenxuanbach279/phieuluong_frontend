import React, { useContext, useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import "../css/Account.css";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
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
  const { appState } = useContext(AppContext);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setAccountPrepareDelete({});
    setOpen(false);
  };

  useEffect(() => {
    if (appState.accountInfo.isAdmin == 1) {
      getAccountList();
    } else {
      toast.error("Bạn cần cấp quyền");
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
      if (deleteAccountRes.status === 200) {
        setOpen(false);
        getAccountList();
        toast.success("Xóa tài khoản thành công");
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
          <TableContainer
            sx={{
              maxHeight: 450,
              borderTop: "none",
              minWidth: 600,
              // boxShadow: "rgba(0,0,0,0.24) 0px 4px 8px",
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                    STT
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                    Họ tên
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                    Chức vụ
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                    Người tạo
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                    Xóa
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accountList.map((account, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                        {account.name}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                        {account.email}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                        {account.isAdmin === 1 ? "Quản lý" : "Kế toán"}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                        {account.createdBy}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                        <IconButton
                          onClick={() => clickDeleteAccountIcon(account)}
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

        <div className="footerAccountPage">
          {/* <Pagination
            count={Math.ceil(totalAccount / pageSize)}
            variant="outlined"
            page={pageNumber}
            shape="rounded"
            onChange={onChangePage}
          /> */}
          <Button variant="contained" onClick={onClickCreateAccount}>Tạo tài khoản</Button>
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
          <Button variant="contained" onClick={handleClose} style={{ minWidth: 80 }}>
            Hủy
          </Button>
          <Button variant="contained" onClick={clickDeleteAccount} autoFocus>
            Xóa tài khoản
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
