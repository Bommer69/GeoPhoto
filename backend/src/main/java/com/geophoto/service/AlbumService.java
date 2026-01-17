package com.geophoto.service;

import com.geophoto.dto.AlbumDTO;
import com.geophoto.dto.PhotoDTO;
import com.geophoto.entity.Album;
import com.geophoto.entity.Photo;
import com.geophoto.repository.AlbumRepository;
import com.geophoto.repository.PhotoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * AlbumService - Service xử lý logic nghiệp vụ cho Album
 * 
 * Mô tả: Chứa các phương thức xử lý business logic liên quan đến album
 * Được gọi từ AlbumController, truy vấn dữ liệu qua Repository
 * 
 * Các chức năng chính:
 * - Lấy danh sách album của user
 * - Tạo/sửa/xóa album
 * - Thêm/xóa ảnh vào album
 * - Chuyển đổi Entity sang DTO
 * 
 * @author GeoPhoto Team
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AlbumService {
    
    // Repository để truy vấn Album
    private final AlbumRepository albumRepository;
    
    // Repository để truy vấn Photo (lấy thông tin ảnh trong album)
    private final PhotoRepository photoRepository;
    
    /**
     * Lấy tất cả album của một user
     * 
     * @param userId ID của user đang đăng nhập
     * @return Danh sách AlbumDTO (không bao gồm danh sách ảnh chi tiết)
     */
    public List<AlbumDTO> getAllAlbumsByUser(String userId) {
        List<Album> albums = albumRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return albums.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Lấy chi tiết một album theo ID (bao gồm danh sách ảnh)
     * 
     * @param id ID của album
     * @param userId ID của user (để kiểm tra quyền sở hữu)
     * @return AlbumDTO với danh sách photos đầy đủ
     * @throws RuntimeException nếu không tìm thấy album
     */
    public AlbumDTO getAlbumById(String id, String userId) {
        Album album = albumRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy album với id: " + id));
        return convertToDTOWithPhotos(album);
    }
    
    /**
     * Tạo album mới
     * 
     * @param name Tên album
     * @param description Mô tả album (có thể null)
     * @param userId ID của user tạo album
     * @return AlbumDTO của album vừa tạo
     * @throws RuntimeException nếu tên album đã tồn tại
     */
    public AlbumDTO createAlbum(String name, String description, String userId) {
        // Kiểm tra tên album trùng lặp
        if (albumRepository.existsByNameAndUserId(name, userId)) {
            throw new RuntimeException("Album với tên này đã tồn tại");
        }
        
        Album album = new Album();
        album.setName(name);
        album.setDescription(description);
        album.setUserId(userId);
        album.setPhotoIds(new ArrayList<>());
        album.setCreatedAt(LocalDateTime.now());
        album.setUpdatedAt(LocalDateTime.now());
        
        Album savedAlbum = albumRepository.save(album);
        log.info("Created album '{}' for user {}", name, userId);
        
        return convertToDTO(savedAlbum);
    }
    
    /**
     * Update album details
     */
    public AlbumDTO updateAlbum(String id, String name, String description, String coverPhotoId, String userId) {
        Album album = albumRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Album not found with id: " + id));
        
        // Check for duplicate name (excluding current album)
        if (!album.getName().equals(name) && albumRepository.existsByNameAndUserId(name, userId)) {
            throw new RuntimeException("Album với tên này đã tồn tại");
        }
        
        album.setName(name);
        album.setDescription(description);
        if (coverPhotoId != null) {
            album.setCoverPhotoId(coverPhotoId);
        }
        album.setUpdatedAt(LocalDateTime.now());
        
        Album updatedAlbum = albumRepository.save(album);
        log.info("Updated album '{}' (id: {})", name, id);
        
        return convertToDTO(updatedAlbum);
    }
    
    /**
     * Delete an album
     */
    public void deleteAlbum(String id, String userId) {
        Album album = albumRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Album not found with id: " + id));
        
        albumRepository.delete(album);
        log.info("Deleted album '{}' (id: {})", album.getName(), id);
    }
    
    /**
     * Add photo to album
     */
    public AlbumDTO addPhotoToAlbum(String albumId, String photoId, String userId) {
        Album album = albumRepository.findByIdAndUserId(albumId, userId)
                .orElseThrow(() -> new RuntimeException("Album not found with id: " + albumId));
        
        // Verify photo exists and belongs to user
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Photo not found with id: " + photoId));
        
        if (!photo.getUserId().equals(userId)) {
            throw new RuntimeException("Photo does not belong to user");
        }
        
        album.addPhoto(photoId);
        
        // Set as cover if first photo
        if (album.getCoverPhotoId() == null) {
            album.setCoverPhotoId(photoId);
        }
        
        Album updatedAlbum = albumRepository.save(album);
        log.info("Added photo {} to album '{}'", photoId, album.getName());
        
        return convertToDTO(updatedAlbum);
    }
    
    /**
     * Remove photo from album
     */
    public AlbumDTO removePhotoFromAlbum(String albumId, String photoId, String userId) {
        Album album = albumRepository.findByIdAndUserId(albumId, userId)
                .orElseThrow(() -> new RuntimeException("Album not found with id: " + albumId));
        
        album.removePhoto(photoId);
        
        Album updatedAlbum = albumRepository.save(album);
        log.info("Removed photo {} from album '{}'", photoId, album.getName());
        
        return convertToDTO(updatedAlbum);
    }
    
    /**
     * Add multiple photos to album
     */
    public AlbumDTO addPhotosToAlbum(String albumId, List<String> photoIds, String userId) {
        Album album = albumRepository.findByIdAndUserId(albumId, userId)
                .orElseThrow(() -> new RuntimeException("Album not found with id: " + albumId));
        
        for (String photoId : photoIds) {
            // Verify each photo exists and belongs to user
            Photo photo = photoRepository.findById(photoId).orElse(null);
            if (photo != null && photo.getUserId().equals(userId)) {
                album.addPhoto(photoId);
            }
        }
        
        // Set first photo as cover if no cover
        if (album.getCoverPhotoId() == null && !album.getPhotoIds().isEmpty()) {
            album.setCoverPhotoId(album.getPhotoIds().get(0));
        }
        
        Album updatedAlbum = albumRepository.save(album);
        log.info("Added {} photos to album '{}'", photoIds.size(), album.getName());
        
        return convertToDTO(updatedAlbum);
    }
    
    /**
     * Get albums containing a specific photo
     */
    public List<AlbumDTO> getAlbumsContainingPhoto(String photoId, String userId) {
        List<Album> albums = albumRepository.findByPhotoIdsContaining(photoId);
        return albums.stream()
                .filter(a -> a.getUserId().equals(userId))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Convert Album to AlbumDTO (without photos list)
     */
    private AlbumDTO convertToDTO(Album album) {
        AlbumDTO dto = new AlbumDTO();
        dto.setId(album.getId());
        dto.setName(album.getName());
        dto.setDescription(album.getDescription());
        dto.setCoverPhotoId(album.getCoverPhotoId());
        dto.setPhotoCount(album.getPhotoCount());
        dto.setPhotoIds(album.getPhotoIds());
        dto.setCreatedAt(album.getCreatedAt());
        dto.setUpdatedAt(album.getUpdatedAt());
        
        // Get cover photo URL
        if (album.getCoverPhotoId() != null) {
            photoRepository.findById(album.getCoverPhotoId())
                    .ifPresent(photo -> dto.setCoverPhotoUrl(photo.getUrl()));
        }
        
        return dto;
    }
    
    /**
     * Convert Album to AlbumDTO with full photos list
     */
    private AlbumDTO convertToDTOWithPhotos(Album album) {
        AlbumDTO dto = convertToDTO(album);
        
        // Fetch all photos in album
        if (album.getPhotoIds() != null && !album.getPhotoIds().isEmpty()) {
            List<PhotoDTO> photos = album.getPhotoIds().stream()
                    .map(photoId -> photoRepository.findById(photoId).orElse(null))
                    .filter(photo -> photo != null)
                    .map(this::convertPhotoToDTO)
                    .collect(Collectors.toList());
            dto.setPhotos(photos);
        } else {
            dto.setPhotos(new ArrayList<>());
        }
        
        return dto;
    }
    
    /**
     * Convert Photo to PhotoDTO
     */
    private PhotoDTO convertPhotoToDTO(Photo photo) {
        PhotoDTO dto = new PhotoDTO();
        dto.setId(photo.getId());
        dto.setFileName(photo.getFileName());
        dto.setUrl(photo.getUrl());
        dto.setThumbnailUrl(photo.getThumbnailUrl());
        dto.setLatitude(photo.getLatitude());
        dto.setLongitude(photo.getLongitude());
        dto.setTakenAt(photo.getTakenAt());
        dto.setDescription(photo.getDescription());
        dto.setUploadedAt(photo.getUploadedAt());
        return dto;
    }
}
