# PortAsset CMMS v1.4.9 – Mã tài sản thống nhất (Public Safe)

## Thay đổi
- Bỏ cột **Thiết bị vật lý** khỏi bảng danh sách Work Order.
- Mã hiển thị trong hồ sơ HGT/khung chụp, timeline, bảng lịch sử, sổ chi phí, Work Order, báo cáo, biểu mẫu và lựa chọn thay thế dùng hệ mã tài sản `SIM...` thay cho các nhãn `HGT-xxx / SP-xxx`.
- Thiết bị đã có vị trí tài sản gốc mang mã `SIM01.02.1`, `SIM01.02.7`, `SIM01.04.1`, `SIM01.05.1`, `SIM01.03`. Đối với thiết bị dự phòng độc lập, demo dùng mã riêng `SIM-DP.HGT.*` hoặc `SIM-DP.SP.*` để không trùng mã.
- Các đoạn mô tả lịch sử/WO mẫu có mã cũ được chuyển cách **hiển thị**; nội dung gốc trong bản ghi người dùng không bị xóa hay sửa.
- Giữ nguyên ID kỹ thuật nội bộ và serial cho từng thiết bị để bảo toàn quan hệ sự kiện, chi phí, WO và truy vết xuyên nhiều cẩu. Cập nhật mã hiển thị tự động trên dữ liệu localStorage cũ; không reset.

## Cập nhật GitHub Pages
Giải nén, upload 5 file tại thư mục gốc repo `PortAsset`, Commit và tải lại bằng Ctrl+F5. Không tải file ZIP trực tiếp lên repo.

## Giới hạn
Đây là website tĩnh và dữ liệu mô phỏng, các chỉnh sửa chỉ lưu trong trình duyệt hiện tại. Mã `SIM-DP` là mã giả cho bộ phận dự phòng, không phải mã tài sản thực tế.
