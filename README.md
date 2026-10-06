# SafeKid Parent App — Clickable Prototype

Prototype HTML/CSS/JS cho dự án SafeKid (DigiBabi), tập trung vào 7 task user testing theo hướng dẫn DBC 2026.

## Màn hình chính

1. Trang chủ phụ huynh
2. Vị trí trẻ / bản đồ live
3. Safe Zone / chỉnh bán kính vùng an toàn
4. Habit / nhiệm vụ / tích xu
5. Reward / đổi xu nhận quà
6. Free vs Premium
7. S.F AI Tier-1 + Human Handoff
8. Quyền riêng tư & dữ liệu trẻ em
9. SOS overlay — ưu tiên quy trình con người, không để AI tự xử lý khẩn cấp

## Cách chạy local

```bash
python -m http.server 8787 --directory "C:/Users/ntduy/Downloads/SafeKid-Prototype"
```

## Kid Watch Demo

File mới:

- `watch.html`
- `watch.css`
- `watch.js`

Luồng demo đồng hồ cho bé:

1. Watch face: giờ, trạng thái an toàn, xu, pin, 4G/GPS
2. Menu 6 icon lớn: Gọi, SOS, Nhiệm vụ, Quà, Lớp học, Nhạc offline
3. Gọi người thân từ danh bạ phụ huynh phê duyệt
4. SOS giữ 3 giây: gửi vị trí + gọi phụ huynh/người thật
5. Nhiệm vụ: bé hoàn thành task và nhận xu
6. Quà thưởng: bé xem quà, nhưng đổi quà cần phụ huynh duyệt
7. Chế độ lớp học: chặn xao nhãng, SOS vẫn hoạt động


## Cách deploy GitHub Pages

1. Tạo repo mới, ví dụ: `safekid-parent-app-prototype`
2. Upload các file: `index.html`, `styles.css`, `app.js`, `watch.html`, `watch.css`, `watch.js`, `README.md`
3. Vào Settings → Pages
4. Source: Deploy from a branch
5. Branch: `main`, folder: `/root`
6. Lấy link GitHub Pages đưa vào QR code để test với phụ huynh

## User testing task gợi ý

1. Tìm vị trí hiện tại của con
2. Thiết lập / chỉnh Safe Zone
3. Xem tình huống SOS
4. Tạo hoặc hoàn thành một nhiệm vụ/habit
5. Đổi xu nhận quà
6. So sánh Free vs Premium
7. Hỏi S.F AI và thử Human Handoff

## Lưu ý khi đưa vào report

- Đây là prototype tương tác, dữ liệu giả lập để kiểm tra hành vi và cảm nhận người dùng.
- Không claim đây là sản phẩm thương mại hoàn chỉnh.
- Với tình huống khẩn cấp, S.F AI chỉ hỗ trợ hướng dẫn; xử lý chính phải qua phụ huynh/người thật/tổng đài.
