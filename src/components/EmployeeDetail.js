import { Stack, Typography } from "@mui/material";
import moment from "moment";
import React from "react";

export default function EmployeeDetail({ historyDetailInfo }) {
  console.log("A",historyDetailInfo);
  const departments = [
    "Giám đốc",
    "Quản lý",
    "Sản xuất",
    "Nhân sự",
    "Kế toán",
    "Bán hàng",
    "Hành chính",
  ];

  return (
    <div>
      <Stack flexDirection="row" columnGap="80px">
        <Stack flexDirection="column" rowGap={2} alignItems="flex-start">
          <Stack flexDirection="row" columnGap="2px" alignItems="center">
            <Typography className="editEmployeeInfo">Họ và tên:</Typography>
            <Typography>{historyDetailInfo.Name}</Typography>
          </Stack>
          <Stack flexDirection="row" columnGap="2px" alignItems="center">
            <Typography className="editEmployeeInfo">Mã nhân viên:</Typography>
            <Typography>{historyDetailInfo.EmployeeCode}</Typography>
          </Stack>
          <Stack flexDirection="row" columnGap="2px" alignItems="center">
            <Typography className="editEmployeeInfo">Địa chỉ gmail:</Typography>
            <Typography>{historyDetailInfo.Email}</Typography>
          </Stack>
          <Stack flexDirection="row" columnGap="2px" alignItems="center">
            <Typography className="editEmployeeInfo">Chức vụ:</Typography>
            <Typography>{historyDetailInfo.CurrentLevel}</Typography>
          </Stack>
          <Stack flexDirection="row" columnGap="2px" alignItems="center">
            <Typography className="editEmployeeInfo">Lương cơ bản:</Typography>
            <Typography>
              {historyDetailInfo.BasicSalary?.toLocaleString("it-IT")}{" "}
              <span style={{ fontSize: 14 }}>VNĐ</span>
            </Typography>
          </Stack>
          <Stack flexDirection="row" columnGap="2px" alignItems="center">
            <Typography className="editEmployeeInfo">Hệ số:</Typography>
            <Typography>
              {historyDetailInfo.CoefficyPower?.toFixed(2)}
            </Typography>
          </Stack>
          <Stack flexDirection="row" columnGap="2px" alignItems="center">
            <Typography className="editEmployeeInfo">Số điện thoại:</Typography>
            <Typography>{historyDetailInfo.Phone}</Typography>
          </Stack>
        </Stack>
        <Stack flexDirection="column" rowGap={2} alignItems="flex-start">
          <Stack flexDirection="row" columnGap="2px" alignItems="center">
            <Typography className="salaryviewInfo">Phòng ban:</Typography>
            <Typography>
              {departments[historyDetailInfo.DepartmentID]}
            </Typography>
          </Stack>
          <Stack flexDirection="row" columnGap="2px" alignItems="center">
            <Typography className="salaryviewInfo">
              Chỉ số chấm công:
            </Typography>
            <Typography>
              {historyDetailInfo.CoefficyTimeKeeping} công
            </Typography>
          </Stack>
          <Stack flexDirection="row" columnGap="2px" alignItems="center">
            <Typography className="salaryviewInfo">Ngày sinh:</Typography>
            <Typography>
              {moment(historyDetailInfo.DoB, "YYYY-MM-DDTHH:mm:ss").format(
                "DD-MM-YYYY"
              )}
            </Typography>
          </Stack>
          <Stack flexDirection="row" columnGap="2px" alignItems="center">
            <Typography className="salaryviewInfo">Tiền bảo hiểm:</Typography>
            <Typography>
              {historyDetailInfo.Insurance?.toLocaleString("it-IT")}{" "}
              <span style={{ fontSize: 14 }}>VNĐ</span>
            </Typography>
          </Stack>
          <Stack flexDirection="row" columnGap="2px" alignItems="center">
            <Typography className="salaryviewInfo">Thuế TNCN:</Typography>
            <Typography>
              {historyDetailInfo.TaxFee?.toLocaleString("it-IT")}{" "}
              <span style={{ fontSize: 14 }}>VNĐ</span>
            </Typography>
          </Stack>
          <Stack flexDirection="row" columnGap="2px" alignItems="center">
            <Typography className="salaryviewInfo">Tiền ứng trước:</Typography>
            <Typography>
              {historyDetailInfo.Advance?.toLocaleString("it-IT")}{" "}
              <span style={{ fontSize: 14 }}>VNĐ</span>
            </Typography>
          </Stack>
          <Stack flexDirection="row" columnGap="2px" alignItems="center">
            <Typography className="salaryviewInfo">Tổng lương nhận:</Typography>
            <Typography>
              {historyDetailInfo.FinalSalary
                ? historyDetailInfo?.FinalSalary.toLocaleString("it-IT")
                : 0}{" "}
              <span style={{ fontSize: 14 }}>VNĐ</span>
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
}
