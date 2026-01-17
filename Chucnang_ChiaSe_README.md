# 🔗 Chức năng Chia sẻ (Share Link) - GeoPhoto

## 📋 Tổng quan

Chức năng **Chia sẻ** cho phép người dùng tạo link chia sẻ cho ảnh hoặc album. Người nhận link có thể xem nội dung mà không cần đăng nhập vào hệ thống.

---

## ✨ Các tính năng chính

### 🔗 Tạo Link chia sẻ
- ✅ Chia sẻ một ảnh (Photo)
- ✅ Chia sẻ một album (Album với nhiều ảnh)
- ✅ Tùy chỉnh tiêu đề và mô tả
- ✅ Đặt mật khẩu bảo vệ (tùy chọn)
- ✅ Đặt thời hạn hết hạn (1h, 24h, 7d, 30d, hoặc vĩnh viễn)

### 📊 Quản lý Link
- ✅ Xem danh sách link đã tạo
- ✅ Copy link nhanh vào clipboard
- ✅ Xem số lượt xem
- ✅ Xóa/hủy link chia sẻ

### 👁️ Xem nội dung chia sẻ (Public)
- ✅ Trang public không cần đăng nhập
- ✅ Nhập mật khẩu (nếu có bảo vệ)
- ✅ Xem ảnh full screen
- ✅ Xem gallery album
- ✅ Hiển thị thông tin GPS

---

## 🏗️ Kiến trúc hệ thống

### Backend (Spring Boot)

```
backend/src/main/java/com/geophoto/
├── entity/
│   └── ShareLink.java           # Entity MongoDB
├── dto/
│   └── ShareLinkDTO.java        # Data Transfer Object
├── repository/
│   └── ShareLinkRepository.java # Truy vấn MongoDB
├── service/
│   └── ShareLinkService.java    # Logic nghiệp vụ
├── controller/
│   └── ShareLinkController.java # REST API endpoints
└── config/
    └── SecurityConfig.java      # Cấu hình public endpoints
```

### Frontend (React)

```
frontend/src/
├── services/
│   └── shareService.js          # API client
└── components/
    └── share/
        ├── ShareModal.jsx       # Modal tạo/quản lý link
        └── SharedView.jsx       # Trang public xem chia sẻ
```

---

## 🔌 API Endpoints

### Private APIs (yêu cầu JWT)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/api/shares/photo` | Tạo link chia sẻ ảnh |
| `POST` | `/api/shares/album` | Tạo link chia sẻ album |
| `GET` | `/api/shares` | Lấy tất cả links của user |
| `GET` | `/api/shares/{id}` | Lấy chi tiết link (owner) |
| `PUT` | `/api/shares/{id}/deactivate` | Hủy kích hoạt link |
| `DELETE` | `/api/shares/{id}` | Xóa link |
| `GET` | `/api/shares/target/{type}/{id}` | Lấy links cho Photo/Album |

### Public APIs (không cần đăng nhập)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/public/share/{code}` | Lấy thông tin link |
| `POST` | `/api/public/share/{code}/view` | Xem nội dung (có thể cần MK) |

---

## 📊 Database Schema

### Collection: `share_links`

```javascript
{
  "_id": ObjectId("..."),
  "shareCode": "abc123xy",           // Mã duy nhất trong URL
  "type": "PHOTO",                   // PHOTO hoặc ALBUM
  "targetId": "photo_id_123",        // ID của Photo/Album
  "userId": "user_id_abc",           // User tạo link
  "title": "Ảnh đẹp",
  "description": "Mô tả ngắn",
  "password": "$2a$10$...",          // Đã hash (null nếu không có)
  "passwordProtected": true,
  "expiresAt": ISODate("2024-02-15T10:30:00Z"), // null = không hết hạn
  "active": true,
  "viewCount": 42,
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z")
}
```

**Indexes:**
- `shareCode` (unique) - Tìm nhanh theo mã
- `userId` - Tìm theo user

---

## 🖥️ Giao diện người dùng

### 1. Nút Share trên ảnh/album

```
Grid View:
┌────────────────────┐
│ 🟢📁🔴          📍 │  ← 🟢 = Share, 📁 = Album, 🔴 = Delete
│                    │
│      🖼️ Ảnh       │
│                    │
└────────────────────┘

Album Header:
┌──────────────────────────────────────────────────┐
│ ← Albums    📷 12 ảnh  15/01/2024  [🔗 Chia sẻ] │
└──────────────────────────────────────────────────┘
```

