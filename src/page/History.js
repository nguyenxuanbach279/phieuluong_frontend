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
  DialogActions,
} from "@mui/material";
import api from "../services/api";
import { AppContext } from "../contexts/app.context";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function History() {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [keySearch, setKeySearch] = useState("");
  const [detailData, setDetailData] = useState("");
  const [open, setOpen] = useState(false);
  const [detailHistorySlice, setDetailHistorySlice] = useState([]);
  const { appState } = useContext(AppContext);
  const [historyId, setHistoryId] = useState(-1);
  const [openDetailInfo, setOpenDetailInfo] = useState(false);
  const [detailInfoChoose, setDetailInfoChoose] = useState({});
  console.log(detailInfoChoose)
  const handleCloseDetailInfo = (item) => {
    setDetailInfoChoose(item)
    setOpenDetailInfo(false);
  };

  const clickOpenDetailInfo = () => {
    setOpenDetailInfo(true);
  };

  const departments = [
    "Giám đốc",
    "Quản lý",
    "Sản xuất",
    "Nhân sự",
    "Kế toán",
    "Bán hàng",
    "Hành chính",
  ];

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

  const types = [
    "Thêm nhân viên",
    "Chỉnh sửa nhân viên",
    "Xóa nhân viên",
    "Upload excel",
    "Gửi phiếu lương",
  ];

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
    // setOpen(true);
    // setHistoryId(history.idHistory);
    // setDetailData(history);
    console.log(history)
    navigate(`/history-detail/${history.idHistory}`)
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
                    sx={{ textAlign: "left", padding: "16px", width: 300 }}
                  >
                    Email
                  </TableCell>
                  <TableCell sx={{ textAlign: "left", padding: "16px" }}>
                    Thao tác
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
                      <TableCell sx={{ textAlign: "left", padding: "12px" }}>
                        {types[history.typeChange - 1]}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", padding: "12px" }}>
                        {moment(
                          history.perforDate,
                          "YYYY-MM-DDTHH:mm:ss"
                        ).format("DD-MM-YYYY HH:mm:ss")}
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
              <Typography className="editHistoryInfo">Thao tác :</Typography>
              <Stack flexDirection="column" rowGap="2px">
                {detailHistorySlice.map((item, index) => {
                  return <Typography key={index}>{item}</Typography>;
                })}
              </Stack>
            </Stack>
            <Stack flexDirection="row" columnGap="0px" alignItems="center">
              <Typography className="editHistoryInfo">Chi tiết :</Typography>
              {detailData.description &&
              JSON.parse(detailData.description).length > 1 ? (
                <>
                  {detailData.typeChange == 2 ? (
                    <>
                      <Button onClick={clickOpenDetailInfo}>
                        Xem thông tin
                      </Button>
                    </>
                  ) : (
                    <Stack flexDirection="column">
                      {detailData.description &&
                        JSON.parse(detailData.description).map((item) => {
                          return (
                            <Stack flexDirection="row" key={item.Email}>
                              <Typography style={{ minWidth: 240 }}>
                                {item.Email}
                              </Typography>
                              <Button onClick={clickOpenDetailInfo(item)}>
                                Xem thông tin
                              </Button>
                            </Stack>
                          );
                        })}
                    </Stack>
                  )}
                </>
              ) : (
                <>
                  <Button onClick={clickOpenDetailInfo}>Xem thông tin</Button>
                </>
              )}
            </Stack>
            <Stack flexDirection="row" alignItems="center">
              <Typography className="editHistoryInfo">File excel :</Typography>
              {detailData.typeChange === 4 ? (
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
        <DialogActions>
          <Button onClick={() => setDetailInfoChoose(1)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {detailData.description && (
        <Dialog
          open={openDetailInfo}
          onClose={handleCloseDetailInfo}
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "800px", // Set your width here
              },
            },
          }}
        >
          <DialogTitle>Thông tin</DialogTitle>
          <DialogContent>
            {detailData.typeChange == 2 }
            <Stack flexDirection="row" columnGap="100px">
              <Stack flexDirection="column" rowGap={2} alignItems="flex-start">
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="editEmployeeInfo">
                    Họ và tên:
                  </Typography>
                  <Typography>
                    {JSON.parse(detailData.description).Name}
                  </Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="editEmployeeInfo">
                    Mã nhân viên:
                  </Typography>
                  <Typography>
                    {JSON.parse(detailData.description).EmployeeCode}
                  </Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="editEmployeeInfo">
                    Địa chỉ gmail:
                  </Typography>
                  <Typography>
                    {JSON.parse(detailData.description).Email}
                  </Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="editEmployeeInfo">Chức vụ:</Typography>
                  <Typography>
                    {JSON.parse(detailData.description).CurrentLevel}
                  </Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="editEmployeeInfo">
                    Lương cơ bản:
                  </Typography>
                  <Typography>
                    {JSON.parse(
                      detailData.description
                    )?.BasicSalary?.toLocaleString("it-IT")}{" "}
                    <span style={{ fontSize: 14 }}>VNĐ</span>
                  </Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="editEmployeeInfo">Hệ số:</Typography>
                  <Typography>
                    {JSON.parse(detailData.description).CoefficyPower?.toFixed(
                      2
                    )}
                  </Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="editEmployeeInfo">
                    Số điện thoại:
                  </Typography>
                  <Typography>
                    {JSON.parse(detailData.description).Phone}
                  </Typography>
                </Stack>
              </Stack>
              <Stack flexDirection="column" rowGap={2} alignItems="flex-start">
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="salaryviewInfo">Phòng ban:</Typography>
                  <Typography>
                    {
                      departments[
                        JSON.parse(detailData.description).DepartmentID
                      ]
                    }
                  </Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="salaryviewInfo">
                    Chỉ số chấm công:
                  </Typography>
                  <Typography>
                    {JSON.parse(detailData.description).CoefficyTimeKeeping}{" "}
                    công
                  </Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="salaryviewInfo">Ngày sinh:</Typography>
                  <Typography>
                    {moment(
                      JSON.parse(detailData.description).DoB,
                      "YYYY-MM-DDTHH:mm:ss"
                    ).format("DD-MM-YYYY")}
                  </Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="salaryviewInfo">
                    Tiền bảo hiểm:
                  </Typography>
                  <Typography>
                    {JSON.parse(
                      detailData.description
                    ).Insurance?.toLocaleString("it-IT")}{" "}
                    <span style={{ fontSize: 14 }}>VNĐ</span>
                  </Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="salaryviewInfo">Thuế TNCN:</Typography>
                  <Typography>
                    {JSON.parse(detailData.description).TaxFee?.toLocaleString(
                      "it-IT"
                    )}{" "}
                    <span style={{ fontSize: 14 }}>VNĐ</span>
                  </Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="salaryviewInfo">
                    Tiền ứng trước:
                  </Typography>
                  <Typography>
                    {JSON.parse(detailData.description).Advance?.toLocaleString(
                      "it-IT"
                    )}{" "}
                    <span style={{ fontSize: 14 }}>VNĐ</span>
                  </Typography>
                </Stack>
                <Stack flexDirection="row" columnGap="2px" alignItems="center">
                  <Typography className="salaryviewInfo">
                    Tổng lương nhận:
                  </Typography>
                  <Typography>
                    {detailData?.FinalSalary
                      ? JSON.parse(detailData?.FinalSalary).toLocaleString(
                          "it-IT"
                        )
                      : 0}{" "}
                    <span style={{ fontSize: 14 }}>VNĐ</span>
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
