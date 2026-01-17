import React, { useState, useRef, useEffect } from 'react'
import { searchAddress } from '../../services/geocodingService'

/**
 * LocationSearch Component
 * Tìm kiếm địa chỉ sử dụng Nominatim API và cho phép user chọn vị trí trên map
 */
const LocationSearch = ({ map, onLocationSelected, onClose }) => {
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const [selectedResult, setSelectedResult] = useState(null)
  const searchTimeoutRef = useRef(null)

  /**
   * Debounced search - tránh spam API
   */
  const handleSearchChange = (e) => {
    const value = e.target.value
    setQuery(value)
    setError(null)

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Don't search if query is too short
    if (value.trim().length < 3) {
      setResults([])
      return
    }

    // Set new timeout for debouncing
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value)
    }, 500) // 500ms delay
  }

  /**
   * Thực hiện tìm kiếm
   */
  const performSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 3) return

    setSearching(true)
    setError(null)

    try {
      const searchResults = await searchAddress(searchQuery)
      setResults(searchResults)
      
      if (searchResults.length === 0) {
        setError('Không tìm thấy địa chỉ. Thử với từ khóa khác.')
      }
    } catch (err) {
      console.error('Search error:', err)
      setError(err.message || 'Lỗi khi tìm kiếm địa chỉ')
      setResults([])
    } finally {
      setSearching(false)
    }
  }

  /**
   * Xử lý khi user click vào một kết quả
   */
  const handleResultClick = (result) => {
    setSelectedResult(result)
    setResults([]) // Clear results after selection
    
    // Fly to location on map
    if (map) {
      map.flyTo([result.lat, result.lon], 16, {
        duration: 1.5,
        easeLinearity: 0.5,
      })
    }

    // Notify parent component
    if (onLocationSelected) {
      onLocationSelected(result.lat, result.lon, result.displayName)
    }
  }

  /**
   * Cleanup timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="location-search-container bg-white rounded-lg shadow-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Tìm Kiếm Địa Chỉ
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Nhập địa chỉ (ví dụ: Đà Nẵng, Việt Nam)..."
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        
        {searching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <p className="text-sm text-gray-600 font-medium">
            Tìm thấy {results.length} kết quả:
          </p>
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleResultClick(result)}
              className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition group"
            >
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600">
                    {result.displayName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {result.lat.toFixed(6)}, {result.lon.toFixed(6)}
                    {result.type && ` • ${result.type}`}
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Result Info */}
      {selectedResult && (
        <div className="bg-green-50 border border-green-200 px-4 py-3 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">
                Đã chọn vị trí
              </p>
              <p className="text-xs text-green-700 mt-1">
                {selectedResult.displayName}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1 text-xs text-blue-800">
            <p className="font-medium mb-1">💡 Mẹo tìm kiếm:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Nhập tên thành phố, địa danh (ví dụ: &quot;Hà Nội&quot;, &quot;Phố cổ Hội An&quot;)</li>
              <li>Nhập địa chỉ cụ thể (ví dụ: &quot;54 Nguyễn Du, Đà Nẵng&quot;)</li>
              <li>Sau khi chọn, bạn có thể kéo marker để điều chỉnh vị trí</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationSearch

