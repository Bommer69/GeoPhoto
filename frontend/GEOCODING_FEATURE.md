# 🗺️ Geocoding Feature - Tìm Kiếm Địa Chỉ Cho Ảnh

## ✨ Tổng Quan

Tính năng Geocoding cho phép người dùng thêm vị trí GPS cho những ảnh không có thông tin GPS trong EXIF metadata.

## 🎯 Use Case

Khi upload ảnh mà không có GPS (ảnh từ máy ảnh chuyên nghiệp, ảnh scan, hoặc ảnh tải từ mạng), người dùng có thể:
1. Tìm kiếm địa chỉ bằng text
2. Click trực tiếp trên bản đồ
3. Kéo marker để điều chỉnh vị trí chính xác
4. Lưu vị trí vào database

## 📦 Components Được Tạo

### 1. **LocationSearch.jsx**
Component tìm kiếm địa chỉ sử dụng Nominatim API.

**Features:**
- Input field với debouncing (500ms)
- Hiển thị 5 kết quả tìm kiếm
- Click vào kết quả → Map bay đến vị trí đó (flyTo animation)
- Hỗ trợ tiếng Việt
- Error handling

**Props:**
- `map` - Leaflet map instance
- `onLocationSelected` - Callback khi chọn vị trí
- `onClose` - Callback khi đóng component

### 2. **PhotosWithoutGPS.jsx**
Component quản lý danh sách ảnh không có GPS và workflow thêm location.

**Features:**
- Hiển thị badge số lượng ảnh chưa có GPS
- Panel collapse/expand
- Danh sách ảnh với thumbnail
- Tích hợp LocationSearch
- Click trên map để đặt marker
- Draggable marker để điều chỉnh
- Confirm và lưu vị trí

**Props:**
- `onLocationAdded` - Callback khi thêm location thành công

### 3. **geocodingService.js**
Service để gọi Nominatim API.

**Functions:**
- `searchAddress(query)` - Tìm kiếm địa chỉ
- `reverseGeocode(lat, lon)` - Tìm địa chỉ từ tọa độ

## 🔌 API Integration

### Frontend → Nominatim API
```javascript
GET https://nominatim.openstreetmap.org/search
Params:
  - q: "Đà Nẵng, Việt Nam"
  - format: json
  - limit: 5
  - accept-language: vi

Response:
[
  {
    lat: "16.0544068",
    lon: "108.2021667",
    display_name: "Đà Nẵng, Việt Nam",
    type: "city",
    importance: 0.8
  }
]
```

### Frontend → Backend API
```javascript
PUT /api/photos/{id}/location
Body:
{
  "latitude": 16.0544068,
  "longitude": 108.2021667
}

Response:
{
  "id": 1,
  "fileName": "photo.jpg",
  "latitude": 16.0544068,
  "longitude": 108.2021667,
  ...
}
```

## 🎨 UI/UX Flow

### 1. Detect Photos Without GPS
```
Upload ảnh → Backend check GPS → Nếu null → Badge hiển thị
```

### 2. Add Location Workflow
```
1. Click "X ảnh chưa có GPS" badge
   ↓
2. Panel mở ra với danh sách ảnh
   ↓
3. Click vào ảnh cần thêm location
   ↓
4. Hai lựa chọn:
   a) Tìm kiếm địa chỉ:
      - Nhập text → Nhấn Enter
      - Chọn từ kết quả
      - Map bay đến vị trí
   b) Click trực tiếp trên map:
      - Click vào bất kỳ đâu
      - Marker đỏ xuất hiện
   ↓
5. Kéo marker để điều chỉnh (nếu cần)
   ↓
6. Click "✓ Xác Nhận Vị Trí"
   ↓
7. Lưu vào database → Map refresh → Ảnh xuất hiện!
```

## 🚀 Technical Implementation

### Debouncing Search
Tránh spam API bằng cách delay 500ms sau khi user ngừng gõ:

```javascript
const searchTimeoutRef = useRef(null)

const handleSearchChange = (e) => {
  clearTimeout(searchTimeoutRef.current)
  searchTimeoutRef.current = setTimeout(() => {
    performSearch(value)
  }, 500)
}
```

### Map FlyTo Animation
Smooth camera movement đến vị trí tìm được:

```javascript
map.flyTo([lat, lon], 16, {
  duration: 1.5,
  easeLinearity: 0.5,
})
```

### Draggable Marker
Marker có thể kéo để điều chỉnh vị trí:

```javascript
<Marker
  position={tempMarkerPosition}
  draggable={true}
  eventHandlers={{
    dragend: handleMarkerDrag,
  }}
  ref={markerRef}
/>
```

