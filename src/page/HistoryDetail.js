import React, { useContext, useEffect, useState } from "react";
import "../css/HistoryDetail.css";
import {
  Typography,
  Stack,
  Button,
  DialogContent,
  DialogTitle,
  Dialog,
} from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { AppContext } from "../contexts/app.context";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import axios from "axios";
import moment from "moment";
import EmployeeDetail from "../components/EmployeeDetail";
import { FaLongArrowAltRight } from "react-icons/fa";
import EmployeeSalary from "../components/EmployeeSalary";

export default function HistoryDetail() {
  const params = useParams();
  const { appState, setIsLoading } = useContext(AppContext);
  const [detailData, setDetailData] = useState({});
  const [detailHistorySlice, setDetailHistorySlice] = useState([]);
  const [openDetailInfo, setOpenDetailInfo] = useState(false);
  const [historyDetailInfo, setHistoryDetailInfo] = useState([]);
  const [salaryViewInfo, setSalaryViewInfo] = useState({});

  const handleCloseDetailInfo = (item) => {
    setOpenDetailInfo(false);
  };

  const clickOpenDetailInfo = (item) => {
    setSalaryViewInfo(item);
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
    getDetailHistory();
  }, []);

  const getDetailHistory = async () => {
    setIsLoading(true)
    try {
      const detailHistoryRes = await api.getHistoryDetailData(
        appState.jwtToken,
        Number(params.idHistory)
      );
      if (detailHistoryRes.status == 200) {
        setDetailData(detailHistoryRes.data.data);
        setDetailHistorySlice(detailHistoryRes.data.data.detail.split(";"));
        setHistoryDetailInfo(
          JSON.parse(detailHistoryRes.data.data.description)
        );
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false)
  };

  const getExcelData = async () => {
    setIsLoading(true)
    try {
      const response = await axios({
        url: `https://localhost:7101/api/History/download?IDHistory=${params.idHistory}`,
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
    setIsLoading(false)
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

  console.log(detailData);

  return (
    <div className="historyDetailContainer">
      <div className="historyDetailTitleBox">
        <p className="historyDetailTitle">Chi tiết lịch sử</p>
      </div>
      <div className="historyDetailContentBox">
        <div className="historyDetailContent">
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
            <Stack flexDirection="row" columnGap="0px" alignItems="flex-start">
              {detailData.typeChange !== 4 ? (
                <>
                  <Typography className="editHistoryInfo">
                    Chi tiết :
                  </Typography>
                  {detailData.description && historyDetailInfo.length > 1 ? (
                    <>
                      {detailData.typeChange == 2 ? (
                        <>
                          <Button
                            onClick={() =>
                              clickOpenDetailInfo(historyDetailInfo[0])
                            }
                          >
                            Xem thông tin
                          </Button>
                        </>
                      ) : (
                        <Stack flexDirection="column" alignItems="center">
                          {detailData.description &&
                            historyDetailInfo.map((item) => {
                              return (
                                <Stack flexDirection="row" key={item.Email}>
                                  <Typography style={{ minWidth: 240 }}>
                                    {item.Email}
                                  </Typography>
                                  <Button
                                    onClick={() => clickOpenDetailInfo(item)}
                                  >
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
                      <Button
                        onClick={() =>
                          clickOpenDetailInfo(historyDetailInfo[0])
                        }
                      >
                        Xem thông tin
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Typography className="editHistoryInfo">
                    Chi tiết : Không
                  </Typography>
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
        </div>
      </div>
      {detailData.description && (
        <Dialog
          open={openDetailInfo}
          onClose={handleCloseDetailInfo}
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                height: "100%",
                maxWidth:
                  detailData.typeChange == 2
                    ? "1400px"
                    : detailData.typeChange == 5
                    ? "1100px"
                    : "700px",
                maxHeight: detailData.typeChange == 5 ? "600px" : "400px",
              },
            },
          }}
        >
          <DialogTitle sx={{ fontSize: 24, fontWeight: 700 }}>
            Thông tin
          </DialogTitle>
          <DialogContent>
            {detailData.typeChange == 2 && (
              <Stack flexDirection="row" columnGap="28px">
                <Stack>
                  <Typography
                    sx={{ fontSize: 20, fontWeight: 500, marginBottom: "12px" }}
                  >
                    Dữ liệu cũ
                  </Typography>
                  <EmployeeDetail historyDetailInfo={historyDetailInfo[0]} />
                </Stack>
                <Stack justifyContent="center" alignItems="center">
                  <FaLongArrowAltRight style={{ fontSize: 60 }} />
                </Stack>
                <Stack>
                  <Typography
                    sx={{ fontSize: 20, fontWeight: 500, marginBottom: "12px" }}
                  >
                    Dữ liệu đã cập nhập
                  </Typography>
                  <EmployeeDetail historyDetailInfo={historyDetailInfo[1]} />
                </Stack>
              </Stack>
            )}
            {detailData.typeChange == 1 ||
              (detailData.typeChange == 3 && (
                <EmployeeDetail historyDetailInfo={historyDetailInfo} />
              ))}
            {detailData.typeChange == 5 && (
              <>
                <EmployeeSalary employeeDetail={salaryViewInfo} />
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
