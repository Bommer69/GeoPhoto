# 📸 Chức năng Thư viện ảnh (Photo Library) - GeoPhoto

## 📋 Tổng quan

Chức năng **Thư viện ảnh** cho phép người dùng xem và quản lý tất cả ảnh đã upload. Đây là nơi tập trung hiển thị toàn bộ ảnh của user, với khả năng lọc, xem chi tiết, và điều hướng nhanh đến vị trí GPS trên bản đồ.

---

## ✨ Các tính năng chính

### 🖼️ Hiển thị ảnh
- ✅ Hiển thị tất cả ảnh đã upload dạng lưới (Grid)
- ✅ Chế độ xem danh sách (List) với thông tin chi tiết
- ✅ Preview ảnh không có GPS trong modal
- ✅ Hiển thị số lượng ảnh và thống kê GPS

### 🔍 Lọc và tìm kiếm
- ✅ Lọc: Tất cả ảnh
- ✅ Lọc: Chỉ ảnh có GPS (📍)
- ✅ Lọc: Chỉ ảnh chưa có GPS (⚠️)

### 🗺️ Tích hợp bản đồ
- ✅ Click ảnh có GPS → Bay đến vị trí trên bản đồ
- ✅ Highlight marker của ảnh được chọn
- ✅ Hiệu ứng fly animation mượt mà

### 📁 Tích hợp Album
- ✅ Nút "Thêm vào Album" trên mỗi ảnh
- ✅ Mở modal chọn album nhanh

### 🗑️ Quản lý ảnh
- ✅ Xóa ảnh (với xác nhận)
- ✅ Cập nhật realtime sau khi xóa

---

## 🏗️ Kiến trúc hệ thống

### Backend (Spring Boot)

```
backend/src/main/java/com/geophoto/
├── entity/
│   └── Photo.java              # Entity MongoDB
├── dto/
│   └── PhotoDTO.java           # Data Transfer Object
├── repository/
│   └── PhotoRepository.java    # Truy vấn MongoDB
├── service/
│   └── PhotoService.java       # Logic nghiệp vụ
└── controller/
    └── PhotoController.java    # REST API endpoints
```

### Frontend (React)

```
frontend/src/
├── services/
│   └── photoService.js         # API client
└── components/
    └── library/
        └── PhotoLibrary.jsx    # Component thư viện ảnh
    └── map/
        └── PhotoMap.jsx        # Xử lý navigation từ Library
```

---

## 🔌 API Endpoints sử dụng

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/photos` | Lấy tất cả ảnh của user |
| `GET` | `/api/photos/with-gps` | Lấy ảnh có GPS |
| `GET` | `/api/photos/{id}` | Lấy chi tiết ảnh |
| `DELETE` | `/api/photos/{id}` | Xóa ảnh |

### Ví dụ Response

#### GET /api/photos
```json
[
  {
    "id": "65abc123...",
    "fileName": "beach_sunset.jpg",
    "url": "/uploads/abc123.jpg",
    "latitude": 16.0544,
    "longitude": 108.2022,
    "uploadedAt": "2024-01-15T10:30:00",
    "dateTaken": "2024-01-10T18:45:00"
  },
  {
    "id": "65abc456...",
    "fileName": "no_gps_photo.png",
    "url": "/uploads/def456.png",
    "latitude": null,
    "longitude": null,
    "uploadedAt": "2024-01-16T09:00:00",
    "dateTaken": null
  }
]
```

---

## 🖥️ Giao diện người dùng

### Layout chính

```
┌─────────────────────────────────────────────────────────────┐
│  ← Bản đồ    📸 Thư viện ảnh (25 ảnh)     [Grid][List] 🚪   │
├─────────────────────────────────────────────────────────────┤
│  [Tất cả: 25]  [📍 Có GPS: 20]  [⚠️ Chưa GPS: 5]   [Albums] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐    │
│   │ 📍  │  │ 📍  │  │ ⚠️  │  │ 📍  │  │ 📍  │  │ ⚠️  │    │
│   │     │  │     │  │     │  │     │  │     │  │     │    │
│   │ 🖼️ │  │ 🖼️  │  │ 🖼️  │  │ 🖼️  │  │ 🖼️  │  │ 🖼️  │    │
│   └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘    │
│                                                             │
│   ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐    │
│   │ 📍  │  │ 📍  │  │ 📍  │  │ 📍  │  │ ⚠️  │  │ 📍  │    │
│   │     │  │     │  │     │  │     │  │     │  │     │    │
│   └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Các thành phần UI

