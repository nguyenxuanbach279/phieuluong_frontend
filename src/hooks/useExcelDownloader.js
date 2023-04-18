import { useEffect } from "react";

const useExcelDownloader = (data, fileName) => {
  useEffect(() => {
    // Nếu không có dữ liệu hoặc tên file, không làm gì cả
    if (!data || !fileName) return;

    // Tạo một đối tượng Blob với dữ liệu Excel và kiểu MIME của file Excel
    const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    // Tạo một URL tạm thời cho file Excel bằng cách sử dụng phương thức URL.createObjectURL()
    const url = URL.createObjectURL(blob);

    // Tạo một thẻ <a> để tạo link download
    const a = document.createElement("a");

    // Thiết lập href của thẻ <a> bằng URL tạm thời
    a.href = url;

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
  }, [data, fileName]);
};

export default useExcelDownloader;