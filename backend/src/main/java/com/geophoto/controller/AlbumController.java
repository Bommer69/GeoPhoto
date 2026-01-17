package com.geophoto.controller;

import com.geophoto.dto.AlbumDTO;
import com.geophoto.entity.User;
import com.geophoto.service.AlbumService;
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
 * AlbumController - REST API Controller cho quản lý Album/Bộ sưu tập
 * 
 * Mô tả: Cung cấp các endpoint REST API để thao tác với album
 * Base URL: /api/albums
 * 
 * Danh sách API:
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ Method │ Endpoint                        │ Chức năng               │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ GET    │ /api/albums                     │ Lấy tất cả albums       │
 * │ GET    │ /api/albums/{id}                │ Lấy chi tiết album      │
 * │ POST   │ /api/albums                     │ Tạo album mới           │
 * │ PUT    │ /api/albums/{id}                │ Cập nhật album          │
 * │ DELETE │ /api/albums/{id}                │ Xóa album               │
 * │ POST   │ /api/albums/{id}/photos/{pId}   │ Thêm 1 ảnh vào album    │
 * │ DELETE │ /api/albums/{id}/photos/{pId}   │ Xóa 1 ảnh khỏi album    │
 * │ POST   │ /api/albums/{id}/photos         │ Thêm nhiều ảnh          │
 * │ GET    │ /api/albums/photo/{photoId}     │ Tìm albums chứa ảnh     │
 * └─────────────────────────────────────────────────────────────────────┘
 * 
 * Bảo mật: Tất cả endpoint đều yêu cầu JWT token
 * 
 * @author GeoPhoto Team
 */
@RestController
@RequestMapping("/api/albums")
@RequiredArgsConstructor
@Slf4j
public class AlbumController {
    
    // Service xử lý logic nghiệp vụ album
    private final AlbumService albumService;
    
    /**
     * Helper method: Lấy thông tin user đang đăng nhập từ SecurityContext
     * 
     * @return User entity của user hiện tại
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }
    
    /**
     * API: Lấy tất cả album của user hiện tại
     * 
     * Endpoint: GET /api/albums
     * Response: Danh sách AlbumDTO (sắp xếp mới nhất trước)
     */
    @GetMapping
    public ResponseEntity<List<AlbumDTO>> getAllAlbums() {
        User currentUser = getCurrentUser();
        log.info("Đang lấy danh sách albums cho user: {}", currentUser.getUsername());
        List<AlbumDTO> albums = albumService.getAllAlbumsByUser(currentUser.getId());
        return ResponseEntity.ok(albums);
    }
    
