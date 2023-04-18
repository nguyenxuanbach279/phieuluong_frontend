import React, { useContext, useEffect, useState } from "react";
import { FormControl } from "react-bootstrap";
import { RiDeleteBin6Line } from "react-icons/ri";
import JSZip from "jszip";
import { BsThreeDotsVertical } from "react-icons/bs";
import "../css/History.css";
import {
  Pagination,
  TableBody,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import api from "../services/api";
import { AppContext } from "../contexts/app.context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { async } from "q";
import useExcelDownloader from "../hooks/useExcelDownloader";
import * as XLSX from "xlsx";

export default function History() {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [keySearch, setKeySearch] = useState("");
  const [detailData, setDetailData] = useState("");
  const [open, setOpen] = useState(false);
  const [detailHistorySlice, setDetailHistorySlice] = useState([]);
  const { appState, dispatch } = useContext(AppContext);
  const [downloadData, setDownloadData] = useState("");

  useEffect(() => {
    if (keySearch === "") {
      getHistoryData();
    } else {
      getHistoryDataByName();
    }
  }, [keySearch]);

  useEffect(() => {
    if (detailData) {
      const detail = detailData.detail;
      setDetailHistorySlice(detail.split(";"));
    }
  }, [detailData]);

  const getHistoryData = async () => {
    try {
      const historyDataRes = await api.getHistoryData(appState.jwtToken);
      console.log(historyDataRes);
      if (historyDataRes.status === 200) {
        setHistoryData(historyDataRes.data.data);
      }
    } catch (error) {
      // xu ly loi
      console.log(error);
    }
  };

  const getHistoryDataByName = async () => {
    const data = keySearch;
    try {
      const historyDataByNameRes = await api.getHistoryDataByName(
        appState.jwtToken,
        data
      );
      console.log(historyDataByNameRes);
      if (historyDataByNameRes.status === 200) {
        setHistoryData(historyDataByNameRes.data.data);
      }
    } catch (error) {
      // xu ly loi
      console.log(error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChangeKeySearch = (e) => {
    setKeySearch(e.target.value);
  };

  const clickDetailHistory = (history) => {
    setOpen(true);
    setDetailData(history);
  };

  // useExcelDownloader(downloadData, "ten_file_excel.xlsx");

  const downloadExcel = (data, fileName) => {
    if (!data || !fileName) return;

    // Tạo một đối tượng Blob với dữ liệu Excel và kiểu MIME của file Excel
    const blob = new Blob([data], {
      encoding: "UTF-8",
      type: "text/csv;charset=utf-8;",
    });

    // Tạo một URL tạm thời cho file Excel bằng cách sử dụng phương thức URL.createObjectURL()
    const url = URL.createObjectURL(blob);

    // Tạo một thẻ <a> để tạo link download
    const a = document.createElement("a");

    a.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(data));

    // Thiết lập href của thẻ <a> bằng URL tạm thời
    // a.href = url;

    // Thiết lập tên file Excel cho thẻ <a>
    a.download = fileName;

    // Thêm thẻ <a> vào DOM
    document.body.appendChild(a);

    // Kích hoạt sự kiện click trên thẻ <a> để bắt đầu quá trình download
    a.click();

    // Xóa thẻ <a> khỏi DOM
    document.body.removeChild(a);

    // Xóa URL tạm thời
    URL.revokeObjectURL(url);
  };

  const clickDownloadExcel = async () => {
    try {
      const downloadEcelRes = await api.getHistoryDataDownloadExcel(
        appState.jwtToken,
        detailData.idHistory
      );
      console.log(downloadEcelRes);
      if (downloadEcelRes.status === 200) {
        // setDownloadData(downloadEcelRes.data);
        downloadExcel(downloadEcelRes.data, "ten_file_excel.xlsx");
        toast.success("Tải xuống thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(detailHistorySlice);

  return (
    <div className="historyContainer">
      <div className="historyTitleBox">
        <p className="historyTitle">Lịch sử</p>
        <FormControl
          name="keysearch"
          type="text"
          value={keySearch}
          onChange={onChangeKeySearch}
          placeholder="Tìm kiếm tên nhân viên..."
          className="keySearchInput"
        />
      </div>
      <div className="historyContentBox">
        <div className="historyTable">
          <TableContainer sx={{ height: 450 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: "center", padding: "16px" }}>
                    STT
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", padding: "16px" }}>
                    Họ tên
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", padding: "16px" }}>
                    Thời gian thực hiện
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", padding: "16px" }}>
                    Chi tiết
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyData.map((history, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell sx={{ textAlign: "center", padding: "16px" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", padding: "16px" }}>
                        {history.namePerformer}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", padding: "16px" }}>
                        {history.perforDate}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", padding: "16px" }}
                        onClick={() => clickDetailHistory(history)}
                      >
                        <BsThreeDotsVertical />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Chi tiết lịch sử</DialogTitle>
        <DialogContent>
          <Stack rowGap={2}>
            <Stack flexDirection="row" alignItems="center">
              <Typography className="editHistoryInfo">Họ và tên:</Typography>
              <Typography>{detailData.namePerformer}</Typography>
            </Stack>
            <Stack flexDirection="row" alignItems="center">
              <Typography className="editHistoryInfo">Thời gian :</Typography>
              <Typography>{detailData.perforDate}</Typography>
            </Stack>
            <Stack flexDirection="row" columnGap="0px">
              <Typography className="editHistoryInfo">Chi tiết :</Typography>
              <Stack flexDirection="column" rowGap="2px">
                {detailHistorySlice.map((item, index) => {
                  return <Typography key={index}>{item}</Typography>;
                })}
              </Stack>
            </Stack>
            {detailData?.detail?.includes("Đã thêm") &&
              detailData?.detail?.includes("Đã update") &&
              detailData?.detail?.includes("Bị lỗi") && (
                <Stack flexDirection="row" alignItems="center">
                  <Typography className="editHistoryInfo">
                    File excel :
                  </Typography>
                  <Button variant="contained" onClick={clickDownloadExcel}>
                    Download
                  </Button>
                </Stack>
              )}
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
}
