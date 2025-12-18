# GeoPhoto Frontend

Frontend cho ứng dụng GeoPhoto - Personal Photo Map Manager.

## Tech Stack

- **React 18** - UI Framework
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling
- **Leaflet** - Map Library
- **react-leaflet** - React bindings for Leaflet
- **react-leaflet-cluster** - Marker clustering
- **Axios** - HTTP Client

## Project Structure

```
src/
├── components/
│   └── PhotoMap.jsx          # Main map component with markers
├── services/
│   └── photoService.js       # API client for backend communication
├── App.jsx                   # Root component
├── main.jsx                  # Application entry point
└── index.css                 # Global styles + Tailwind
```

## Installation

```bash
npm install
```

## Running

```bash
# Development server (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Features

- Hiển thị ảnh trên bản đồ OpenStreetMap
- Marker clustering khi zoom out
- Custom marker icons (thumbnails của ảnh)
- Popup hiển thị chi tiết ảnh
- Responsive design với Tailwind CSS

## Configuration

- Vite proxy đã được cấu hình để forward `/api` requests đến `localhost:8080`
- Leaflet CSS được load từ CDN trong `index.html`
- Tailwind CSS được cấu hình qua `tailwind.config.js`

## Notes

- Đảm bảo backend đang chạy ở port 8080
- Map mặc định center ở Việt Nam (16.0544, 108.2022)
- Markers sẽ sử dụng thumbnail của ảnh thay vì icon mặc định
- Sử dụng MarkerClusterGroup để nhóm ảnh khi zoom out

