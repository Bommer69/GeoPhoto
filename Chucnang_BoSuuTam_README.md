# 📁 Chức năng Album/Bộ sưu tập - GeoPhoto

## 📋 Tổng quan

Chức năng **Album** cho phép người dùng tổ chức và quản lý ảnh theo các bộ sưu tập. Người dùng có thể tạo nhiều album, thêm ảnh vào album, và dễ dàng truy cập vị trí GPS của ảnh từ album.

---

## ✨ Các tính năng chính

### 🗂️ Quản lý Album
- ✅ Tạo album mới với tên và mô tả
- ✅ Chỉnh sửa thông tin album (tên, mô tả)
- ✅ Xóa album (ảnh trong album không bị xóa)
- ✅ Đặt ảnh bìa cho album

### 🖼️ Quản lý ảnh trong Album
- ✅ Thêm một ảnh vào album
- ✅ Thêm nhiều ảnh vào album cùng lúc
- ✅ Xóa ảnh khỏi album (chỉ xóa liên kết, không xóa ảnh gốc)
- ✅ Xem danh sách ảnh trong album

### 🗺️ Tích hợp bản đồ
- ✅ Click vào ảnh có GPS → Chuyển đến bản đồ và focus vào vị trí
- ✅ Hiển thị badge GPS (📍 có GPS / ⚠️ không có GPS)

---

## 🏗️ Kiến trúc hệ thống

### Backend (Spring Boot)

```
backend/src/main/java/com/geophoto/
├── entity/
│   └── Album.java              # Entity MongoDB
├── dto/
│   └── AlbumDTO.java           # Data Transfer Object
├── repository/
│   └── AlbumRepository.java    # Truy vấn MongoDB
├── service/
│   └── AlbumService.java       # Logic nghiệp vụ
└── controller/
    └── AlbumController.java    # REST API endpoints
```

### Frontend (React)

```
frontend/src/
├── services/
│   └── albumService.js         # API client
└── components/
    └── album/
        ├── AlbumList.jsx       # Danh sách albums
        ├── AlbumDetail.jsx     # Chi tiết album
        └── AddToAlbum.jsx      # Modal thêm ảnh vào album
```

---

## 🔌 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/albums` | Lấy tất cả albums của user |
| `GET` | `/api/albums/{id}` | Lấy chi tiết album (bao gồm ảnh) |
| `POST` | `/api/albums` | Tạo album mới |
| `PUT` | `/api/albums/{id}` | Cập nhật album |
| `DELETE` | `/api/albums/{id}` | Xóa album |
| `POST` | `/api/albums/{id}/photos/{photoId}` | Thêm 1 ảnh vào album |
| `DELETE` | `/api/albums/{id}/photos/{photoId}` | Xóa 1 ảnh khỏi album |
| `POST` | `/api/albums/{id}/photos` | Thêm nhiều ảnh vào album |
| `GET` | `/api/albums/photo/{photoId}` | Tìm albums chứa ảnh |

### Ví dụ Request/Response

#### Tạo Album mới
```http
POST /api/albums
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "name": "Du lịch Đà Nẵng 2024",
  "description": "Chuyến du lịch mùa hè"
}
```

**Response:**
```json
{
  "id": "65abc123...",
  "name": "Du lịch Đà Nẵng 2024",
  "description": "Chuyến du lịch mùa hè",
  "photoCount": 0,
  "createdAt": "2024-01-15T10:30:00"
}
```

#### Thêm ảnh vào Album
```http
POST /api/albums/{albumId}/photos/{photoId}
Authorization: Bearer <JWT_TOKEN>
```

---

## 📊 Database Schema

### Collection: `albums`

```javascript
{
  "_id": ObjectId("..."),
  "name": "Du lịch Đà Nẵng",
  "description": "Mô tả album",
  "coverPhotoId": "photo_id_123",
  "photoIds": [
    "photo_id_1",
    "photo_id_2",
    "photo_id_3"
  ],
  "userId": "user_id_abc",
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z")
}
```

**Indexes:**
- `userId` - Tìm kiếm nhanh theo user
- `photoIds` - Tìm albums chứa ảnh cụ thể

---

## 🖥️ Giao diện người dùng

### 1. Trang danh sách Albums (`/albums`)

