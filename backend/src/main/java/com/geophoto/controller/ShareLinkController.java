package com.geophoto.controller;

import com.geophoto.dto.ShareLinkDTO;
import com.geophoto.entity.ShareLink.ShareType;
import com.geophoto.entity.User;
import com.geophoto.service.ShareLinkService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * =====================================================
 * ShareLinkController - REST API Controller cho Chia sẻ
 * =====================================================
 * 
 * Mô tả: Cung cấp các endpoint REST API để quản lý link chia sẻ
 * 
 * Base URL: /api/shares
 * 
 * Danh sách API:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ Method │ Endpoint                    │ Chức năng                        │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ POST   │ /api/shares/photo           │ Tạo link chia sẻ cho ảnh         │
 * │ POST   │ /api/shares/album           │ Tạo link chia sẻ cho album       │
 * │ GET    │ /api/shares                 │ Lấy tất cả links của user        │
 * │ GET    │ /api/shares/{id}            │ Lấy chi tiết link (owner)        │
 * │ DELETE │ /api/shares/{id}            │ Xóa link chia sẻ                 │
 * │ PUT    │ /api/shares/{id}/deactivate │ Hủy kích hoạt link               │
 * │ GET    │ /api/shares/target/{type}/{id} │ Lấy links cho Photo/Album    │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * Public API (không cần auth):
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ GET    │ /api/public/share/{code}       │ Lấy thông tin link           │
 * │ POST   │ /api/public/share/{code}/view  │ Xem nội dung (có thể cần MK) │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * @author GeoPhoto Team
 */
@RestController
@RequiredArgsConstructor
@Slf4j
public class ShareLinkController {
    
    private final ShareLinkService shareLinkService;
    
    // ==================== HELPER ====================
    
