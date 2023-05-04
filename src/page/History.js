import React, { useContext, useEffect, useState } from "react";
import { FormControl } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import "../css/History.css";
import {
  TableBody,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import api from "../services/api";
import { AppContext } from "../contexts/app.context";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import axios from "axios";

export default function History() {
  const [historyData, setHistoryData] = useState([]);
  const [keySearch, setKeySearch] = useState("");
  const [detailData, setDetailData] = useState("");
  const [open, setOpen] = useState(false);
  const [detailHistorySlice, setDetailHistorySlice] = useState([]);
  const { appState } = useContext(AppContext);
  const [historyId, setHistoryId] = useState(-1);

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
    setHistoryId(history.idHistory);
    setDetailData(history);
  };

  const getExcelData = async () => {
    try {
      const response = await axios({
        url: `https://localhost:7101/api/History/download?IDHistory=${historyId}`,
        method: "GET",
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${appState.jwtToken}`,
        },
      });
      if (response.status === 200) {
        toast.success("Tải xuống thành công");
        return response.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createExcelFile = (excelData) => {
    const workbook = XLSX.read(excelData, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    return excelBlob;
  };

  const downloadExcelFile = (excelBlob) => {
    const excelUrl = URL.createObjectURL(excelBlob);
    const link = document.createElement("a");
    link.href = excelUrl;
    link.download = "excel_file.xlsx";
    document.body.appendChild(link);
    link.click();
  };

  const clickDownloadExcel = async () => {
    try {
      const excelData = await getExcelData();
      const excelBlob = createExcelFile(excelData);
      downloadExcelFile(excelBlob);
    } catch (error) {
      console.log(error);
    }
  };

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
          <TableContainer
            sx={{
              maxHeight: 510,
              borderTop: "none",
              minWidth: 600,
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: "center", padding: "16px" }}>
                    STT
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "left", padding: "16px", width: 240 }}
                  >
                    Họ tên
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "left", padding: "16px", width: 360 }}
                  >
                    Email
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
                      <TableCell sx={{ textAlign: "center", padding: "12px" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ textAlign: "left", padding: "12px" }}>
                        {history.namePerformer}
                      </TableCell>
                      <TableCell sx={{ textAlign: "left", padding: "12px" }}>
                        {history.email}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", padding: "12px" }}>
                        {history.perforDate}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", padding: "12px" }}>
                        <IconButton onClick={() => clickDetailHistory(history)}>
                          <BsThreeDotsVertical />
                        </IconButton>
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
        <DialogTitle id="alert-dialog-title1">Chi tiết lịch sử</DialogTitle>
        <DialogContent
          style={{
            minWidth: 600,
            minHeight: 200,
            maxHeight: 400,
            maxWidth: 600,
          }}
        >
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
            <Stack flexDirection="row" alignItems="center">
              <Typography className="editHistoryInfo">File excel :</Typography>
              {detailData?.detail?.includes("Đã thêm") &&
              detailData?.detail?.includes("Đã update") &&
              detailData?.detail?.includes("Bị lỗi") ? (
                <>
                  <Button variant="contained" onClick={clickDownloadExcel}>
                    Download
                  </Button>
                </>
              ) : (
                <>Không</>
              )}
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
}
