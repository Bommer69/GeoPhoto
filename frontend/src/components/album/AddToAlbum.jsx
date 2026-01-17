/**
 * =====================================================
 * AddToAlbum.jsx - Modal thêm ảnh vào Album
 * =====================================================
 * 
 * Mô tả: Component modal popup để thêm một ảnh vào album
 * Được gọi từ: PhotoLibrary.jsx, PhotoDetails.jsx
 * 
 * Các chức năng chính:
 * - Hiển thị danh sách album hiện có
 * - Thêm ảnh vào album có sẵn (1 click)
 * - Tạo album mới và thêm ảnh ngay
 * 
 * Props:
 * @param {string} photoId - ID của ảnh cần thêm vào album
 * @param {string} photoName - Tên ảnh (hiển thị tiêu đề)
 * @param {function} onClose - Callback đóng modal
 * @param {function} onSuccess - Callback khi thêm thành công (nhận tên album)
 * 
 * @author GeoPhoto Team
 */

import { useState, useEffect } from 'react'
import { fetchAllAlbums, addPhotoToAlbum, createAlbum } from '../../services/albumService'

const AddToAlbum = ({ photoId, photoName, onClose, onSuccess }) => {
  // ==================== STATES ====================
  
  // Danh sách album để user chọn
  const [albums, setAlbums] = useState([])
  
  // Trạng thái loading
  const [loading, setLoading] = useState(true)
  
  // ID album đang được thêm ảnh (hiển thị spinner)
  const [adding, setAdding] = useState(null)
  
  // Hiển thị form tạo album mới
  const [showCreate, setShowCreate] = useState(false)
  
  // Dữ liệu form tạo album mới
  const [newAlbumName, setNewAlbumName] = useState('')
  const [creating, setCreating] = useState(false)

  // ==================== EFFECTS ====================

  /**
   * Effect: Tải danh sách albums khi component mount
   */
  useEffect(() => {
    loadAlbums()
  }, [])

  // ==================== HANDLERS ====================

  /**
   * Hàm tải danh sách albums từ API
   */
  const loadAlbums = async () => {
    try {
      setLoading(true)
      const data = await fetchAllAlbums()
      setAlbums(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Lỗi khi tải albums:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Hàm thêm ảnh vào album có sẵn
   * 
   * @param {string} albumId - ID album
   * @param {string} albumName - Tên album (để hiển thị thông báo)
   */
  const handleAddToAlbum = async (albumId, albumName) => {
    try {
      setAdding(albumId)
      await addPhotoToAlbum(albumId, photoId)
      // Callback thông báo thành công
      onSuccess?.(albumName)
      onClose()
    } catch (err) {
      console.error('Lỗi khi thêm ảnh vào album:', err)
      alert(err.response?.data?.message || 'Không thể thêm ảnh vào album')
    } finally {
      setAdding(null)
    }
  }

  /**
   * Hàm tạo album mới và thêm ảnh ngay vào album đó
   * Tiện lợi khi user chưa có album nào
   */
  const handleCreateAndAdd = async () => {
    if (!newAlbumName.trim()) return
    
    try {
      setCreating(true)
      // Bước 1: Tạo album mới
      const newAlbum = await createAlbum(newAlbumName.trim())
      // Bước 2: Thêm ảnh vào album vừa tạo
      await addPhotoToAlbum(newAlbum.id, photoId)
      // Callback thông báo thành công
      onSuccess?.(newAlbum.name)
      onClose()
    } catch (err) {
      console.error('Lỗi khi tạo album:', err)
      alert(err.response?.data?.message || 'Không thể tạo album')
    } finally {
      setCreating(false)
    }
  }

  // ==================== RENDER ====================

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-white/10 shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Thêm vào Album</h3>
            <p className="text-sm text-gray-400 truncate mt-1">
              {photoName}
            </p>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Create New Album */}
              {!showCreate ? (
                <button
                  onClick={() => setShowCreate(true)}
                  className="w-full p-3 border-2 border-dashed border-blue-500/50 rounded-xl text-blue-400 hover:border-blue-500 hover:text-blue-300 hover:bg-blue-500/10 transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tạo album mới
                </button>
              ) : (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <input
                    type="text"
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    placeholder="Tên album mới..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-2"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowCreate(false)
                        setNewAlbumName('')
                      }}
                      className="flex-1 px-3 py-1.5 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition text-sm"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleCreateAndAdd}
                      disabled={!newAlbumName.trim() || creating}
                      className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      {creating ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Tạo & Thêm
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Divider */}
              {albums.length > 0 && (
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-white/10"></div>
                  <span className="text-xs text-gray-500">hoặc chọn album</span>
                  <div className="flex-1 h-px bg-white/10"></div>
                </div>
              )}

              {/* Album List */}
              {albums.length === 0 && !showCreate ? (
                <div className="text-center py-4 text-gray-400">
                  <p>Chưa có album nào</p>
                  <p className="text-sm">Tạo album mới để bắt đầu!</p>
                </div>
              ) : (
                albums.map((album) => (
                  <button
                    key={album.id}
                    onClick={() => handleAddToAlbum(album.id, album.name)}
                    disabled={adding === album.id}
                    className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl transition flex items-center gap-3 group disabled:opacity-50"
                  >
                    {/* Album Cover */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex-shrink-0">
                      {album.coverPhotoUrl ? (
                        <img
                          src={`http://${window.location.hostname}:8080${album.coverPhotoUrl}`}
                          alt={album.name}
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Album Info */}
                    <div className="flex-1 text-left min-w-0">
                      <h4 className="text-white font-medium truncate">{album.name}</h4>
                      <p className="text-sm text-gray-400">{album.photoCount} ảnh</p>
                    </div>

                    {/* Add Icon */}
                    {adding === album.id ? (
                      <div className="w-8 h-8 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddToAlbum
