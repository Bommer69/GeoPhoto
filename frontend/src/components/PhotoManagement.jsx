import React, { useState } from 'react'

/**
 * PhotoManagement Component
 * Button để mở modal quản lý ảnh (thêm GPS, xóa, etc.)
 */
const PhotoManagement = ({ photosWithoutGps, onOpenManagement }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  if (!photosWithoutGps || photosWithoutGps === 0) return null

  return (
    <div className="relative">
      <button
        onClick={onOpenManagement}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-full mt-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm rounded-lg transition-all duration-200 shadow-md flex items-center justify-center gap-2 font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Thêm GPS ({photosWithoutGps})</span>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-[2000] shadow-xl">
          Click để mở công cụ thêm GPS
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhotoManagement

