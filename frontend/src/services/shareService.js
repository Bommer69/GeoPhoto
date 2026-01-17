/**
 * =====================================================
 * shareService.js - Service API cho chức năng Chia sẻ
 * =====================================================
 * 
 * Mô tả: File này chứa các hàm gọi API liên quan đến chia sẻ ảnh/album
 * 
 * Các chức năng chính:
 * - Tạo link chia sẻ cho Photo/Album
 * - Quản lý link chia sẻ (xem, hủy, xóa)
 * - Xem nội dung chia sẻ (public)
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
 * Tạo axios instance cho authenticated requests
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Tạo axios instance cho public requests (không cần auth)
 */
const publicClient = axios.create({
  baseURL: `${getBackendUrl()}/public`,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request Interceptor - Tự động đính kèm JWT token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Response Interceptor - Xử lý lỗi xác thực
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login' && 
          window.location.pathname !== '/register' &&
          !window.location.pathname.startsWith('/share/')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ==================== PRIVATE APIs (yêu cầu đăng nhập) ====================

/**
 * Tạo link chia sẻ cho ảnh
 * 
 * @param {string} photoId - ID của ảnh
 * @param {Object} options - Tùy chọn
 * @param {string} options.title - Tiêu đề (tùy chọn)
 * @param {string} options.description - Mô tả (tùy chọn)
 * @param {string} options.password - Mật khẩu bảo vệ (tùy chọn)
 * @param {number} options.expiresInHours - Số giờ hết hạn (tùy chọn)
 * @returns {Promise<ShareLinkDTO>}
 */
export const createPhotoShareLink = async (photoId, options = {}) => {
  try {
    const response = await apiClient.post('/shares/photo', {
      targetId: photoId,
      title: options.title,
      description: options.description,
      password: options.password,
      expiresInHours: options.expiresInHours,
    })
    return response.data
  } catch (error) {
    console.error('Lỗi tạo link chia sẻ ảnh:', error)
    throw error
  }
}

/**
 * Tạo link chia sẻ cho album
 * 
 * @param {string} albumId - ID của album
 * @param {Object} options - Tùy chọn (như createPhotoShareLink)
 * @returns {Promise<ShareLinkDTO>}
 */
export const createAlbumShareLink = async (albumId, options = {}) => {
  try {
    const response = await apiClient.post('/shares/album', {
      targetId: albumId,
      title: options.title,
      description: options.description,
      password: options.password,
      expiresInHours: options.expiresInHours,
    })
    return response.data
  } catch (error) {
    console.error('Lỗi tạo link chia sẻ album:', error)
    throw error
  }
}

/**
 * Lấy tất cả link chia sẻ của user hiện tại
 * 
 * @returns {Promise<Array<ShareLinkDTO>>}
 */
export const getAllShareLinks = async () => {
  try {
    const response = await apiClient.get('/shares')
    return response.data
  } catch (error) {
    console.error('Lỗi lấy danh sách link chia sẻ:', error)
    throw error
  }
}

/**
 * Lấy chi tiết một link chia sẻ (cho owner)
 * 
 * @param {string} id - ID của link
 * @returns {Promise<ShareLinkDTO>}
 */
export const getShareLinkById = async (id) => {
  try {
    const response = await apiClient.get(`/shares/${id}`)
    return response.data
  } catch (error) {
    console.error('Lỗi lấy chi tiết link:', error)
    throw error
  }
}

/**
 * Hủy kích hoạt link chia sẻ (link vẫn tồn tại nhưng không truy cập được)
 * 
 * @param {string} id - ID của link
 */
export const deactivateShareLink = async (id) => {
  try {
    await apiClient.put(`/shares/${id}/deactivate`)
  } catch (error) {
    console.error('Lỗi hủy link chia sẻ:', error)
    throw error
  }
}

/**
 * Xóa link chia sẻ hoàn toàn
 * 
 * @param {string} id - ID của link
 */
export const deleteShareLink = async (id) => {
  try {
    await apiClient.delete(`/shares/${id}`)
  } catch (error) {
    console.error('Lỗi xóa link chia sẻ:', error)
    throw error
  }
}

/**
 * Lấy các link chia sẻ đang active cho một Photo/Album
 * 
 * @param {string} type - 'photo' hoặc 'album'
 * @param {string} targetId - ID của Photo/Album
 * @returns {Promise<Array<ShareLinkDTO>>}
 */
export const getShareLinksForTarget = async (type, targetId) => {
  try {
    const response = await apiClient.get(`/shares/target/${type}/${targetId}`)
    return response.data
  } catch (error) {
    console.error('Lỗi lấy link chia sẻ cho target:', error)
    throw error
  }
}

// ==================== PUBLIC APIs (không cần đăng nhập) ====================

/**
 * Lấy thông tin cơ bản của link chia sẻ
 * Kiểm tra xem link có cần mật khẩu không
 * 
 * @param {string} shareCode - Mã chia sẻ trong URL
 * @returns {Promise<ShareLinkDTO>}
 */
export const getPublicShareInfo = async (shareCode) => {
  try {
    const response = await publicClient.get(`/share/${shareCode}`)
    return response.data
  } catch (error) {
    console.error('Lỗi lấy thông tin link:', error)
    throw error
  }
}

/**
 * Xem nội dung chia sẻ (có thể cần mật khẩu)
 * 
 * @param {string} shareCode - Mã chia sẻ
 * @param {string} password - Mật khẩu (nếu có)
 * @returns {Promise<ShareLinkDTO>} Bao gồm photo/album và photos
 */
export const viewSharedContent = async (shareCode, password = null) => {
  try {
    const response = await publicClient.post(`/share/${shareCode}/view`, {
      password: password,
    })
    return response.data
  } catch (error) {
    console.error('Lỗi xem nội dung chia sẻ:', error)
    throw error
  }
}

/**
 * Helper: Copy share URL vào clipboard
 * 
 * @param {string} shareUrl - URL cần copy
 * @returns {Promise<boolean>} true nếu thành công
 */
export const copyShareUrl = async (shareUrl) => {
  try {
    await navigator.clipboard.writeText(shareUrl)
    return true
  } catch (error) {
    console.error('Lỗi copy URL:', error)
    // Fallback cho các trình duyệt cũ
    const textArea = document.createElement('textarea')
    textArea.value = shareUrl
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    return true
  }
}

export default {
  createPhotoShareLink,
  createAlbumShareLink,
  getAllShareLinks,
  getShareLinkById,
  deactivateShareLink,
  deleteShareLink,
  getShareLinksForTarget,
  getPublicShareInfo,
  viewSharedContent,
  copyShareUrl,
}
