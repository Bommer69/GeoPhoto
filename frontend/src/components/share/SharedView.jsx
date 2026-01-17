/**
 * =====================================================
 * SharedView.jsx - Trang xem nội dung chia sẻ (Public)
 * =====================================================
 * 
 * Mô tả: Trang public để xem ảnh/album được chia sẻ
 * Route: /share/:shareCode
 * Không yêu cầu đăng nhập
 * 
 * Các chức năng:
 * - Hiển thị thông tin link chia sẻ
 * - Nhập mật khẩu nếu được bảo vệ
 * - Xem ảnh (single photo)
 * - Xem album (gallery)
 * - Hiển thị vị trí trên bản đồ mini
 * 
 * @author GeoPhoto Team
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPublicShareInfo, viewSharedContent } from '../../services/shareService'

const SharedView = () => {
  // ==================== HOOKS ====================
  
  // Lấy shareCode từ URL
  const { shareCode } = useParams()
  const navigate = useNavigate()
  
  // ==================== STATES ====================
  
  // Thông tin link (kiểm tra có cần mật khẩu không)
  const [shareInfo, setShareInfo] = useState(null)
  
  // Nội dung chia sẻ (photo/album)
  const [content, setContent] = useState(null)
  
  // Trạng thái
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Mật khẩu
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(null)
  const [verifying, setVerifying] = useState(false)
  
  // Ảnh đang xem (full screen)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  
  // ==================== EFFECTS ====================
  
  /**
   * Effect: Tải thông tin link khi component mount
   */
  useEffect(() => {
    loadShareInfo()
  }, [shareCode])
  
  // ==================== HANDLERS ====================
  
  /**
   * Tải thông tin link chia sẻ
   */
  const loadShareInfo = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const info = await getPublicShareInfo(shareCode)
      setShareInfo(info)
      
      // Nếu không cần mật khẩu, tự động tải nội dung
      if (!info.passwordProtected) {
        await loadContent(null)
      }
    } catch (err) {
      console.error('Lỗi tải thông tin link:', err)
      setError(err.response?.data?.message || 'Link không tồn tại hoặc đã hết hạn')
    } finally {
      setLoading(false)
    }
  }
  
  /**
   * Tải nội dung chia sẻ
   */
  const loadContent = async (pwd) => {
    try {
      setVerifying(true)
      setPasswordError(null)
      
      const data = await viewSharedContent(shareCode, pwd)
      setContent(data)
    } catch (err) {
      console.error('Lỗi tải nội dung:', err)
      if (err.response?.data?.requirePassword) {
        setPasswordError(err.response.data.message)
      } else {
        setError(err.response?.data?.message || 'Không thể tải nội dung')
      }
    } finally {
      setVerifying(false)
    }
  }
  
  /**
   * Xác thực mật khẩu
   */
  const handleVerifyPassword = async (e) => {
    e.preventDefault()
    if (!password.trim()) return
    await loadContent(password.trim())
  }
  
  /**
   * Format ngày tháng
   */
  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }
  
  // ==================== RENDER: Loading ====================
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-300 border-t-emerald-600 mx-auto mb-4"></div>
          <p className="text-xl text-emerald-200">Đang tải...</p>
        </div>
      </div>
    )
  }
  
  // ==================== RENDER: Error ====================
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/30 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md border border-red-500/30">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Không tìm thấy</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    )
  }
  
  // ==================== RENDER: Password Required ====================
  
  if (shareInfo?.passwordProtected && !content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{shareInfo.title}</h2>
            <p className="text-gray-300">Nội dung này được bảo vệ bằng mật khẩu</p>
          </div>
          
          <form onSubmit={handleVerifyPassword} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                autoFocus
              />
              {passwordError && (
                <p className="text-red-400 text-sm mt-2">{passwordError}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={verifying || !password.trim()}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {verifying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang xác thực...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  Mở khóa
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }
  
  // ==================== RENDER: Content ====================
  
  if (!content) return null
  
  const isPhoto = content.type === 'PHOTO'
  const photo = content.photo
  const album = content.album
  const photos = content.photos || []
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900/50 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{content.title}</h1>
                {content.description && (
                  <p className="text-sm text-emerald-300/70">{content.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>👁 {content.viewCount} lượt xem</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        
        {/* Single Photo */}
        {isPhoto && photo && (
          <div className="flex flex-col items-center">
            <div className="bg-black/50 rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-full">
              <img
                src={`http://${window.location.hostname}:8080${photo.url}`}
                alt={photo.fileName}
                className="w-full h-auto object-contain max-h-[70vh]"
                onClick={() => setSelectedPhoto(photo)}
              />
            </div>
            
            {/* Photo Info */}
            <div className="mt-4 bg-white/5 backdrop-blur-lg rounded-xl p-4 max-w-4xl w-full border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">{photo.fileName}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                {photo.takenAt && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {formatDate(photo.takenAt)}
                  </span>
                )}
                {photo.latitude && photo.longitude && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {photo.latitude.toFixed(4)}, {photo.longitude.toFixed(4)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Album Gallery */}
        {!isPhoto && album && (
          <>
            {/* Album Info */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 mb-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{album.name}</h2>
                  {album.description && (
                    <p className="text-gray-400 mt-1">{album.description}</p>
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  📷 {photos.length} ảnh
                </div>
              </div>
            </div>
            
            {/* Photos Grid */}
            {photos.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-400">Album này chưa có ảnh</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {photos.map((p, index) => (
                  <div
                    key={p.id || index}
                    className="aspect-square rounded-xl overflow-hidden bg-white/5 cursor-pointer group relative"
                    onClick={() => setSelectedPhoto(p)}
                  >
                    <img
                      src={`http://${window.location.hostname}:8080${p.url}`}
                      alt={p.fileName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=📷'
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-xs truncate">{p.fileName}</p>
                      </div>
                    </div>
                    
                    {/* GPS Badge */}
                    {p.latitude && p.longitude && (
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-emerald-500/90 text-white text-xs rounded">
                        📍
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      
      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>Chia sẻ bởi <span className="text-emerald-400 font-medium">GeoPhoto</span></p>
      </footer>
      
      {/* Full Screen Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <img
            src={`http://${window.location.hostname}:8080${selectedPhoto.url}`}
            alt={selectedPhoto.fileName}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          
          {/* Photo info */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white">
            <p className="font-medium">{selectedPhoto.fileName}</p>
            <div className="flex gap-4 text-sm text-gray-300 mt-1">
              {selectedPhoto.takenAt && (
                <span>📅 {formatDate(selectedPhoto.takenAt)}</span>
              )}
              {selectedPhoto.latitude && selectedPhoto.longitude && (
                <span>📍 {selectedPhoto.latitude.toFixed(4)}, {selectedPhoto.longitude.toFixed(4)}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SharedView
