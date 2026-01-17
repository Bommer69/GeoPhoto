/**
 * =====================================================
 * ShareModal.jsx - Modal tạo và quản lý link chia sẻ
 * =====================================================
 * 
 * Mô tả: Component modal popup để tạo link chia sẻ cho Photo/Album
 * 
 * Props:
 * @param {string} type - 'photo' hoặc 'album'
 * @param {string} targetId - ID của Photo/Album
 * @param {string} targetName - Tên hiển thị
 * @param {function} onClose - Callback đóng modal
 * 
 * Các chức năng:
 * - Tạo link chia sẻ với các tùy chọn
 * - Đặt mật khẩu bảo vệ
 * - Đặt thời hạn hết hạn
 * - Copy link vào clipboard
 * - Xem danh sách link đã tạo
 * 
 * @author GeoPhoto Team
 */

import { useState, useEffect } from 'react'
import { 
  createPhotoShareLink, 
  createAlbumShareLink, 
  getShareLinksForTarget,
  deleteShareLink,
  copyShareUrl 
} from '../../services/shareService'

const ShareModal = ({ type, targetId, targetName, onClose }) => {
  // ==================== STATES ====================
  
  // Tab hiện tại: 'create' hoặc 'manage'
  const [activeTab, setActiveTab] = useState('create')
  
  // Form tạo link
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [password, setPassword] = useState('')
  const [usePassword, setUsePassword] = useState(false)
  const [expiresIn, setExpiresIn] = useState('never') // 'never', '1h', '24h', '7d', '30d'
  const [creating, setCreating] = useState(false)
  
  // Link vừa tạo
  const [createdLink, setCreatedLink] = useState(null)
  const [copied, setCopied] = useState(false)
  
  // Danh sách link đã tạo
  const [existingLinks, setExistingLinks] = useState([])
  const [loadingLinks, setLoadingLinks] = useState(false)
  
  // ==================== EFFECTS ====================
  
  /**
   * Tải danh sách link đã tạo cho target này
   */
  useEffect(() => {
    loadExistingLinks()
  }, [targetId, type])
  
  // ==================== HANDLERS ====================
  
  /**
   * Tải danh sách link chia sẻ đã có
   */
  const loadExistingLinks = async () => {
    try {
      setLoadingLinks(true)
      const links = await getShareLinksForTarget(type, targetId)
      setExistingLinks(links)
    } catch (err) {
      console.error('Lỗi tải links:', err)
    } finally {
      setLoadingLinks(false)
    }
  }
  
  /**
   * Tính số giờ từ option
   */
  const getExpiresInHours = () => {
    switch (expiresIn) {
      case '1h': return 1
      case '24h': return 24
      case '7d': return 24 * 7
      case '30d': return 24 * 30
      default: return null // never expires
    }
  }
  
  /**
   * Tạo link chia sẻ
   */
  const handleCreateLink = async () => {
    try {
      setCreating(true)
      
      const options = {
        title: title.trim() || null,
        description: description.trim() || null,
        password: usePassword && password.trim() ? password.trim() : null,
        expiresInHours: getExpiresInHours(),
      }
      
      let link
      if (type === 'photo') {
        link = await createPhotoShareLink(targetId, options)
      } else {
        link = await createAlbumShareLink(targetId, options)
      }
      
      setCreatedLink(link)
      loadExistingLinks() // Reload danh sách
    } catch (err) {
      console.error('Lỗi tạo link:', err)
      alert(err.response?.data?.message || 'Không thể tạo link chia sẻ')
    } finally {
      setCreating(false)
    }
  }
  
  /**
   * Copy URL vào clipboard
   */
  const handleCopyUrl = async (url) => {
    const success = await copyShareUrl(url)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  /**
   * Xóa link chia sẻ
   */
  const handleDeleteLink = async (linkId) => {
    try {
      await deleteShareLink(linkId)
      loadExistingLinks()
    } catch (err) {
      console.error('Lỗi xóa link:', err)
      alert('Không thể xóa link')
    }
  }
  
  /**
   * Reset form để tạo link mới
   */
  const handleCreateAnother = () => {
    setCreatedLink(null)
    setTitle('')
    setDescription('')
    setPassword('')
    setUsePassword(false)
    setExpiresIn('never')
  }
  
  /**
   * Format thời gian hết hạn
   */
  const formatExpiry = (expiresAt) => {
    if (!expiresAt) return 'Không hết hạn'
    const date = new Date(expiresAt)
    const now = new Date()
    if (date < now) return 'Đã hết hạn'
    return date.toLocaleString('vi-VN')
  }
  
  // ==================== RENDER ====================
  
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl max-w-lg w-full border border-white/10 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Chia sẻ {type === 'photo' ? 'ảnh' : 'album'}</h3>
                <p className="text-sm text-gray-400 truncate max-w-[250px]">{targetName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                activeTab === 'create'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Tạo link mới
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                activeTab === 'manage'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Quản lý
              {existingLinks.length > 0 && (
                <span className="px-1.5 py-0.5 bg-green-500/30 text-green-400 text-xs rounded-full">
                  {existingLinks.length}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          
          {/* Tab: Tạo link mới */}
          {activeTab === 'create' && (
            <>
              {/* Hiển thị link vừa tạo */}
              {createdLink ? (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-white">Link đã được tạo!</h4>
                    <p className="text-sm text-gray-400">Sao chép và chia sẻ với bạn bè</p>
                  </div>
                  
                  {/* URL Box */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={createdLink.shareUrl}
                        readOnly
                        className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                      />
                      <button
                        onClick={() => handleCopyUrl(createdLink.shareUrl)}
                        className={`px-3 py-1.5 rounded-lg font-medium text-sm transition ${
                          copied
                            ? 'bg-green-500 text-white'
                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}
                      >
                        {copied ? '✓ Đã copy' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="bg-white/5 rounded-xl p-3 space-y-2 text-sm">
                    {createdLink.passwordProtected && (
                      <div className="flex items-center gap-2 text-yellow-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span>Được bảo vệ bằng mật khẩu</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>Hết hạn: {formatExpiry(createdLink.expiresAt)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCreateAnother}
                    className="w-full py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition font-medium"
                  >
                    Tạo link khác
                  </button>
                </div>
              ) : (
                /* Form tạo link */
                <div className="space-y-4">
                  {/* Tiêu đề */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Tiêu đề (tùy chọn)
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={`Mặc định: ${targetName}`}
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    />
                  </div>
                  
                  {/* Mô tả */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Mô tả (tùy chọn)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Mô tả ngắn cho người xem..."
                      rows={2}
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none"
                    />
                  </div>
                  
                  {/* Mật khẩu */}
                  <div className="bg-white/5 rounded-xl p-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={usePassword}
                        onChange={(e) => setUsePassword(e.target.checked)}
                        className="w-5 h-5 rounded border-white/30 bg-white/10 text-green-500 focus:ring-green-500"
                      />
                      <div>
                        <span className="text-white font-medium">Bảo vệ bằng mật khẩu</span>
                        <p className="text-xs text-gray-500">Người xem cần nhập mật khẩu</p>
                      </div>
                    </label>
                    {usePassword && (
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu..."
                        className="w-full mt-3 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                      />
                    )}
                  </div>
                  
                  {/* Thời hạn */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Thời hạn
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { value: 'never', label: 'Vĩnh viễn' },
                        { value: '1h', label: '1 giờ' },
                        { value: '24h', label: '24 giờ' },
                        { value: '7d', label: '7 ngày' },
                        { value: '30d', label: '30 ngày' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setExpiresIn(opt.value)}
                          className={`py-2 px-2 rounded-lg text-sm font-medium transition ${
                            expiresIn === opt.value
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Nút tạo */}
                  <button
                    onClick={handleCreateLink}
                    disabled={creating || (usePassword && !password.trim())}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {creating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Tạo link chia sẻ
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
          
          {/* Tab: Quản lý links */}
          {activeTab === 'manage' && (
            <div className="space-y-3">
              {loadingLinks ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent"></div>
                </div>
              ) : existingLinks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <p className="text-gray-400">Chưa có link chia sẻ nào</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="mt-3 text-green-400 hover:text-green-300"
                  >
                    Tạo link đầu tiên →
                  </button>
                </div>
              ) : (
                existingLinks.map((link) => (
                  <div
                    key={link.id}
                    className={`bg-white/5 border rounded-xl p-3 ${
                      link.expired ? 'border-red-500/30 opacity-60' : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium truncate">{link.title}</span>
                          {link.passwordProtected && (
                            <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          {link.expired && (
                            <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">Hết hạn</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                          <span>👁 {link.viewCount} lượt xem</span>
                          <span>{formatExpiry(link.expiresAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyUrl(link.shareUrl)}
                          className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition"
                          title="Copy link"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                          title="Xóa link"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShareModal
