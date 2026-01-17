package com.geophoto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * AlbumDTO - Đối tượng truyền dữ liệu Album
 * 
 * Mô tả: Dùng để trả về thông tin album qua API
 * Tách biệt khỏi Entity để bảo mật và tùy chỉnh response
 * 
 * Sử dụng:
 * - GET /api/albums         -> Trả về danh sách AlbumDTO (không có photos)
 * - GET /api/albums/{id}    -> Trả về AlbumDTO (có photos đầy đủ)
 * 
 * @author GeoPhoto Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlbumDTO {
    
    /**
     * ID duy nhất của album
     */
    private String id;
    
    /**
     * Tên album
     */
    private String name;
    
    /**
     * Mô tả album
     */
    private String description;
    
    /**
     * ID của ảnh bìa
     */
    private String coverPhotoId;
    
    /**
     * URL của ảnh bìa (để hiển thị trực tiếp)
     * VD: "/uploads/abc123.jpg"
     */
    private String coverPhotoUrl;
    
    /**
     * Số lượng ảnh trong album
     * Hiển thị trên card album: "📷 12"
     */
    private int photoCount;
    
    /**
     * Danh sách ID ảnh (dùng cho view danh sách)
     */
    private List<String> photoIds;
    
    /**
     * Danh sách ảnh đầy đủ (dùng cho view chi tiết album)
     * Chỉ được populate khi gọi GET /api/albums/{id}
     */
    private List<PhotoDTO> photos;
    
    /**
     * Thời điểm tạo album
     */
    private LocalDateTime createdAt;
    
    /**
     * Thời điểm cập nhật lần cuối
     */
    private LocalDateTime updatedAt;
}
