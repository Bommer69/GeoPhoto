import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
// Auth components
import ProtectedRoute from './components/auth/ProtectedRoute'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
// Map components
import PhotoMap from './components/map/PhotoMap'
// Library components
import PhotoLibrary from './components/library/PhotoLibrary'
// Album components
import AlbumList from './components/album/AlbumList'
import AlbumDetail from './components/album/AlbumDetail'
// Share components
import SharedView from './components/share/SharedView'

/**
 * =====================================================
 * App.jsx - Component gốc của ứng dụng GeoPhoto
 * =====================================================
 * 
 * Mô tả: Định nghĩa các routes và cấu trúc app
 * 
 * Routes:
 * - /login, /register: Đăng nhập, đăng ký (public)
 * - /: Bản đồ ảnh (protected)
 * - /library: Thư viện ảnh (protected)
 * - /albums: Danh sách albums (protected)
 * - /albums/:id: Chi tiết album (protected)
 * - /share/:shareCode: Xem nội dung chia sẻ (public)
 * 
 * @author GeoPhoto Team
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* ==================== PUBLIC ROUTES ==================== */}
            
            {/* Đăng nhập */}
            <Route path="/login" element={<Login />} />
            
            {/* Đăng ký */}
            <Route path="/register" element={<Register />} />
            
            {/* Xem nội dung chia sẻ (không cần đăng nhập) */}
            <Route path="/share/:shareCode" element={<SharedView />} />
            
            {/* ==================== PROTECTED ROUTES ==================== */}
            
            {/* Bản đồ ảnh - Trang chủ */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <PhotoMap />
                </ProtectedRoute>
              } 
            />
            
            {/* Thư viện ảnh */}
            <Route 
              path="/library" 
              element={
                <ProtectedRoute>
                  <PhotoLibrary />
                </ProtectedRoute>
              } 
            />
            
            {/* Danh sách Albums */}
            <Route 
              path="/albums" 
              element={
                <ProtectedRoute>
                  <AlbumList />
                </ProtectedRoute>
              } 
            />
            
            {/* Chi tiết Album */}
            <Route 
              path="/albums/:id" 
              element={
                <ProtectedRoute>
                  <AlbumDetail />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App

