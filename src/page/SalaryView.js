import React from "react";
import "../css/SalaryView.css";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { toast } from "react-toastify";
export default function SalaryView() {
  const [open, setOpen] = React.useState(false);


  const handleClose = () => {
    setOpen(false);
  };
  const submitSalary = () => {
    toast.success("Xác nhận phiếu lương thành công");
  };

  const reportSalary = () => {
    setOpen(true);
  };

  const clickSendReport = () => {
    //send report
  };

  return (
    <>
      <div className="salaryViewContainer">
        <div className="salaryViewBox">
          <p className="salaryViewTitle">Xác thực phiếu lương tháng 09/2022</p>
          <p className="employeeName">
            Họ tên: <b>Phạm Quốc Bình</b>
          </p>
          <div className="salaryDetail">
            <div>
              <p>Mã nhân viên: MNV001</p>
              <p>Lương chính: 1000000 VND</p>
              <p>Phụ cấp ăn trưa: 1000000 VND</p>
              <p>Phụ cấp điện thoại: 1000000 VND</p>
              <p>Tổng lương thực tế: 1000000 VND</p>
              <p>Tổng lương thực tế: 1000000 VND</p>
            </div>
            <div>
              <p>Chức vụ: Nhân viên</p>
              <p>Ngày công: 20</p>
              <p>Phụ cấp ăn trưa: 1000000 VND</p>
              <p>Phụ cấp điện thoại: 1000000 VND</p>
              <p>Tổng lương thực tế: 1000000 VND</p>
              <p>Tổng lương thực tế: 1000000 VND</p>
            </div>
          </div>
          <div className="totalSalary">
            <p>Tổng lương được nhận: 10000000VND</p>
          </div>
          <div className="salaryViewActions">
            <Button variant="contained" onClick={reportSalary}>
              Phản hồi
            </Button>
            <Button variant="contained" onClick={submitSalary}>
              Xác nhận
            </Button>
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Phản hồi ý kiến về phiếu lương
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ghi phản hồi của bạn vào đây
          </DialogContentText>
          <TextField
            placeholder="Ghi phản hồi của bạn vào đây..."
            multiline
            rows={6}
            maxRows={20}
            sx={{width: 400}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={clickSendReport}>
            Gửi phản hồi
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
