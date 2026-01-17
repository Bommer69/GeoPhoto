package com.geophoto.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Album Entity - Thực thể Album/Bộ sưu tập
 * 
 * Mô tả: Đại diện cho một album ảnh trong MongoDB
 * Collection: "albums"
 * 
 * Chức năng:
 * - Lưu trữ thông tin album (tên, mô tả)
 * - Quản lý danh sách ảnh trong album (photoIds)
 * - Lưu ảnh bìa (coverPhotoId)
 * - Liên kết với User sở hữu (userId)
 * 
 * @author GeoPhoto Team
 */
@Document(collection = "albums")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Album {
    
    /**
     * ID duy nhất của album (tự động sinh bởi MongoDB)
     */
    @Id
    private String id;
    
    /**
     * Tên album - VD: "Du lịch Đà Nẵng 2024"
     */
    private String name;
    
    /**
     * Mô tả ngắn về album (tùy chọn)
     */
    private String description;
    
    /**
     * ID của ảnh bìa (hiển thị làm thumbnail của album)
     * Nếu null, sẽ dùng ảnh đầu tiên trong album
     */
    private String coverPhotoId;
    
    /**
     * Danh sách ID các ảnh trong album
     * Lưu dưới dạng mảng String, không embed toàn bộ Photo
     * Giúp tối ưu hiệu suất và dễ quản lý
     */
    private List<String> photoIds = new ArrayList<>();
    
    /**
     * ID của User sở hữu album này
     * Được đánh index để tìm kiếm nhanh theo user
     */
    @Indexed
    private String userId;
    
    /**
     * Thời điểm tạo album
     */
    private LocalDateTime createdAt = LocalDateTime.now();
    
    /**
     * Thời điểm cập nhật album lần cuối
     * Tự động cập nhật khi thêm/xóa ảnh
     */
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    /**
     * Lấy số lượng ảnh trong album
     * 
     * @return Số ảnh trong album
     */
    public int getPhotoCount() {
        return photoIds != null ? photoIds.size() : 0;
    }
    
    /**
     * Thêm một ảnh vào album
     * - Kiểm tra trùng lặp trước khi thêm
     * - Tự động cập nhật thời gian updatedAt
     * 
     * @param photoId ID của ảnh cần thêm
     */
    public void addPhoto(String photoId) {
        if (photoIds == null) {
            photoIds = new ArrayList<>();
        }
        // Chỉ thêm nếu chưa tồn tại (tránh trùng lặp)
        if (!photoIds.contains(photoId)) {
            photoIds.add(photoId);
            updatedAt = LocalDateTime.now();
        }
    }
    
    /**
     * Xóa một ảnh khỏi album
     * - Nếu ảnh bị xóa là ảnh bìa, tự động chọn ảnh khác làm bìa
     * - Tự động cập nhật thời gian updatedAt
     * 
     * @param photoId ID của ảnh cần xóa
     */
    public void removePhoto(String photoId) {
        if (photoIds != null) {
            photoIds.remove(photoId);
            updatedAt = LocalDateTime.now();
            
            // Nếu ảnh bị xóa là ảnh bìa, chọn ảnh đầu tiên làm bìa mới
            if (photoId.equals(coverPhotoId)) {
                coverPhotoId = photoIds.isEmpty() ? null : photoIds.get(0);
            }
        }
    }
}
