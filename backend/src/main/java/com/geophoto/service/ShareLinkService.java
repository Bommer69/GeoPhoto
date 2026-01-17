package com.geophoto.service;

import com.geophoto.dto.AlbumDTO;
import com.geophoto.dto.PhotoDTO;
import com.geophoto.dto.ShareLinkDTO;
import com.geophoto.entity.Album;
import com.geophoto.entity.Photo;
import com.geophoto.entity.ShareLink;
import com.geophoto.entity.ShareLink.ShareType;
import com.geophoto.repository.AlbumRepository;
import com.geophoto.repository.PhotoRepository;
import com.geophoto.repository.ShareLinkRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * =====================================================
 * ShareLinkService - Service xử lý logic Link chia sẻ
 * =====================================================
 * 
 * Mô tả: Chứa các phương thức xử lý business logic liên quan đến chia sẻ
 * 
 * Các chức năng chính:
 * - Tạo link chia sẻ cho Photo/Album
 * - Xác thực mật khẩu
 * - Lấy nội dung chia sẻ (public)
 * - Quản lý link (hủy, gia hạn)
 * 
 * @author GeoPhoto Team
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ShareLinkService {
    
    private final ShareLinkRepository shareLinkRepository;
    private final PhotoRepository photoRepository;
    private final AlbumRepository albumRepository;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * URL frontend để tạo share link đầy đủ
     */
    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;
    
    // ==================== TẠO LINK CHIA SẺ ====================
    
    /**
     * Tạo link chia sẻ cho Photo
     * 
     * @param photoId ID của ảnh
     * @param userId ID của user tạo
     * @param title Tiêu đề (null = dùng tên file)
     * @param description Mô tả
     * @param password Mật khẩu (null = không bảo vệ)
     * @param expiresInHours Số giờ hết hạn (null = không hết hạn)
     * @return ShareLinkDTO
     */
    public ShareLinkDTO createPhotoShareLink(
            String photoId, 
            String userId,
            String title,
            String description,
            String password,
            Integer expiresInHours) {
        
        // Kiểm tra ảnh tồn tại và thuộc về user
        Photo photo = photoRepository.findByIdAndUserId(photoId, userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ảnh hoặc không có quyền"));
        
        // Tạo link chia sẻ
        ShareLink shareLink = new ShareLink();
        shareLink.setShareCode(generateUniqueShareCode());
        shareLink.setType(ShareType.PHOTO);
        shareLink.setTargetId(photoId);
        shareLink.setUserId(userId);
        shareLink.setTitle(title != null ? title : photo.getFileName());
        shareLink.setDescription(description);
        
        // Xử lý mật khẩu
        if (password != null && !password.isEmpty()) {
            shareLink.setPassword(passwordEncoder.encode(password));
            shareLink.setPasswordProtected(true);
        }
        
        // Xử lý thời hạn
        if (expiresInHours != null && expiresInHours > 0) {
            shareLink.setExpiresAt(LocalDateTime.now().plusHours(expiresInHours));
        }
        
        ShareLink saved = shareLinkRepository.save(shareLink);
        log.info("Đã tạo link chia sẻ ảnh: {} cho user: {}", saved.getShareCode(), userId);
        
        return convertToDTO(saved);
    }
    
    /**
     * Tạo link chia sẻ cho Album
     * 
     * @param albumId ID của album
     * @param userId ID của user tạo
     * @param title Tiêu đề (null = dùng tên album)
     * @param description Mô tả
     * @param password Mật khẩu (null = không bảo vệ)
     * @param expiresInHours Số giờ hết hạn (null = không hết hạn)
     * @return ShareLinkDTO
     */
    public ShareLinkDTO createAlbumShareLink(
            String albumId,
            String userId,
            String title,
            String description,
            String password,
            Integer expiresInHours) {
        
        // Kiểm tra album tồn tại và thuộc về user
        Album album = albumRepository.findByIdAndUserId(albumId, userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy album hoặc không có quyền"));
        
        // Tạo link chia sẻ
        ShareLink shareLink = new ShareLink();
        shareLink.setShareCode(generateUniqueShareCode());
        shareLink.setType(ShareType.ALBUM);
        shareLink.setTargetId(albumId);
        shareLink.setUserId(userId);
        shareLink.setTitle(title != null ? title : album.getName());
        shareLink.setDescription(description != null ? description : album.getDescription());
        
        // Xử lý mật khẩu
        if (password != null && !password.isEmpty()) {
            shareLink.setPassword(passwordEncoder.encode(password));
            shareLink.setPasswordProtected(true);
        }
        
        // Xử lý thời hạn
        if (expiresInHours != null && expiresInHours > 0) {
            shareLink.setExpiresAt(LocalDateTime.now().plusHours(expiresInHours));
        }
        
        ShareLink saved = shareLinkRepository.save(shareLink);
        log.info("Đã tạo link chia sẻ album: {} cho user: {}", saved.getShareCode(), userId);
        
        return convertToDTO(saved);
    }
    
    // ==================== XEM NỘI DUNG CHIA SẺ (PUBLIC) ====================
    
    /**
     * Lấy thông tin link chia sẻ (kiểm tra có cần mật khẩu không)
     * 
     * @param shareCode Mã chia sẻ
     * @return ShareLinkDTO với thông tin cơ bản
     */
    public ShareLinkDTO getShareLinkInfo(String shareCode) {
        ShareLink shareLink = shareLinkRepository.findByShareCode(shareCode)
                .orElseThrow(() -> new RuntimeException("Link chia sẻ không tồn tại"));
        
        if (!shareLink.isAccessible()) {
            throw new RuntimeException("Link chia sẻ đã hết hạn hoặc bị vô hiệu");
        }
        
        // Trả về thông tin cơ bản (không bao gồm nội dung)
        ShareLinkDTO dto = new ShareLinkDTO();
        dto.setId(shareLink.getId());
        dto.setShareCode(shareLink.getShareCode());
        dto.setType(shareLink.getType());
        dto.setTitle(shareLink.getTitle());
        dto.setDescription(shareLink.getDescription());
        dto.setPasswordProtected(shareLink.isPasswordProtected());
        dto.setViewCount(shareLink.getViewCount());
        
        return dto;
    }
    
    /**
     * Xem nội dung chia sẻ (có thể yêu cầu mật khẩu)
     * 
     * @param shareCode Mã chia sẻ
     * @param password Mật khẩu (nếu có)
     * @return ShareLinkDTO với nội dung đầy đủ
     */
    public ShareLinkDTO viewSharedContent(String shareCode, String password) {
        ShareLink shareLink = shareLinkRepository.findByShareCode(shareCode)
                .orElseThrow(() -> new RuntimeException("Link chia sẻ không tồn tại"));
        
        if (!shareLink.isAccessible()) {
            throw new RuntimeException("Link chia sẻ đã hết hạn hoặc bị vô hiệu");
        }
        
        // Kiểm tra mật khẩu
        if (shareLink.isPasswordProtected()) {
            if (password == null || password.isEmpty()) {
                throw new RuntimeException("Link này yêu cầu mật khẩu");
            }
            if (!passwordEncoder.matches(password, shareLink.getPassword())) {
                throw new RuntimeException("Mật khẩu không đúng");
            }
        }
        
        // Tăng lượt xem
        shareLink.incrementViewCount();
        shareLinkRepository.save(shareLink);
        
        // Lấy nội dung và trả về
        return convertToDTOWithContent(shareLink);
    }
    
    // ==================== QUẢN LÝ LINK ====================
    
    /**
     * Lấy tất cả link chia sẻ của user
     * 
     * @param userId ID của user
     * @return Danh sách ShareLinkDTO
     */
    public List<ShareLinkDTO> getUserShareLinks(String userId) {
        List<ShareLink> links = shareLinkRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return links.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Lấy chi tiết một link chia sẻ (cho owner)
     * 
     * @param id ID của link
     * @param userId ID của user
     * @return ShareLinkDTO
     */
    public ShareLinkDTO getShareLinkById(String id, String userId) {
        ShareLink shareLink = shareLinkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Link không tồn tại"));
        
        if (!shareLink.getUserId().equals(userId)) {
            throw new RuntimeException("Không có quyền truy cập link này");
        }
        
        return convertToDTOWithContent(shareLink);
    }
    
    /**
     * Hủy link chia sẻ
     * 
     * @param id ID của link
     * @param userId ID của user
     */
    public void deactivateShareLink(String id, String userId) {
        ShareLink shareLink = shareLinkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Link không tồn tại"));
        
        if (!shareLink.getUserId().equals(userId)) {
            throw new RuntimeException("Không có quyền hủy link này");
        }
        
        shareLink.setActive(false);
        shareLink.setUpdatedAt(LocalDateTime.now());
        shareLinkRepository.save(shareLink);
        
        log.info("Đã hủy link chia sẻ: {} bởi user: {}", shareLink.getShareCode(), userId);
    }
    
    /**
     * Xóa link chia sẻ hoàn toàn
     * 
     * @param id ID của link
     * @param userId ID của user
     */
    public void deleteShareLink(String id, String userId) {
        ShareLink shareLink = shareLinkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Link không tồn tại"));
        
        if (!shareLink.getUserId().equals(userId)) {
            throw new RuntimeException("Không có quyền xóa link này");
        }
        
        shareLinkRepository.delete(shareLink);
        log.info("Đã xóa link chia sẻ: {} bởi user: {}", shareLink.getShareCode(), userId);
    }
    
    /**
     * Lấy link chia sẻ đang active cho một target
     * 
     * @param targetId ID của Photo/Album
     * @param type Loại
     * @param userId ID của user
     * @return Danh sách ShareLinkDTO
     */
    public List<ShareLinkDTO> getActiveShareLinksForTarget(String targetId, ShareType type, String userId) {
        List<ShareLink> links = shareLinkRepository.findByTargetIdAndTypeAndUserIdAndActive(
                targetId, type, userId, true);
        return links.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // ==================== HELPER METHODS ====================
    
    /**
     * Sinh mã chia sẻ duy nhất
     * Format: 8 ký tự ngẫu nhiên
     */
    private String generateUniqueShareCode() {
        String code;
        do {
            code = UUID.randomUUID().toString().substring(0, 8);
        } while (shareLinkRepository.existsByShareCode(code));
        return code;
    }
    
    /**
     * Chuyển đổi Entity sang DTO (không bao gồm content)
     */
    private ShareLinkDTO convertToDTO(ShareLink shareLink) {
        ShareLinkDTO dto = new ShareLinkDTO();
        dto.setId(shareLink.getId());
        dto.setShareCode(shareLink.getShareCode());
        dto.setShareUrl(frontendUrl + "/share/" + shareLink.getShareCode());
        dto.setType(shareLink.getType());
        dto.setTargetId(shareLink.getTargetId());
        dto.setTitle(shareLink.getTitle());
        dto.setDescription(shareLink.getDescription());
        dto.setPasswordProtected(shareLink.isPasswordProtected());
        dto.setExpiresAt(shareLink.getExpiresAt());
        dto.setActive(shareLink.isActive());
        dto.setExpired(shareLink.isExpired());
        dto.setViewCount(shareLink.getViewCount());
        dto.setCreatedAt(shareLink.getCreatedAt());
        return dto;
    }
    
    /**
     * Chuyển đổi Entity sang DTO (bao gồm content)
     */
    private ShareLinkDTO convertToDTOWithContent(ShareLink shareLink) {
        ShareLinkDTO dto = convertToDTO(shareLink);
        
        if (shareLink.getType() == ShareType.PHOTO) {
            // Lấy thông tin ảnh
            photoRepository.findById(shareLink.getTargetId()).ifPresent(photo -> {
                PhotoDTO photoDTO = new PhotoDTO();
                photoDTO.setId(photo.getId());
                photoDTO.setFileName(photo.getFileName());
                photoDTO.setUrl(photo.getUrl());
                photoDTO.setLatitude(photo.getLatitude());
                photoDTO.setLongitude(photo.getLongitude());
                photoDTO.setTakenAt(photo.getTakenAt());
                photoDTO.setUploadedAt(photo.getUploadedAt());
                dto.setPhoto(photoDTO);
            });
        } else if (shareLink.getType() == ShareType.ALBUM) {
            // Lấy thông tin album và ảnh trong album
            albumRepository.findById(shareLink.getTargetId()).ifPresent(album -> {
                AlbumDTO albumDTO = new AlbumDTO();
                albumDTO.setId(album.getId());
                albumDTO.setName(album.getName());
                albumDTO.setDescription(album.getDescription());
                albumDTO.setPhotoCount(album.getPhotoCount());
                albumDTO.setCreatedAt(album.getCreatedAt());
                dto.setAlbum(albumDTO);
                
                // Lấy danh sách ảnh trong album
                if (album.getPhotoIds() != null && !album.getPhotoIds().isEmpty()) {
                    List<PhotoDTO> photos = album.getPhotoIds().stream()
                            .map(photoId -> photoRepository.findById(photoId).orElse(null))
                            .filter(photo -> photo != null)
                            .map(photo -> {
                                PhotoDTO p = new PhotoDTO();
                                p.setId(photo.getId());
                                p.setFileName(photo.getFileName());
                                p.setUrl(photo.getUrl());
                                p.setLatitude(photo.getLatitude());
                                p.setLongitude(photo.getLongitude());
                                p.setTakenAt(photo.getTakenAt());
                                return p;
                            })
                            .collect(Collectors.toList());
                    dto.setPhotos(photos);
                }
            });
        }
        
        return dto;
    }
}
