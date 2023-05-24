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
  Select,
  MenuItem,
  FormControl as FormControlMui,
  InputLabel,
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
  const [historyId, setHistoryId] = useState(-1);
  const [openDetailInfo, setOpenDetailInfo] = useState(false);
  const [detailInfoChoose, setDetailInfoChoose] = useState({});
  const [historyType, setHistoryType] = useState(0);
  const { appState, dispatch, setIsLoading } = useContext(AppContext);

  const handleCloseDetailInfo = (item) => {
    setDetailInfoChoose(item);
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
  }, [keySearch, historyType]);

  useEffect(() => {
    if (detailData) {
      const detail = detailData.detail;
      setDetailHistorySlice(detail.split(";"));
    }
  }, [detailData]);

  const getHistoryData = async () => {
    setIsLoading(true);
    try {
      const historyDataRes = await api.getHistoryData(appState.jwtToken);
      console.log(historyDataRes);
      if (historyDataRes.status === 200) {
        if (historyType != 0) {
          const temp = historyDataRes.data.data.filter(
            (item) => item.typeChange == historyType
          );
          setHistoryData(temp);
        } else setHistoryData(historyDataRes.data.data);
      }
    } catch (error) {
      // xu ly loi
      console.log(error);
    }
    setIsLoading(false);
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
    setIsLoading(true);
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
    setIsLoading(false);
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
    console.log(history);
    navigate(`/history-detail/${history.idHistory}`);
  };

  const getExcelData = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
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

  const onChangeType = (e) => {
    dispatch({
      type: "HISTORY_FILTER_TYPE",
      historyFilterType: e.target.value,
    });
    setHistoryType(e.target.value);
  };
  console.log(appState)
  return (
    <div className="historyContainer">
      <div className="historyTitleBox">
        <p className="historyTitle">Lịch sử</p>
        <div>
          <FormControlMui sx={{ width: 200 }}>
            <InputLabel id="demo-simple-select-label1">
              Loại thao tác
            </InputLabel>
            <Select
              labelId="demo-simple-select-label1"
              id="demo-simple-select1"
              value={appState.historyFilterType}
              onChange={onChangeType}
              sx={{ height: 48 }}
              label="Loại thao tác"
            >
              <MenuItem value="1">Thêm nhân viên</MenuItem>
              <MenuItem value="2">Chỉnh sửa nhân viên</MenuItem>
              <MenuItem value="3">Xóa nhân viên</MenuItem>
              <MenuItem value="4">Upload file excel</MenuItem>
              <MenuItem value="5">Gửi phiếu lương</MenuItem>
              <MenuItem value="0">Tất cả</MenuItem>
            </Select>
          </FormControlMui>
        </div>
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
            {detailData.typeChange == 2}
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