#### 1. Header
- Nút quay lại Bản đồ
- Tiêu đề + số lượng ảnh
- Toggle Grid/List view
- Nút đăng xuất

#### 2. Filter Bar
- Tab "Tất cả" với số lượng
- Tab "Có GPS" với số lượng
- Tab "Chưa GPS" với số lượng
- Nút đến trang Albums

#### 3. Photo Grid
- Ảnh hiển thị dạng lưới responsive
- Badge GPS góc trên phải
- Hover hiển thị actions (Xóa, Thêm album)
- Click để xem trên bản đồ

#### 4. Photo Card (trong Grid)
```
┌────────────────────┐
│ 📍              🗑️ │  ← Badge GPS + Delete button
│                    │
│      🖼️ Ảnh       │
│                    │
│────────────────────│
│ beach_sunset.jpg   │  ← Tên file
│ 15/01/2024         │  ← Ngày chụp
└────────────────────┘
```

---

## 🔄 Luồng hoạt động

### 1. Xem thư viện
```
User vào /library
    ↓
Gọi API GET /api/photos
    ↓
Render danh sách ảnh dạng grid
    ↓
Hiển thị thống kê (tổng, có GPS, không GPS)
```

### 2. Click ảnh có GPS
```
User click ảnh có GPS
    ↓
navigate('/?lat=16.05&lng=108.20&photoId=abc123')
    ↓
PhotoMap nhận query params
    ↓
map.flyTo([lat, lng], 15)
    ↓
Highlight marker của ảnh
```

### 3. Click ảnh không GPS
```
User click ảnh không GPS
    ↓
Mở modal preview
    ↓
Hiển thị thông báo "Ảnh chưa có vị trí GPS"
    ↓
Option: Đóng hoặc Thêm vị trí
```

---

## 📊 States trong Component

```javascript
// PhotoLibrary.jsx

// Danh sách ảnh từ API
const [photos, setPhotos] = useState([])

// Trạng thái loading
const [loading, setLoading] = useState(true)

// Thông báo lỗi
const [error, setError] = useState(null)

// Ảnh đang xem preview (không GPS)
const [selectedPhoto, setSelectedPhoto] = useState(null)

// Ảnh đang chờ xác nhận xóa
const [deleteConfirm, setDeleteConfirm] = useState(null)

// Ảnh đang thêm vào album (mở modal)
const [addToAlbumPhoto, setAddToAlbumPhoto] = useState(null)

// Chế độ hiển thị: 'grid' | 'list'
const [viewMode, setViewMode] = useState('grid')

// Bộ lọc: 'all' | 'with-gps' | 'without-gps'
const [filter, setFilter] = useState('all')
```

---

## 🚀 Hướng dẫn sử dụng

### Truy cập Thư viện

**Cách 1:** Click nút "📸 Thư viện ảnh" trên trang bản đồ

**Cách 2:** Truy cập trực tiếp URL `/library`

### Lọc ảnh

1. Click tab **"Tất cả"** để xem toàn bộ
2. Click tab **"📍 Có GPS"** để xem ảnh có vị trí
3. Click tab **"⚠️ Chưa GPS"** để xem ảnh cần cập nhật vị trí

### Xem vị trí trên bản đồ

1. Tìm ảnh có badge **📍** (màu xanh)
2. Click vào ảnh
3. Tự động chuyển đến bản đồ và focus vào vị trí
4. Popup thông tin ảnh hiển thị

### Thêm ảnh vào Album

1. Hover vào ảnh
2. Click icon **📁** (góc dưới)
3. Chọn album có sẵn hoặc tạo album mới
4. Thông báo thành công

### Xóa ảnh

1. Hover vào ảnh
2. Click icon **🗑️** (màu đỏ)
3. Xác nhận xóa trong modal
4. Ảnh được xóa khỏi thư viện và database

---

## 🎨 Thiết kế UI/UX

### Màu sắc

