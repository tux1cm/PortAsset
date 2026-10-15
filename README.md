# PortAsset CMMS v1.5.1 — 5 cẩu, chỉ số sản lượng và dữ liệu đảo chuyển (Public Safe)

Bản nâng cấp từ v1.5.0. Chỉ sử dụng dữ liệu giả lập, không chứa hình ảnh hoặc hồ sơ thật của cảng. Chạy hoàn toàn trong trình duyệt, hỗ trợ GitHub Pages. Không cần build.

## Thay đổi

1. **Vận hành / Chỉ số**: Lịch sử của chỉ số *Sản lượng* chỉ hiển thị 4 cột **Thời điểm – Sản lượng – Cẩu tại thời điểm ghi – Ghi chú**. Bỏ **Giá trị trước**, **Phát sinh**. Chỉ thay màn hình lịch sử; form nhập vẫn hỗ trợ cộng thêm hoặc nhập tổng lũy kế.
2. **Thêm 4 cẩu** CRANE-002, CRANE-003, CRANE-004, CRANE-005 (tổng cộng 5 cẩu), mỗi cẩu có 9 cụm cấp 2 và các vị trí HGT/khung chụp để xem cây, Work Order và chi phí.
3. **Đảo chuyển khung chụp giữa CRANE-001 và CRANE-002**: dữ liệu mẫu cho SP-001 và SP-003 gồm tháo/lắp hai chiều, thời gian, cẩu tại thời điểm phát sinh, lịch sử riêng từng serial và sản lượng lũy kế không bị reset.
   - SP-001: **100.000 → 115.000** (CRANE-001) → **120.000 → 124.000** (CRANE-002) → **127.000** (CRANE-001).
   - SP-003: **70.000 → 85.000** (CRANE-002) → **91.000** (CRANE-001) → **106.000** (CRANE-002).
4. **HGT / Khung chụp các cẩu mới**: có hồ sơ serial giả, các sự kiện tháo/lắp, bảo dưỡng, nghiệm thu, Work Order và chi phí demo. Hộp giảm tốc dự phòng cũng có dữ liệu bảo dưỡng/chi phí.
5. Giữ nguyên nghiệp vụ thay thế ở tài sản và WO, lịch sử vị trí, chi phí, nhập/xuất JSON, cùng dữ liệu trình duyệt cũ.

## Kiểm thử trên web

- Mở **Tài sản**: thấy 5 cẩu cấp 1, mở mũi tên để xem cấp 2–3.
- Mở **CRANE-001 → Khung chụp → Vận hành / Chỉ số**, chọn đúng serial của SP-001: kiểm tra sản lượng và hai mã cẩu theo thời gian.
- Mở **CRANE-002 → Khung chụp → Vận hành / Chỉ số**, chọn SP-003: kiểm tra lịch sử đảo chuyển ngược lại.
- Mở các mã HGT trong CRANE-002 tới CRANE-005; vào **Bảo trì / Work Order**, **Lịch sử vị trí**, **Chi phí bảo trì** để thử.

**Tương thích dữ liệu cũ:** v1.5.1 tự bổ sung 4 cẩu và các hồ sơ giả mới mà không xóa lịch sử/chi phí đã nhập. Kịch bản *đảo chuyển SP-001/SP-003* được tự thêm khi phát hiện dữ liệu demo gốc chưa chỉnh sửa. Nếu đã tùy biến trạng thái/serial/giao dịch, hệ thống không tự ý ghi đè thiết bị bạn đang dùng; để xem toàn bộ kịch bản mẫu, xuất JSON sao lưu trước, rồi dùng **Dữ liệu → Khôi phục dữ liệu mẫu**. Đây là bản demo lưu tại từng trình duyệt, chưa đồng bộ nhiều người.

## Triển khai GitHub Pages

Giải nén ZIP, upload **5 file** `index.html`, `app.js`, `styles.css`, `README.md`, `.nojekyll` trực tiếp vào thư mục gốc của repo GitHub `PortAsset`, Commit. Mở `https://tux1cm.github.io/PortAsset/` và nhấn Ctrl+F5.
