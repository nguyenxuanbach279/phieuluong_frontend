import { Stack, Typography } from "@mui/material";
import moment from "moment";
import React from "react";

export default function EmployeeSalary({ employeeDetail }) {
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
      <div className="salaryViewBox">
        <p className="salaryViewTitle">
          Xác thực phiếu lương tháng{" "}
          {employeeDetail.Month < 10
            ? `0${employeeDetail.Month}`
            : employeeDetail.Month}
        </p>
        <div className="salaryDetail">
          <Stack flexDirection="column" rowGap={2} alignItems="flex-start">
            <Stack flexDirection="row" columnGap="2px" alignItems="center">
              <Typography className="editEmployeeInfo">Họ và tên:</Typography>
              <Typography>{employeeDetail.Name}</Typography>
            </Stack>
            <Stack flexDirection="row" columnGap="2px" alignItems="center">
              <Typography className="editEmployeeInfo">
                Mã nhân viên:
              </Typography>
              <Typography>{employeeDetail.EmployeeCode}</Typography>
            </Stack>
            <Stack flexDirection="row" columnGap="2px" alignItems="center">
              <Typography className="editEmployeeInfo">
                Địa chỉ gmail:
              </Typography>
              <Typography>{employeeDetail.Email}</Typography>
            </Stack>
            <Stack flexDirection="row" columnGap="2px" alignItems="center">
              <Typography className="editEmployeeInfo">Chức vụ:</Typography>
              <Typography>{employeeDetail.CurrentLevel}</Typography>
            </Stack>
            <Stack flexDirection="row" columnGap="2px" alignItems="center">
              <Typography className="editEmployeeInfo">
                Lương cơ bản:
              </Typography>
              <Typography>
                {employeeDetail?.BasicSalary?.toLocaleString("it-IT")}{" "}
                <span style={{ fontSize: 14 }}>VNĐ</span>
              </Typography>
            </Stack>
            <Stack flexDirection="row" columnGap="2px" alignItems="center">
              <Typography className="editEmployeeInfo">Hệ số:</Typography>
              <Typography>
                {employeeDetail.CoefficyPower?.toFixed(2)}
              </Typography>
            </Stack>
            <Stack flexDirection="row" columnGap="2px" alignItems="center">
              <Typography className="editEmployeeInfo">
                Số điện thoại:
              </Typography>
              <Typography>{employeeDetail.Phone}</Typography>
            </Stack>
          </Stack>
          <Stack flexDirection="column" rowGap={2} alignItems="flex-start">
            <Stack flexDirection="row" columnGap="2px" alignItems="center">
              <Typography className="salaryviewInfo">Phòng ban:</Typography>
              <Typography>
                {departments[employeeDetail.DepartmentID]}
              </Typography>
            </Stack>
            <Stack flexDirection="row" columnGap="2px" alignItems="center">
              <Typography className="salaryviewInfo">
                Chỉ số chấm công:
              </Typography>
              <Typography>{employeeDetail.CoefficyTimeKeeping} công</Typography>
            </Stack>
            <Stack flexDirection="row" columnGap="2px" alignItems="center">
              <Typography className="salaryviewInfo">Ngày sinh:</Typography>
              <Typography>
                {moment(employeeDetail.DoB, "YYYY-MM-DDTHH:mm:ss").format(
                  "DD-MM-YYYY"
                )}
              </Typography>
            </Stack>
            <Stack flexDirection="row" columnGap="2px" alignItems="center">
              <Typography className="salaryviewInfo">Tiền bảo hiểm:</Typography>
              <Typography>
                {employeeDetail.Insurance?.toLocaleString("it-IT")}{" "}
                <span style={{ fontSize: 14 }}>VNĐ</span>
              </Typography>
            </Stack>
            <Stack flexDirection="row" columnGap="2px" alignItems="center">
              <Typography className="salaryviewInfo">Thuế TNCN:</Typography>
              <Typography>
                {employeeDetail.TaxFee?.toLocaleString("it-IT")}{" "}
                <span style={{ fontSize: 14 }}>VNĐ</span>
              </Typography>
            </Stack>
            <Stack flexDirection="row" columnGap="2px" alignItems="center">
              <Typography className="salaryviewInfo">
                Tiền ứng trước:
              </Typography>
              <Typography>
                {employeeDetail.Advance?.toLocaleString("it-IT")}{" "}
                <span style={{ fontSize: 14 }}>VNĐ</span>
              </Typography>
            </Stack>
          </Stack>
        </div>
        <div className="totalSalary">
          <p>
            Tổng lương được nhận:{" "}
            {employeeDetail.FinalSalary?.toLocaleString("it-IT")}{" "}
            <span style={{ fontSize: 14 }}>VNĐ</span>
          </p>
        </div>
      </div>
    </div>
  );
}
