/**
 * =====================================================
 * albumService.js - Service API cho chức năng Album
 * =====================================================
 * 
 * Mô tả: File này chứa các hàm gọi API liên quan đến Album/Bộ sưu tập
 * Sử dụng axios để gọi REST API từ backend
 * 
 * Các chức năng chính:
 * - Lấy danh sách album
 * - Tạo, sửa, xóa album
 * - Thêm/xóa ảnh vào album
 * 
 * @author GeoPhoto Team
 */

import axios from 'axios'
import { getToken } from './authService'

// URL gốc của API backend - tự động dùng hostname hiện tại
// Cho phép truy cập từ localhost hoặc IP trong mạng LAN
const getBackendUrl = () => {
  const hostname = window.location.hostname
  return `http://${hostname}:8080/api`
}

const API_BASE_URL = getBackendUrl()

/**
 * Tạo axios instance với cấu hình mặc định
 * - baseURL: URL gốc cho tất cả request
 * - headers: Mặc định gửi JSON
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request Interceptor - Tự động đính kèm JWT token vào header
 * Mỗi request gửi đi sẽ tự động thêm header: Authorization: Bearer <token>
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor - Xử lý lỗi xác thực
 * Nếu nhận được lỗi 401 (Unauthorized) hoặc 403 (Forbidden):
 * - Xóa token và user khỏi localStorage
 * - Chuyển hướng về trang đăng nhập
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Chỉ chuyển hướng nếu không phải trang login/register
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

/**
 * Lấy tất cả album của user hiện tại
 * 
 * API: GET /api/albums
 * @returns {Promise<Array<AlbumDTO>>} Danh sách album
 */
export const fetchAllAlbums = async () => {
  try {
    const response = await apiClient.get('/albums')
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách albums:', error)
    throw error
  }
}

/**
 * Lấy chi tiết một album (bao gồm danh sách ảnh)
 * 
 * API: GET /api/albums/{id}
 * @param {string} id - ID của album
 * @returns {Promise<AlbumDTO>} Album với photos đầy đủ
 */
export const fetchAlbumById = async (id) => {
  try {
    const response = await apiClient.get(`/albums/${id}`)
    return response.data
  } catch (error) {
    console.error(`Lỗi khi lấy album ${id}:`, error)
    throw error
  }
}

/**
 * Tạo album mới
 * 
 * API: POST /api/albums
 * @param {string} name - Tên album (bắt buộc)
 * @param {string} description - Mô tả album (tùy chọn)
 * @returns {Promise<AlbumDTO>} Album vừa tạo
 */
export const createAlbum = async (name, description = '') => {
  try {
    const response = await apiClient.post('/albums', {
      name,
      description,
    })
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo album:', error)
    throw error
  }
}

/**
 * Cập nhật thông tin album
 * 
 * API: PUT /api/albums/{id}
 * @param {string} id - ID album cần cập nhật
 * @param {string} name - Tên mới
 * @param {string} description - Mô tả mới
 * @param {string|null} coverPhotoId - ID ảnh bìa mới (tùy chọn)
 * @returns {Promise<AlbumDTO>} Album sau khi cập nhật
 */
export const updateAlbum = async (id, name, description, coverPhotoId = null) => {
  try {
    const response = await apiClient.put(`/albums/${id}`, {
      name,
      description,
      coverPhotoId,
    })
    return response.data
  } catch (error) {
    console.error(`Lỗi khi cập nhật album ${id}:`, error)
    throw error
  }
}

/**
 * Xóa một album
 * Lưu ý: Chỉ xóa album, không xóa ảnh trong album
 * 
 * API: DELETE /api/albums/{id}
 * @param {string} id - ID album cần xóa
 */
export const deleteAlbum = async (id) => {
  try {
    await apiClient.delete(`/albums/${id}`)
  } catch (error) {
    console.error(`Lỗi khi xóa album ${id}:`, error)
    throw error
  }
}

/**
 * Thêm một ảnh vào album
 * 
 * API: POST /api/albums/{albumId}/photos/{photoId}
 * @param {string} albumId - ID của album
 * @param {string} photoId - ID của ảnh cần thêm
 * @returns {Promise<AlbumDTO>} Album sau khi thêm ảnh
 */
export const addPhotoToAlbum = async (albumId, photoId) => {
  try {
    const response = await apiClient.post(`/albums/${albumId}/photos/${photoId}`)
    return response.data
  } catch (error) {
    console.error(`Lỗi khi thêm ảnh ${photoId} vào album ${albumId}:`, error)
    throw error
  }
}

/**
 * Xóa một ảnh khỏi album
 * Lưu ý: Chỉ xóa liên kết, không xóa ảnh gốc
 * 
 * API: DELETE /api/albums/{albumId}/photos/{photoId}
 * @param {string} albumId - ID của album
 * @param {string} photoId - ID của ảnh cần xóa khỏi album
 * @returns {Promise<AlbumDTO>} Album sau khi xóa ảnh
 */
export const removePhotoFromAlbum = async (albumId, photoId) => {
  try {
    const response = await apiClient.delete(`/albums/${albumId}/photos/${photoId}`)
    return response.data
  } catch (error) {
    console.error(`Lỗi khi xóa ảnh ${photoId} khỏi album ${albumId}:`, error)
    throw error
  }
}

/**
 * Thêm nhiều ảnh vào album cùng lúc
 * 
 * API: POST /api/albums/{albumId}/photos
 * Body: { photoIds: ["id1", "id2", ...] }
 * @param {string} albumId - ID của album
 * @param {Array<string>} photoIds - Mảng ID các ảnh cần thêm
 * @returns {Promise<AlbumDTO>} Album sau khi thêm ảnh
 */
export const addPhotosToAlbum = async (albumId, photoIds) => {
  try {
    const response = await apiClient.post(`/albums/${albumId}/photos`, {
      photoIds,
    })
    return response.data
  } catch (error) {
    console.error(`Lỗi khi thêm nhiều ảnh vào album ${albumId}:`, error)
    throw error
  }
}

/**
 * Tìm tất cả album chứa một ảnh cụ thể
 * Dùng để hiển thị "Ảnh này thuộc album nào?"
 * 
 * API: GET /api/albums/photo/{photoId}
 * @param {string} photoId - ID của ảnh
 * @returns {Promise<Array<AlbumDTO>>} Danh sách album chứa ảnh
 */
export const getAlbumsContainingPhoto = async (photoId) => {
  try {
    const response = await apiClient.get(`/albums/photo/${photoId}`)
    return response.data
  } catch (error) {
    console.error(`Lỗi khi tìm albums chứa ảnh ${photoId}:`, error)
    throw error
  }
}

/**
 * Export default - Object chứa tất cả các hàm
 * Cho phép import: import albumService from './albumService'
 * Sử dụng: albumService.fetchAllAlbums()
 */
export default {
  fetchAllAlbums,
  fetchAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addPhotoToAlbum,
  removePhotoFromAlbum,
  addPhotosToAlbum,
  getAlbumsContainingPhoto,
}