### 2. Share Modal

```
┌────────────────────────────────────────────┐
│  🟢 Chia sẻ ảnh                        ✕  │
│  beach_sunset.jpg                          │
├────────────────────────────────────────────┤
│  [Tạo link mới]  [Quản lý (2)]            │
├────────────────────────────────────────────┤
│                                            │
│  Tiêu đề (tùy chọn)                       │
│  ┌────────────────────────────────────┐   │
│  │ Mặc định: beach_sunset.jpg         │   │
│  └────────────────────────────────────┘   │
│                                            │
│  Mô tả (tùy chọn)                         │
│  ┌────────────────────────────────────┐   │
│  │ Mô tả ngắn cho người xem...        │   │
│  └────────────────────────────────────┘   │
│                                            │
│  ☐ Bảo vệ bằng mật khẩu                   │
│                                            │
│  Thời hạn:                                 │
│  [Vĩnh viễn] [1 giờ] [24h] [7 ngày] [30d] │
│                                            │
│  ┌────────────────────────────────────┐   │
│  │       🔗 Tạo link chia sẻ          │   │
│  └────────────────────────────────────┘   │
└────────────────────────────────────────────┘
```

### 3. Trang Public View (`/share/{code}`)

```
┌──────────────────────────────────────────────────┐
│  🟢 Ảnh đẹp                      👁 42 lượt xem │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │                                          │   │
│  │              🖼️ Ảnh Full                │   │
│  │                                          │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  beach_sunset.jpg                                │
│  📅 15/01/2024   📍 16.0544, 108.2022           │
│                                                  │
├──────────────────────────────────────────────────┤
│              Chia sẻ bởi GeoPhoto               │
└──────────────────────────────────────────────────┘
```

---

## 🔄 Luồng hoạt động

### 1. Tạo link chia sẻ

```
User click nút Share
    ↓
Mở ShareModal
    ↓
Điền thông tin (tùy chọn)
    ↓
Click "Tạo link chia sẻ"
    ↓
POST /api/shares/photo hoặc /album
    ↓
Backend tạo shareCode unique
    ↓
Trả về ShareLinkDTO với shareUrl
    ↓
Hiển thị URL để copy
```

### 2. Xem nội dung chia sẻ

```
Người nhận click link: /share/abc123xy
    ↓
GET /api/public/share/abc123xy
    ↓
Kiểm tra: link còn active? hết hạn?
    ↓
Có mật khẩu? → Hiển thị form nhập MK
    ↓
POST /api/public/share/abc123xy/view
    ↓
Xác thực mật khẩu (nếu có)
    ↓
Tăng viewCount
    ↓
Trả về nội dung (photo/album + photos)
    ↓
Render SharedView
```

---

## 🔐 Bảo mật

### Xác thực
- ✅ Tạo/quản lý link yêu cầu JWT token
- ✅ Xem public không cần token
- ✅ User chỉ có thể tạo link cho ảnh/album của mình

### Mật khẩu
- ✅ Hash bằng BCrypt trước khi lưu
- ✅ Không bao giờ trả về password trong response
- ✅ Giới hạn số lần thử (có thể thêm)

### Hết hạn
- ✅ Kiểm tra thời gian mỗi lần truy cập
- ✅ Link hết hạn không thể truy cập

---

## 📁 Danh sách files

### Backend (5 files)

| File | Mô tả |
|------|-------|
| `ShareLink.java` | Entity MongoDB |
| `ShareLinkDTO.java` | DTO cho response |
| `ShareLinkRepository.java` | Repository queries |
| `ShareLinkService.java` | Business logic |
| `ShareLinkController.java` | REST API endpoints |

### Frontend (3 files)

| File | Mô tả |
|------|-------|
| `shareService.js` | API client |
| `ShareModal.jsx` | Modal tạo/quản lý link |
| `SharedView.jsx` | Trang public xem chia sẻ |

### Files đã cập nhật

| File | Thay đổi |
|------|----------|
| `SecurityConfig.java` | Thêm `/api/public/**` vào permitAll, mở rộng CORS cho IP LAN |
| `JwtAuthenticationFilter.java` | Thêm `/api/public/**` vào `shouldNotFilter()` |
| `App.jsx` | Thêm route `/share/:shareCode` |
| `PhotoLibrary.jsx` | Thêm nút Share, URL động |
| `AlbumDetail.jsx` | Thêm nút Share album, URL động |
| `vite.config.js` | Thêm `host: '0.0.0.0'` cho LAN |