    /**
     * Lấy thông tin user đang đăng nhập
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }
    
    // ==================== PRIVATE APIs (yêu cầu auth) ====================
    
    /**
     * API: Tạo link chia sẻ cho ảnh
     * 
     * Endpoint: POST /api/shares/photo
     * Body: CreateShareRequest
     */
    @PostMapping("/api/shares/photo")
    public ResponseEntity<?> createPhotoShareLink(@RequestBody CreateShareRequest request) {
        try {
            User currentUser = getCurrentUser();
            log.info("Tạo link chia sẻ ảnh {} cho user: {}", request.getTargetId(), currentUser.getUsername());
            
            ShareLinkDTO shareLink = shareLinkService.createPhotoShareLink(
                    request.getTargetId(),
                    currentUser.getId(),
                    request.getTitle(),
                    request.getDescription(),
                    request.getPassword(),
                    request.getExpiresInHours()
            );
            
            return ResponseEntity.ok(shareLink);
        } catch (RuntimeException e) {
            log.error("Lỗi tạo link chia sẻ ảnh: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * API: Tạo link chia sẻ cho album
     * 
     * Endpoint: POST /api/shares/album
     * Body: CreateShareRequest
     */
    @PostMapping("/api/shares/album")
    public ResponseEntity<?> createAlbumShareLink(@RequestBody CreateShareRequest request) {
        try {
            User currentUser = getCurrentUser();
            log.info("Tạo link chia sẻ album {} cho user: {}", request.getTargetId(), currentUser.getUsername());
            
            ShareLinkDTO shareLink = shareLinkService.createAlbumShareLink(
                    request.getTargetId(),
                    currentUser.getId(),
                    request.getTitle(),
                    request.getDescription(),
                    request.getPassword(),
                    request.getExpiresInHours()
            );
            
            return ResponseEntity.ok(shareLink);
        } catch (RuntimeException e) {
            log.error("Lỗi tạo link chia sẻ album: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * API: Lấy tất cả link chia sẻ của user
     * 
     * Endpoint: GET /api/shares
     */
    @GetMapping("/api/shares")
    public ResponseEntity<List<ShareLinkDTO>> getAllShareLinks() {
        User currentUser = getCurrentUser();
        log.info("Lấy danh sách link chia sẻ cho user: {}", currentUser.getUsername());
        List<ShareLinkDTO> links = shareLinkService.getUserShareLinks(currentUser.getId());
        return ResponseEntity.ok(links);
    }
    
    /**
     * API: Lấy chi tiết một link chia sẻ (cho owner)
     * 
     * Endpoint: GET /api/shares/{id}
     */
    @GetMapping("/api/shares/{id}")
    public ResponseEntity<?> getShareLinkById(@PathVariable String id) {
        try {
            User currentUser = getCurrentUser();
            ShareLinkDTO shareLink = shareLinkService.getShareLinkById(id, currentUser.getId());
            return ResponseEntity.ok(shareLink);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * API: Hủy kích hoạt link chia sẻ
     * 
     * Endpoint: PUT /api/shares/{id}/deactivate
     */
    @PutMapping("/api/shares/{id}/deactivate")
    public ResponseEntity<?> deactivateShareLink(@PathVariable String id) {
        try {
            User currentUser = getCurrentUser();
            shareLinkService.deactivateShareLink(id, currentUser.getId());
            return ResponseEntity.ok(Map.of("message", "Đã hủy link chia sẻ"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * API: Xóa link chia sẻ hoàn toàn
     * 
     * Endpoint: DELETE /api/shares/{id}
     */
    @DeleteMapping("/api/shares/{id}")
    public ResponseEntity<?> deleteShareLink(@PathVariable String id) {
        try {
            User currentUser = getCurrentUser();
            shareLinkService.deleteShareLink(id, currentUser.getId());
            return ResponseEntity.ok(Map.of("message", "Đã xóa link chia sẻ"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * API: Lấy các link chia sẻ đang active cho Photo/Album
     * 
     * Endpoint: GET /api/shares/target/{type}/{targetId}
     */
    @GetMapping("/api/shares/target/{type}/{targetId}")
    public ResponseEntity<List<ShareLinkDTO>> getShareLinksForTarget(
            @PathVariable String type,
            @PathVariable String targetId) {
        User currentUser = getCurrentUser();
        ShareType shareType = "album".equalsIgnoreCase(type) ? ShareType.ALBUM : ShareType.PHOTO;
        List<ShareLinkDTO> links = shareLinkService.getActiveShareLinksForTarget(
                targetId, shareType, currentUser.getId());
        return ResponseEntity.ok(links);
    }
    
    // ==================== PUBLIC APIs (không cần auth) ====================
    
    /**
     * API PUBLIC: Lấy thông tin link chia sẻ
     * Kiểm tra có cần mật khẩu không
     * 
     * Endpoint: GET /api/public/share/{code}
     */
    @GetMapping("/api/public/share/{code}")
    public ResponseEntity<?> getPublicShareInfo(@PathVariable String code) {
        try {
            ShareLinkDTO shareInfo = shareLinkService.getShareLinkInfo(code);
            return ResponseEntity.ok(shareInfo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * API PUBLIC: Xem nội dung chia sẻ
     * Có thể yêu cầu mật khẩu
     * 
     * Endpoint: POST /api/public/share/{code}/view
     * Body: { password: "..." } (optional)
     */
    @PostMapping("/api/public/share/{code}/view")
    public ResponseEntity<?> viewSharedContent(
            @PathVariable String code,
            @RequestBody(required = false) ViewShareRequest request) {
        try {
            String password = request != null ? request.getPassword() : null;
            ShareLinkDTO content = shareLinkService.viewSharedContent(code, password);
            return ResponseEntity.ok(content);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("mật khẩu")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", e.getMessage(), "requirePassword", true));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // ==================== REQUEST DTOs ====================
    
    /**
     * Request tạo link chia sẻ
     */
    @Data
    public static class CreateShareRequest {
        /**
         * ID của Photo hoặc Album cần chia sẻ
         */
        private String targetId;
        
        /**
         * Tiêu đề hiển thị (tùy chọn)
         */
        private String title;
        
        /**
         * Mô tả (tùy chọn)
         */
        private String description;
        
        /**
         * Mật khẩu bảo vệ (tùy chọn)
         */
        private String password;
        
        /**
         * Số giờ hết hạn (tùy chọn, null = không hết hạn)
         */
        private Integer expiresInHours;
    }
    
    /**
     * Request xem nội dung chia sẻ
     */
    @Data
    public static class ViewShareRequest {
        /**
         * Mật khẩu (nếu link có bảo vệ)
         */
        private String password;
    }
}
