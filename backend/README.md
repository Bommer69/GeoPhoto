# GeoPhoto Backend

Backend service cho ứng dụng GeoPhoto - Personal Photo Map Manager.

## Cấu trúc Package

```
com.geophoto/
├── GeoPhotoApplication.java    # Main Application
├── config/
│   └── WebMvcConfig.java        # CORS & Static Resource Configuration
├── controller/
│   └── PhotoController.java     # REST API Endpoints
├── service/
│   └── PhotoService.java        # Business Logic
├── repository/
│   └── PhotoRepository.java     # JPA Repository
├── entity/
│   └── Photo.java               # Photo Entity Model
├── dto/
│   └── PhotoDTO.java            # Data Transfer Object
└── util/
    └── GpsExtractor.java        # GPS/EXIF Extraction Utility
```

## Dependencies

- **Spring Boot Web** - REST API
- **Spring Data JPA** - Database access
- **PostgreSQL/H2** - Database
- **Metadata Extractor** - GPS/EXIF data extraction
- **Lombok** - Boilerplate code reduction

## Configuration

Xem file `src/main/resources/application.properties` để cấu hình:
- Database connection
- File upload settings
- Server port

## Running

```bash
# Compile và chạy
mvn spring-boot:run

# Package thành JAR
mvn clean package

# Chạy JAR file
java -jar target/geophoto-backend-1.0.0.jar
```

## API Documentation

Xem file README.md ở root project để biết chi tiết API endpoints.

## Notes

- Mặc định sử dụng H2 in-memory database (development)
- Có thể chuyển sang PostgreSQL bằng cách uncomment các dòng PostgreSQL trong application.properties
- Upload folder sẽ tự động được tạo khi upload ảnh đầu tiên
- CORS đã được cấu hình cho localhost:5173 (frontend)