![Albums List](https://via.placeholder.com/800x400?text=Albums+List)

- Header với nút "Tạo Album"
- Grid hiển thị các album cards
- Mỗi card hiển thị: ảnh bìa, tên, số ảnh, ngày tạo
- Hover để xóa album

### 2. Trang chi tiết Album (`/albums/:id`)

![Album Detail](https://via.placeholder.com/800x400?text=Album+Detail)

- Header với tên album (có thể edit inline)
- Grid ảnh trong album
- Badge GPS trên mỗi ảnh
- Actions: Đặt ảnh bìa, Xóa khỏi album

### 3. Modal thêm vào Album

![Add to Album](https://via.placeholder.com/400x300?text=Add+to+Album+Modal)

- Danh sách album có sẵn
- Nút tạo album mới và thêm ngay
- 1-click để thêm ảnh

---

## 🚀 Hướng dẫn sử dụng

### Tạo Album mới

1. Vào trang **Bộ sưu tập** (`/albums`)
2. Click nút **"Tạo Album"**
3. Nhập tên và mô tả (tùy chọn)
4. Click **"Tạo Album"**

### Thêm ảnh vào Album

**Cách 1: Từ Thư viện ảnh**
1. Vào **Thư viện ảnh** (`/library`)
2. Hover vào ảnh, click icon **📁 (Thêm vào album)**
3. Chọn album hoặc tạo album mới

**Cách 2: Từ chi tiết ảnh**
1. Click vào ảnh để xem chi tiết
2. Click nút **"Thêm vào Album"**
3. Chọn album

### Xem vị trí ảnh trên bản đồ

1. Vào album muốn xem
2. Click vào ảnh có badge **📍** (có GPS)
3. Tự động chuyển đến bản đồ và focus vào vị trí

---

## 🔧 Cấu hình

### Backend (`application.properties`)

```properties
# Không cần cấu hình thêm cho Album
# Sử dụng chung MongoDB với các collection khác
spring.data.mongodb.uri=mongodb://localhost:27017/geophoto
```

### Frontend

```javascript
// albumService.js
const API_BASE_URL = 'http://localhost:8080/api'
```

---

## 📁 Danh sách files

### Backend (7 files)

| File | Mô tả |
|------|-------|
| `Album.java` | Entity MongoDB - Document album |
| `AlbumDTO.java` | DTO cho response API |
| `AlbumRepository.java` | Repository query MongoDB |
| `AlbumService.java` | Business logic |
| `AlbumController.java` | REST API controller |

### Frontend (4 files)

| File | Mô tả |
|------|-------|
| `albumService.js` | API client cho Album |
| `AlbumList.jsx` | Component danh sách albums |
| `AlbumDetail.jsx` | Component chi tiết album |
| `AddToAlbum.jsx` | Modal thêm ảnh vào album |

---

## 🔐 Bảo mật

- ✅ Tất cả API yêu cầu JWT Authentication
- ✅ User chỉ thấy albums của mình
- ✅ Kiểm tra quyền sở hữu trước khi sửa/xóa
- ✅ Validate input trên cả frontend và backend

---

## 🐛 Xử lý lỗi

| Lỗi | Mô tả | Xử lý |
|-----|-------|-------|
| 401 | Chưa đăng nhập | Chuyển về trang login |
| 403 | Không có quyền | Hiển thị thông báo |
| 404 | Album không tồn tại | Hiển thị trang lỗi |
| 409 | Tên album trùng | Thông báo yêu cầu đổi tên |

---

## 📝 Ghi chú phát triển

### Quy ước đặt tên

- **Backend**: PascalCase cho class, camelCase cho method/variable
- **Frontend**: PascalCase cho component, camelCase cho hàm/biến
- **API**: kebab-case cho URL endpoints

### Comments

Tất cả files đã được thêm comments tiếng Việt chi tiết để dễ bảo trì.

---

## 🔄 Tích hợp với các chức năng khác

### Photo Library
- Nút "Thêm vào Album" trên mỗi ảnh
- Hiển thị album đã thuộc

### Photo Map
- Nút điều hướng đến Albums
- Click ảnh từ Album → Focus trên bản đồ

---

## 📅 Changelog

### v1.0.0 (Tháng 1/2024)
- ✨ Thêm chức năng tạo/sửa/xóa album
- ✨ Thêm/xóa ảnh khỏi album
- ✨ Đặt ảnh bìa album
- ✨ Tích hợp navigation đến bản đồ
- 📝 Thêm comments tiếng Việt

---

## 👨‍💻 Tác giả

**GeoPhoto Team**

---

*Tài liệu này được tạo tự động cho chức năng Album của dự án GeoPhoto.*