    /**
     * API: Lấy chi tiết một album (bao gồm danh sách ảnh)
     * 
     * Endpoint: GET /api/albums/{id}
     * Path Param: id - ID của album
     * Response: AlbumDTO với photos đầy đủ
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getAlbumById(@PathVariable String id) {
        try {
            User currentUser = getCurrentUser();
            log.info("Đang lấy album {} cho user: {}", id, currentUser.getUsername());
            AlbumDTO album = albumService.getAlbumById(id, currentUser.getId());
            return ResponseEntity.ok(album);
        } catch (RuntimeException e) {
            log.error("Error fetching album {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * POST /api/albums
     * Create a new album
     */
    @PostMapping
    public ResponseEntity<?> createAlbum(@RequestBody CreateAlbumRequest request) {
        try {
            User currentUser = getCurrentUser();
            log.info("Creating album '{}' for user: {}", request.getName(), currentUser.getUsername());
            
            AlbumDTO album = albumService.createAlbum(
                    request.getName(),
                    request.getDescription(),
                    currentUser.getId()
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(album);
        } catch (RuntimeException e) {
            log.error("Error creating album: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * PUT /api/albums/{id}
     * Update album details
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAlbum(
            @PathVariable String id,
            @RequestBody UpdateAlbumRequest request) {
        try {
            User currentUser = getCurrentUser();
            log.info("Updating album {} for user: {}", id, currentUser.getUsername());
            
            AlbumDTO album = albumService.updateAlbum(
                    id,
                    request.getName(),
                    request.getDescription(),
                    request.getCoverPhotoId(),
                    currentUser.getId()
            );
            
            return ResponseEntity.ok(album);
        } catch (RuntimeException e) {
            log.error("Error updating album {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * DELETE /api/albums/{id}
     * Delete an album
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAlbum(@PathVariable String id) {
        try {
            User currentUser = getCurrentUser();
            log.info("Deleting album {} for user: {}", id, currentUser.getUsername());
            
            albumService.deleteAlbum(id, currentUser.getId());
            
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Error deleting album {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * POST /api/albums/{albumId}/photos/{photoId}
     * Add a photo to album
     */
    @PostMapping("/{albumId}/photos/{photoId}")
    public ResponseEntity<?> addPhotoToAlbum(
            @PathVariable String albumId,
            @PathVariable String photoId) {
        try {
            User currentUser = getCurrentUser();
            log.info("Adding photo {} to album {} for user: {}", photoId, albumId, currentUser.getUsername());
            
            AlbumDTO album = albumService.addPhotoToAlbum(albumId, photoId, currentUser.getId());
            
            return ResponseEntity.ok(album);
        } catch (RuntimeException e) {
            log.error("Error adding photo to album: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * DELETE /api/albums/{albumId}/photos/{photoId}
     * Remove a photo from album
     */
    @DeleteMapping("/{albumId}/photos/{photoId}")
    public ResponseEntity<?> removePhotoFromAlbum(
            @PathVariable String albumId,
            @PathVariable String photoId) {
        try {
            User currentUser = getCurrentUser();
            log.info("Removing photo {} from album {} for user: {}", photoId, albumId, currentUser.getUsername());
            
            AlbumDTO album = albumService.removePhotoFromAlbum(albumId, photoId, currentUser.getId());
            
            return ResponseEntity.ok(album);
        } catch (RuntimeException e) {
            log.error("Error removing photo from album: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * POST /api/albums/{albumId}/photos
     * Add multiple photos to album
     */
    @PostMapping("/{albumId}/photos")
    public ResponseEntity<?> addPhotosToAlbum(
            @PathVariable String albumId,
            @RequestBody AddPhotosRequest request) {
        try {
            User currentUser = getCurrentUser();
            log.info("Adding {} photos to album {} for user: {}", 
                    request.getPhotoIds().size(), albumId, currentUser.getUsername());
            
            AlbumDTO album = albumService.addPhotosToAlbum(
                    albumId, 
                    request.getPhotoIds(), 
                    currentUser.getId()
            );
            
            return ResponseEntity.ok(album);
        } catch (RuntimeException e) {
            log.error("Error adding photos to album: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * GET /api/albums/photo/{photoId}
     * Get albums containing a specific photo
     */
    @GetMapping("/photo/{photoId}")
    public ResponseEntity<List<AlbumDTO>> getAlbumsContainingPhoto(@PathVariable String photoId) {
        User currentUser = getCurrentUser();
        log.info("Fetching albums containing photo {} for user: {}", photoId, currentUser.getUsername());
        List<AlbumDTO> albums = albumService.getAlbumsContainingPhoto(photoId, currentUser.getId());
        return ResponseEntity.ok(albums);
    }
    
    // Request DTOs
    
    public static class CreateAlbumRequest {
        private String name;
        private String description;
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
    
    public static class UpdateAlbumRequest {
        private String name;
        private String description;
        private String coverPhotoId;
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getCoverPhotoId() { return coverPhotoId; }
        public void setCoverPhotoId(String coverPhotoId) { this.coverPhotoId = coverPhotoId; }
    }
    
    public static class AddPhotosRequest {
        private List<String> photoIds;
        
        public List<String> getPhotoIds() { return photoIds; }
        public void setPhotoIds(List<String> photoIds) { this.photoIds = photoIds; }
    }
}
