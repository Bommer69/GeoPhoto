import axios from 'axios'

/**
 * Geocoding Service
 * Sử dụng Nominatim API (OpenStreetMap) để tìm kiếm địa chỉ
 */

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org'

// Create axios instance với custom config cho Nominatim
const nominatimClient = axios.create({
  baseURL: NOMINATIM_BASE_URL,
  headers: {
    'User-Agent': 'GeoPhoto-App/1.0', // Nominatim yêu cầu User-Agent
  },
})

/**
 * Tìm kiếm địa chỉ và trả về tọa độ
 * @param {string} query - Địa chỉ cần tìm (e.g., "Đà Nẵng, Việt Nam")
 * @returns {Promise<Array>} - Danh sách kết quả với lat, lon, display_name
 */
export const searchAddress = async (query) => {
  if (!query || query.trim() === '') {
    throw new Error('Vui lòng nhập địa chỉ cần tìm')
  }

  try {
    const response = await nominatimClient.get('/search', {
      params: {
        q: query,
        format: 'json',
        limit: 5, // Lấy 5 kết quả để user có thể chọn
        'accept-language': 'vi', // Ưu tiên tiếng Việt
      },
    })

    if (!response.data || response.data.length === 0) {
      throw new Error('Không tìm thấy địa chỉ. Vui lòng thử lại với từ khóa khác.')
    }

    return response.data.map(result => ({
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      displayName: result.display_name,
      type: result.type,
      importance: result.importance,
    }))

  } catch (error) {
    if (error.response) {
      throw new Error('Lỗi kết nối đến dịch vụ tìm kiếm địa chỉ')
    }
    throw error
  }
}

/**
 * Reverse geocoding: Tìm địa chỉ từ tọa độ
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<string>} - Địa chỉ
 */
export const reverseGeocode = async (lat, lon) => {
  try {
    const response = await nominatimClient.get('/reverse', {
      params: {
        lat,
        lon,
        format: 'json',
        'accept-language': 'vi',
      },
    })

    return response.data.display_name || 'Không xác định được địa chỉ'

  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`
  }
}

export default {
  searchAddress,
  reverseGeocode,
}

