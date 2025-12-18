# 📸 GeoPhoto - Personal Photo Map Manager

> **Ứng dụng quản lý ảnh cá nhân với bản đồ GPS** - Upload ảnh, tự động trích xuất GPS, và hiển thị trên bản đồ tương tác!

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Java](https://img.shields.io/badge/Java-17+-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green.svg)

---

## ✨ Tính năng chính

### 🗺️ **Hiển thị ảnh trên bản đồ**
- Tự động trích xuất GPS từ EXIF metadata
- Hiển thị ảnh dưới dạng marker thumbnail trên OpenStreetMap
- Cluster markers khi zoom out
- Click vào marker để xem chi tiết ảnh

### 📤 **Upload & Quản lý ảnh**
- Upload ảnh với drag & drop hoặc click
- Preview ảnh trước khi upload
- Hỗ trợ JPG, PNG, GIF (tối đa 10MB)
- Tự động phát hiện GPS từ ảnh smartphone

### 📍 **Thêm vị trí cho ảnh không có GPS**
- Click trên map để chọn vị trí
- Drag marker để điều chỉnh
- Tìm kiếm địa điểm bằng Nominatim
- Reverse geocoding hiển thị địa chỉ

### 🔐 **Xác thực & Bảo mật**
- Đăng ký/Đăng nhập với JWT
- Mỗi user chỉ quản lý ảnh của mình
- Password được hash với BCrypt
- Token-based authentication

### 🎨 **UI/UX hiện đại**
- Giao diện responsive (desktop & mobile)
- Tailwind CSS với animations
- Dark mode support
- Loading states & error handling

---

## 🚀 Tech Stack

### **Backend**
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17+
- **Database**: MongoDB 7.0+
- **Security**: Spring Security + JWT
- **GPS Library**: `metadata-extractor` (Drew Noakes)
- **Build Tool**: Maven

### **Frontend**
- **Framework**: React 18+ (Vite)
- **Styling**: Tailwind CSS
- **Map Library**: React-Leaflet (OpenStreetMap)
- **HTTP Client**: Axios
- **Routing**: React Router DOM

---

## 📦 Yêu cầu hệ thống

- **Java**: JDK 17 hoặc cao hơn
- **Node.js**: v18+ và npm
- **MongoDB**: 7.0+ (Community hoặc Docker)
- **Maven**: 3.8+ (hoặc dùng Maven wrapper)
- **RAM**: Tối thiểu 4GB
- **Disk**: 500MB trống (cho dependencies và uploads)

---

## 🛠️ Cài đặt & Chạy

### **1. Clone repository**
```bash
git clone https://github.com/your-username/PhotoMap-demo.git
cd PhotoMap-demo
```

### **2. Setup MongoDB**

**Option 1: MongoDB Community Edition**
```bash
# Download & install từ: https://www.mongodb.com/try/download/community
# Hoặc dùng package manager:

# Windows (Chocolatey):
choco install mongodb

# macOS:
brew tap mongodb/brew
brew install mongodb-community

# Ubuntu:
sudo apt-get install mongodb-org

# Khởi động MongoDB:
mongod --dbpath=./data/db
```

**Option 2: MongoDB Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### **3. Setup Backend**

```bash
cd backend

# Cấu hình MongoDB connection (nếu cần)
# Edit: src/main/resources/application.properties
# spring.data.mongodb.uri=mongodb://localhost:27017/geophoto

# Build & Run
mvn clean install
mvn spring-boot:run
```

Backend sẽ chạy tại: **http://localhost:8080**

### **4. Setup Frontend**

```bash
cd frontend

# Cài đặt dependencies
npm install

# Run development server
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

### **5. Tạo tài khoản đầu tiên**

1. Mở trình duyệt: http://localhost:5173
2. Click **"Đăng Ký"**
3. Nhập username, email, password
4. Đăng nhập và bắt đầu upload ảnh!

---

## 📖 Hướng dẫn sử dụng

### **Upload ảnh có GPS (từ smartphone)**

1. Click nút **"Upload Ảnh"** (floating button màu xanh)
2. Chọn ảnh từ smartphone có bật định vị
3. Ảnh sẽ tự động xuất hiện trên map tại vị trí GPS!

### **Thêm vị trí cho ảnh không có GPS**

1. Vào tab **"Ảnh Chưa Có GPS"**
2. Click vào ảnh muốn thêm vị trí
3. **Cách 1**: Click trực tiếp trên map
4. **Cách 2**: Dùng search bar để tìm địa điểm
5. Drag marker để điều chỉnh
6. Click **"Xác Nhận Vị Trí"**

### **Xem chi tiết & chỉnh sửa**

1. Click vào marker trên map
2. Popup hiển thị: ảnh, địa chỉ, tọa độ GPS
3. Click **"Chỉnh Sửa"** để thay đổi vị trí
4. Click **"Xóa"** để xóa ảnh (có confirm)

---

## 🏗️ Cấu trúc project

```
PhotoMap-demo/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/geophoto/
│   │   ├── config/            # Security, CORS, WebMvc config
│   │   ├── controller/        # REST API controllers
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── entity/            # MongoDB entities (Photo, User)
│   │   ├── repository/        # MongoDB repositories
│   │   ├── security/          # JWT filters & utils
│   │   ├── service/           # Business logic
│   │   └── util/              # GPS extractor utility
│   ├── src/main/resources/
│   │   └── application.properties  # App configuration
│   ├── uploads/               # Uploaded photos storage
│   └── pom.xml               # Maven dependencies
│
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── PhotoMap.jsx
│   │   │   ├── PhotoUpload.jsx
│   │   │   ├── PhotosWithoutGPS.jsx
│   │   │   ├── PhotoDetails.jsx
│   │   │   └── ...
│   │   ├── context/          # AuthContext
│   │   ├── services/         # API services (Axios)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   └── package.json
│
├── .gitignore
├── README.md
├── MONGODB_SETUP.md          # MongoDB detailed setup
├── QUICK_START.md            # Quick start guide
└── SUMMARY_VI.md             # Vietnamese summary
```

---

## 🔧 API Endpoints

### **Authentication**
```
POST   /api/auth/register     # Đăng ký user mới
POST   /api/auth/login        # Đăng nhập (trả về JWT)
GET    /api/auth/check        # Kiểm tra token hợp lệ
```

### **Photos**
```
GET    /api/photos            # Lấy tất cả ảnh của user
GET    /api/photos/with-gps   # Lấy ảnh có GPS
GET    /api/photos/{id}       # Lấy ảnh theo ID
POST   /api/photos/upload     # Upload ảnh mới
PUT    /api/photos/{id}/location  # Cập nhật vị trí GPS
DELETE /api/photos/{id}       # Xóa ảnh
```

**Note**: Tất cả endpoints `/api/photos/*` yêu cầu JWT token trong header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🌍 Deployment

### **Backend Deployment**

**1. Build JAR file:**
```bash
cd backend
mvn clean package -DskipTests
```

**2. Run JAR:**
```bash
java -jar target/geophoto-backend-1.0.0.jar
```

**3. Environment variables:**
```bash
export SPRING_DATA_MONGODB_URI=mongodb://your-mongo-host:27017/geophoto
export JWT_SECRET=your-secret-key-here
export UPLOAD_DIR=/path/to/uploads
```

### **Frontend Deployment**

**1. Build production:**
```bash
cd frontend
npm run build
```

**2. Deploy `dist/` folder** to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

**3. Update API base URL:**
Edit `frontend/src/services/photoService.js`:
```javascript
const API_BASE_URL = 'https://your-backend-domain.com/api'
```

---

## 📝 Configuration

### **Backend - application.properties**
```properties
# Server
server.port=8080

# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/geophoto
spring.data.mongodb.database=geophoto

# JWT
jwt.secret=your-very-long-secret-key-at-least-256-bits
jwt.expiration=86400000

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
upload.dir=uploads/
```

### **Frontend - photoService.js**
```javascript
const API_BASE_URL = 'http://localhost:8080/api'
```

---

## 🐛 Troubleshooting

### **Backend không khởi động**
- Kiểm tra MongoDB đang chạy: `mongosh --eval "db.version()"`
- Kiểm tra port 8080 có bị chiếm: `netstat -ano | findstr :8080`
- Xem logs chi tiết: `mvn spring-boot:run -X`

### **Frontend không connect được backend**
- Kiểm tra CORS config trong `WebMvcConfig.java`
- Kiểm tra API_BASE_URL đúng port backend
- Mở Browser DevTools > Network tab để xem request

### **Upload ảnh thất bại**
- Kiểm tra folder `backend/uploads/` có quyền write
- Kiểm tra file size < 10MB
- Kiểm tra JWT token còn hợp lệ (check localStorage)

### **MongoDB index errors**
```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/geophoto

# Drop all indexes
db.photos.dropIndexes()
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot) - Backend framework
- [React](https://react.dev/) - Frontend library
- [Leaflet](https://leafletjs.com/) - Interactive maps
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Drew Noakes](https://github.com/drewnoakes/metadata-extractor) - Metadata extractor
- [OpenStreetMap](https://www.openstreetmap.org/) - Map tiles
- [Nominatim](https://nominatim.org/) - Geocoding service

---

## 📚 Tài liệu thêm

- [MONGODB_SETUP.md](MONGODB_SETUP.md) - Hướng dẫn setup MongoDB chi tiết
- [QUICK_START.md](QUICK_START.md) - Quick start guide
- [SUMMARY_VI.md](SUMMARY_VI.md) - Tóm tắt tiếng Việt

---

**⭐ Nếu thấy project hữu ích, hãy cho một star nhé! ⭐**