### Files service đã cập nhật (URL động)

| File | Thay đổi |
|------|----------|
| `authService.js` | Dùng `window.location.hostname` |
| `photoService.js` | Dùng `window.location.hostname` |
| `albumService.js` | Dùng `window.location.hostname` |
| `shareService.js` | Dùng `window.location.hostname` |

### Tất cả components dùng URL ảnh động

| Component | Đã cập nhật |
|-----------|-------------|
| `PhotoMap.jsx` | ✅ |
| `PhotoLibrary.jsx` | ✅ |
| `PhotoDetails.jsx` | ✅ |
| `PhotoLocationEditor.jsx` | ✅ |
| `PhotosWithoutGPS.jsx` | ✅ |
| `AlbumList.jsx` | ✅ |
| `AlbumDetail.jsx` | ✅ |
| `AddToAlbum.jsx` | ✅ |
| `SharedView.jsx` | ✅ |

---

## 🚀 Hướng dẫn sử dụng

### 🏃 Khởi động nhanh (cho chia sẻ qua LAN)

```powershell
# Terminal 1: Chạy Backend
cd D:\_StudyCode\Thay_Binh\GeoPhoto\backend
mvn spring-boot:run

# Terminal 2: Chạy Frontend
cd D:\_StudyCode\Thay_Binh\GeoPhoto\frontend
npm run dev
```

**Truy cập ứng dụng:**
- Máy local: `http://localhost:5173`
- Máy khác trong LAN: `http://<IP-của-bạn>:5173` (ví dụ: `http://192.168.1.18:5173`)

### Chia sẻ ảnh

1. Vào **Thư viện ảnh** (`/library`)
2. Hover vào ảnh muốn chia sẻ
3. Click nút **🟢 (Share)** góc trên trái
4. (Tùy chọn) Đặt tiêu đề, mật khẩu, thời hạn
5. Click **"Tạo link chia sẻ"**
6. Copy URL và gửi cho bạn bè

### Chia sẻ album

1. Vào **Chi tiết album** (`/albums/:id`)
2. Click nút **"🔗 Chia sẻ"** ở header
3. (Tùy chọn) Đặt tiêu đề, mật khẩu, thời hạn
4. Click **"Tạo link chia sẻ"**
5. Copy URL và gửi

### Quản lý links

1. Mở ShareModal
2. Click tab **"Quản lý"**
3. Xem danh sách link đã tạo
4. Click **📋** để copy, **🗑️** để xóa

---

## ⚙️ Cấu hình

### application.properties

```properties
# URL frontend (để tạo share URL đầy đủ)
# Thay đổi thành IP thực nếu muốn chia sẻ qua mạng LAN
app.frontend.url=${APP_FRONTEND_URL:http://192.168.1.18:5173}
```

### Frontend

```javascript
// shareService.js - Tự động dùng hostname hiện tại
const getBackendUrl = () => {
  const hostname = window.location.hostname
  return `http://${hostname}:8080/api`
}
```

### vite.config.js

```javascript
// Cho phép truy cập từ IP trong mạng LAN
server: {
  port: 5173,
  host: '0.0.0.0', // Quan trọng: cho phép truy cập từ IP
}
```

---

## ⚠️ Lưu ý quan trọng khi chia sẻ

### 🌐 Chia sẻ trong mạng LAN

Để bạn bè **trong cùng mạng WiFi/LAN** có thể xem link chia sẻ:

1. **Thay `localhost` bằng IP thực** của máy bạn:
   ```
   Từ: http://localhost:5173/share/abc123
   Thành: http://192.168.1.18:5173/share/abc123
   ```

2. **Kiểm tra IP của máy:**
   ```powershell
   ipconfig | Select-String "IPv4"
   ```

3. **Đảm bảo Firewall cho phép** port `5173` (Frontend) và `8080` (Backend)

### 🔥 Cấu hình Windows Firewall

```powershell
# Cho phép port 5173 (Frontend)
New-NetFirewallRule -DisplayName "GeoPhoto Frontend" -Direction Inbound -Port 5173 -Protocol TCP -Action Allow

