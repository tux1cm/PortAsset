# PortAsset CMMS v1.4 — Liên kết WO và nhật ký tháo/lắp (Public Safe)

Website tĩnh minh họa CMMS quản lý tài sản cẩu theo **Grid View → bấm dòng → Chi tiết toàn màn hình**. Mã tài sản, thiết bị, tên đơn vị, serial, Work Order, lịch sử và chi phí đều được giả lập. Không chứa ảnh chụp hay hồ sơ cẩu thật. Chạy trên GitHub Pages, không cần build.

## Thay đổi v1.4

### 1. Thông tin chung và Thiết bị luân chuyển

- Bấm **Ghi nhận tháo/lắp** ở tab **Thông tin chung** (vị trí HGT/Spreader) và nút **Tháo/lắp** ở **Thiết bị luân chuyển** sẽ mở **cùng một biểu mẫu nghiệp vụ**.
- Nhận diện thiết bị vật lý bằng `HGT-...` / `SP-...` và vị trí kỹ thuật bằng `SIM01...`.
- Có thể ghi giao dịch độc lập, hoặc điền **Số WO tham chiếu** đã tồn tại. Giao dịch thành công tự động cập nhật vị trí/trạng thái và nhật ký lịch sử.

### 2. Work Order có thể ghi nhận giao dịch phát sinh

- Giữ nguyên **Loại công việc** (`Sửa chữa`, `Bảo dưỡng`, `Kiểm tra`, `Đại tu`).
- Trong form WO bổ sung mục **Ghi nhận tháo/lắp phát sinh cùng WO**. Mặc định là **Không phát sinh**.
- Nếu thiết bị **đã thực sự được tháo, lắp, chuyển xưởng hoặc nghiệm thu**, chọn giao dịch cụ thể, thời gian, địa điểm/vị trí và diễn giải; lưu WO sẽ tạo **đúng một** bản ghi nhật ký liên kết với mã WO.
- Nếu chỉ **lập kế hoạch sửa chữa**, không chọn giao dịch. WO có thể được tạo mà không thay đổi trạng thái lắp đặt.
- Sửa WO sau này mặc định **không tạo thêm nhật ký**. Muốn ghi thêm một giao dịch thực tế, cần chủ động chọn giao dịch mới.
- Các ràng buộc chống trùng vị trí, thiết bị đang sửa chữa hoặc thời gian sai được áp dụng như khi ghi tháo/lắp độc lập. **Kiểm tra trước, cập nhật WO và nhật ký cùng lúc** để tránh lưu một phần khi thao tác không hợp lệ.

### 3. Lịch sử tháo/lắp = chỉ xem

- Không còn nút **Giao dịch mới**, **Ghi tháo/lắp**, **Ghi chi phí** bên trong tab lịch sử.
- Có cột **WO tham chiếu**, hiển thị mã WO khi giao dịch được ghi từ WO hoặc tham chiếu tới WO.
- Nhật ký vẫn đi theo **thiết bị vật lý**, kể cả sau khi tháo rời khỏi cẩu; ở cấp vị trí kỹ thuật, nhật ký phản ánh các giao dịch phát sinh tại nhánh tài sản.
- Chi phí vẫn ghi tại tab chi phí bảo trì hoặc hồ sơ thiết bị; không phát sinh khoản chi chỉ vì ghi nhận giao dịch tháo/lắp.

## Chạy thử quy trình

1. Vào cẩu `CRANE-001` → **Cơ cấu nâng hạ hàng** → vị trí `SIM01.02.1` → **Thông tin chung** → **Ghi nhận tháo/lắp** để thử ghi nhận độc lập (hoặc có số WO tham chiếu).
2. Vào hồ sơ `HGT-001` → **Bảo trì / Work Order** → **Tạo Work Order**.
3. Điền nội dung công việc, chọn **Giao dịch thực tế = Tháo khỏi cẩu**, ngày giờ và nơi chuyển đến `Kho kỹ thuật`; lưu.
4. Vào **Lịch sử tháo/lắp** để xem giao dịch tự động có mã WO. Mở **Thiết bị luân chuyển** để kiểm tra HGT-001 đã rời khỏi cẩu.
5. Lắp `HGT-006` dự phòng vào vị trí trống bằng WO khác; thử lắp HGT-001 đè lên vị trí đó để thấy hệ thống chặn.
6. Nếu muốn tạo WO mà **không** ghi tháo/lắp, để **Giao dịch thực tế = Không phát sinh**.

## Đưa lên GitHub Pages

Giải nén ZIP và đưa **5 file** vào root của repository đang dùng:

```
index.html
app.js
styles.css
.nojekyll
README.md
```

GitHub → repository → **Add file → Upload files** → ghi đè file cũ → **Commit changes**. Nếu chưa bật Pages: **Settings → Pages → Deploy from a branch → main → /(root)**.

Web chỉ lưu dữ liệu tại **localStorage**, không dùng server/database. Khóa lưu v1.4 tự đọc dữ liệu Public Safe từ v1.3 trong cùng trình duyệt để người dùng có thể tiếp tục thử các giao dịch trước; nếu muốn trở lại bản giả lập gốc, dùng **Dữ liệu → Khôi phục dữ liệu mẫu**. Cần reload cứng nếu trình duyệt còn cache JS/CSS cũ (`Ctrl+F5`).

## Phạm vi và an toàn dữ liệu

- **Public Safe**: chỉ dữ liệu mô phỏng, không chứa ảnh tham chiếu thật, số serial thật, mã cẩu/đơn vị thật, lịch sử hoặc chi phí thực tế.
- Vì là GitHub Pages công khai, bất kỳ dữ liệu nào nhập lên bản web hoặc xuất/chia sẻ JSON có thể gây rò rỉ nếu là thông tin thực. **Không nhập dữ liệu khách hàng thật vào demo.**
- Đây là mockup kiểm tra luồng nghiệp vụ, chưa có phân quyền, kiểm soát trạng thái WO theo phê duyệt, audit log bất biến, chứng từ kho, hay đồng bộ nhiều người dùng. Không dùng làm hệ thống production.

Phiên bản: **v1.4 – WO & Movement / Grid & Detail / Public Safe**.