| Element | Màu | Mô tả |
|---------|-----|-------|
| Background | `slate-900` → `blue-900` | Gradient tối |
| Card | `white/5` | Trong suốt nhẹ |
| Badge GPS có | `green-500` | Xanh lá |
| Badge GPS không | `orange-500` | Cam cảnh báo |
| Active filter | `blue-500` | Xanh dương |

### Responsive

| Breakpoint | Cột hiển thị |
|------------|--------------|
| Mobile (<640px) | 2 cột |
| Tablet (640-768px) | 3 cột |
| Desktop (768-1024px) | 4 cột |
| Large (1024-1280px) | 5 cột |
| XL (>1280px) | 6 cột |

### Animations

- **Hover card**: Scale 1.05 + shadow
- **Filter change**: Fade transition
- **Delete**: Slide out
- **Map fly**: 1.5s duration với easing

---

## 📁 Danh sách files liên quan

### Frontend

| File | Đường dẫn | Mô tả |
|------|-----------|-------|
| `PhotoLibrary.jsx` | `components/library/` | Component chính |
| `photoService.js` | `services/` | API calls |
| `PhotoMap.jsx` | `components/map/` | Nhận navigation từ Library |
| `App.jsx` | `src/` | Định nghĩa route `/library` |

### Backend (sử dụng chung)

| File | Mô tả |
|------|-------|
| `PhotoController.java` | API endpoints |
| `PhotoService.java` | Business logic |
| `PhotoRepository.java` | Database queries |

---

## 🔐 Bảo mật

- ✅ JWT Authentication bắt buộc
- ✅ User chỉ thấy ảnh của mình
- ✅ Xác nhận trước khi xóa
- ✅ Validate photoId trước khi thao tác

---

## 🐛 Xử lý lỗi

| Lỗi | Xử lý |
|-----|-------|
| Không tải được ảnh | Hiển thị placeholder + thông báo |
| API timeout | Hiển thị nút "Thử lại" |
| Xóa thất bại | Alert thông báo |
| Ảnh không GPS | Mở preview thay vì navigate |

---

## 🔄 Tích hợp với các module khác

### → PhotoMap (Bản đồ)
```
PhotoLibrary ---(click ảnh có GPS)---> PhotoMap
             ---(query params: lat, lng, photoId)--->
```

### → Album
```
PhotoLibrary ---(click "Thêm vào Album")---> AddToAlbum Modal
             ---(sau khi thêm)---> Reload hoặc toast thông báo
```

### ← PhotoUpload
```
PhotoUpload ---(upload xong)---> Reload PhotoLibrary
```

---

## 📝 Code Snippets quan trọng

### Navigation đến bản đồ
```javascript
const handlePhotoClick = (photo) => {
  if (photo.latitude && photo.longitude) {
    // Chuyển đến bản đồ với params
    navigate(`/?lat=${photo.latitude}&lng=${photo.longitude}&photoId=${photo.id}`)
  } else {
    // Mở preview cho ảnh không GPS
    setSelectedPhoto(photo)
  }
}
```

### Lọc ảnh
```javascript
const filteredPhotos = photos.filter(photo => {
  if (filter === 'with-gps') return photo.latitude && photo.longitude
  if (filter === 'without-gps') return !photo.latitude || !photo.longitude
  return true // 'all'
})
```

### Xử lý trong PhotoMap
```javascript
// Đọc query params từ URL
const [searchParams] = useSearchParams()
const lat = searchParams.get('lat')
const lng = searchParams.get('lng')
const photoId = searchParams.get('photoId')

// Fly đến vị trí
useEffect(() => {
  if (lat && lng) {
    map.flyTo([parseFloat(lat), parseFloat(lng)], 15, {
      duration: 1.5
    })
  }
}, [lat, lng])
```

---

## 📅 Changelog

### v1.0.0 (Tháng 1/2024)
- ✨ Tạo component PhotoLibrary
- ✨ Hiển thị ảnh dạng grid/list
- ✨ Bộ lọc GPS
- ✨ Navigation đến bản đồ
- ✨ Tích hợp Album
- ✨ Xóa ảnh
- 📝 Thêm comments tiếng Việt

---

## 👨‍💻 Tác giả

**GeoPhoto Team**

---

*Tài liệu này được tạo cho chức năng Thư viện ảnh của dự án GeoPhoto.*