# Cho phép port 8080 (Backend)
New-NetFirewallRule -DisplayName "GeoPhoto Backend" -Direction Inbound -Port 8080 -Protocol TCP -Action Allow
```

### 🌍 Chia sẻ qua Internet

Để chia sẻ cho người **không cùng mạng LAN**, bạn cần:

| Phương pháp | Mô tả |
|-------------|-------|
| **ngrok** | Dịch vụ tunnel miễn phí, tạo URL public tạm thời |
| **Port Forwarding** | Cấu hình router để chuyển tiếp port |
| **Cloud Hosting** | Deploy lên server cloud (AWS, DigitalOcean, ...) |

**Ví dụ dùng ngrok:**
```bash
# Tunnel cho Frontend
ngrok http 5173

# Tunnel cho Backend (terminal khác)
ngrok http 8080
```

### ❌ Các lỗi thường gặp

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| Trang trắng | Frontend dùng `localhost` | Đảm bảo đã cập nhật code dùng `window.location.hostname` |
| Ảnh không hiển thị | Backend URL hardcode | Kiểm tra tất cả components dùng URL động |
| CORS error | Backend chặn IP | Kiểm tra `SecurityConfig.java` có cho phép IP pattern |
| Connection refused | Firewall chặn | Mở port 5173 và 8080 trong Firewall |
| 401 Unauthorized | JWT filter chặn public API | Kiểm tra `JwtAuthenticationFilter.shouldNotFilter()` |

---

## 📝 Ví dụ Request/Response

### Tạo link chia sẻ ảnh

**Request:**
```http
POST /api/shares/photo
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "targetId": "65abc123...",
  "title": "Ảnh hoàng hôn đẹp",
  "description": "Chụp ở Đà Nẵng",
  "password": "secret123",
  "expiresInHours": 168
}
```

**Response:**
```json
{
  "id": "65xyz789...",
  "shareCode": "abc123xy",
  "shareUrl": "http://localhost:5173/share/abc123xy",
  "type": "PHOTO",
  "targetId": "65abc123...",
  "title": "Ảnh hoàng hôn đẹp",
  "description": "Chụp ở Đà Nẵng",
  "passwordProtected": true,
  "expiresAt": "2024-01-22T10:30:00",
  "active": true,
  "expired": false,
  "viewCount": 0,
  "createdAt": "2024-01-15T10:30:00"
}
```

### Xem nội dung (có mật khẩu)

**Request:**
```http
POST /api/public/share/abc123xy/view
Content-Type: application/json

{
  "password": "secret123"
}
```

**Response:**
```json
{
  "id": "65xyz789...",
  "shareCode": "abc123xy",
  "type": "PHOTO",
  "title": "Ảnh hoàng hôn đẹp",
  "viewCount": 43,
  "photo": {
    "id": "65abc123...",
    "fileName": "sunset.jpg",
    "url": "/uploads/abc123.jpg",
    "latitude": 16.0544,
    "longitude": 108.2022,
    "dateTaken": "2024-01-10T18:45:00"
  }
}
```

---

## 📅 Changelog

### v1.1.0 (Tháng 1/2024) - Hỗ trợ chia sẻ qua mạng LAN
- 🌐 Hỗ trợ chia sẻ cho người trong cùng mạng LAN
- 🔧 Sửa tất cả components dùng URL động (`window.location.hostname`)
- 🔧 Cập nhật `vite.config.js` với `host: '0.0.0.0'`
- 🔧 Mở rộng CORS cho phép IP `192.168.*.*` và `10.*.*.*`
- 🐛 Sửa lỗi `JwtAuthenticationFilter` chặn public API
- 📝 Thêm hướng dẫn chia sẻ qua mạng LAN trong README

### v1.0.0 (Tháng 1/2024) - Phiên bản đầu tiên
- ✨ Tạo chức năng chia sẻ hoàn chỉnh
- ✨ Hỗ trợ chia sẻ Photo và Album
- ✨ Mật khẩu bảo vệ
- ✨ Thời hạn hết hạn
- ✨ Trang public view
- ✨ Đếm lượt xem
- 📝 Thêm comments tiếng Việt

---

## 👨‍💻 Tác giả

**GeoPhoto Team**

---

*Tài liệu này được tạo cho chức năng Chia sẻ của dự án GeoPhoto.*