### Custom Marker Icon
Marker đỏ hình giọt nước:

```javascript
L.divIcon({
  html: `<div style="
    width: 40px;
    height: 40px;
    background: #ef4444;
    border: 3px solid white;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
  "></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
})
```

## 📊 Data Flow

```
┌─────────────────────────────────────────┐
│ User uploads photo without GPS           │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ Badge shows "X ảnh chưa có GPS"          │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ User clicks badge → Panel opens          │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ User selects photo → LocationSearch shows│
└────────────────┬────────────────────────┘
                 ↓
        ┌────────┴────────┐
        │                 │
        ↓                 ↓
┌──────────────┐   ┌──────────────┐
│ Search text  │   │ Click on map │
└──────┬───────┘   └──────┬───────┘
       │                  │
       ↓                  ↓
┌──────────────────────────┐
│ Temp marker appears       │
└──────────┬───────────────┘
           ↓
┌──────────────────────────┐
│ User adjusts by dragging  │
└──────────┬───────────────┘
           ↓
┌──────────────────────────┐
│ Click "Xác Nhận Vị Trí"   │
└──────────┬───────────────┘
           ↓
┌──────────────────────────┐
│ PUT /api/photos/id/location│
└──────────┬───────────────┘
           ↓
┌──────────────────────────┐
│ Database updated          │
└──────────┬───────────────┘
           ↓
┌──────────────────────────┐
│ Map refreshes → Photo     │
│ appears with GPS!         │
└───────────────────────────┘
```

## 🎓 Usage Examples

### Ví dụ 1: Tìm kiếm thành phố
```
Input: "Đà Nẵng"
Results:
  - Đà Nẵng, Việt Nam (16.0544, 108.2022)
  - Bãi biển Mỹ Khê, Đà Nẵng
  - Cầu Rồng, Đà Nẵng
```

### Ví dụ 2: Tìm kiếm địa danh
```
Input: "Chùa Một Cột"
Results:
  - Chùa Một Cột, Ba Đình, Hà Nội
  - Phố Chùa Một Cột, Hà Nội
```

### Ví dụ 3: Tìm kiếm địa chỉ cụ thể
```
Input: "54 Nguyễn Du, Đà Nẵng"
Results:
  - 54, Nguyễn Du, Đà Nẵng
```

## ⚙️ Configuration

### Nominatim API Settings
```javascript
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org'

// Required headers
headers: {
  'User-Agent': 'GeoPhoto-App/1.0'
}

// Search parameters
params: {
  limit: 5,              // Số kết quả trả về
  'accept-language': 'vi' // Ưu tiên tiếng Việt
}
```

### Debounce Delay
```javascript
const DEBOUNCE_DELAY = 500 // milliseconds
```

## 🐛 Error Handling

### Network Errors
```javascript
try {
  const results = await searchAddress(query)
} catch (error) {
  // Show: "Lỗi kết nối đến dịch vụ tìm kiếm địa chỉ"
}
```

### No Results
```javascript
if (results.length === 0) {
  // Show: "Không tìm thấy địa chỉ. Thử với từ khóa khác."
}
```

### API Rate Limiting
Nominatim API có giới hạn: **1 request/second**
→ Debouncing giúp tránh vượt quá giới hạn

## 🎨 Styling

### Badge Color
- Orange (#ef4444) - Đỏ cam để thu hút sự chú ý

### Temp Marker
- Red (#ef4444) - Màu đỏ nổi bật
- Teardrop shape - Hình giọt nước
- White border - Viền trắng
- Draggable cursor - Cursor thay đổi khi hover

### Panel
- White background
- Shadow-2xl - Bóng đổ đậm
- Rounded corners
- Scrollable content

## 📱 Responsive Design

- Panel width: 320px (80 characters)
- Max height: calc(100vh - 120px)
- Scrollable photo list
- Touch-friendly buttons

## 🔮 Future Enhancements

- [ ] Batch location assignment (nhiều ảnh cùng lúc)
- [ ] Recent searches history
- [ ] Favorite locations
- [ ] GPS coordinates input (manual lat/lon)
- [ ] Address suggestions as you type
- [ ] Show address of clicked location
- [ ] Export/Import locations
- [ ] Offline geocoding cache

## 🎉 Result

Với tính năng Geocoding, user có thể:
- ✅ Tìm kiếm địa chỉ nhanh chóng
- ✅ Click trực tiếp trên map
- ✅ Điều chỉnh vị trí chính xác
- ✅ Thêm GPS cho mọi ảnh
- ✅ Không cần biết tọa độ GPS chính xác

**Mọi ảnh đều có thể hiển thị trên bản đồ!** 🗺️✨

