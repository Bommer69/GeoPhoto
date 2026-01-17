package com.geophoto.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * =====================================================
 * ShareLink Entity - Thực thể Link chia sẻ
 * =====================================================
 * 
 * Mô tả: Đại diện cho một link chia sẻ trong MongoDB
 * Collection: "share_links"
 * 
 * Chức năng:
 * - Lưu trữ thông tin link chia sẻ (shareCode duy nhất)
 * - Hỗ trợ chia sẻ cả Photo và Album
 * - Tùy chọn: hết hạn, mật khẩu bảo vệ
 * - Đếm số lượt xem
 * 
 * @author GeoPhoto Team
 */
@Document(collection = "share_links")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShareLink {
    
    /**
     * ID duy nhất (MongoDB ObjectId)
     */
    @Id
    private String id;
    
    /**
     * Mã chia sẻ - dùng trong URL
     * VD: "abc123xyz" -> /share/abc123xyz
     * Được đánh index unique để đảm bảo không trùng
     */
    @Indexed(unique = true)
    private String shareCode;
    
    /**
     * Loại đối tượng chia sẻ: "PHOTO" hoặc "ALBUM"
     */
    private ShareType type;
    
    /**
     * ID của Photo hoặc Album được chia sẻ
     */
    private String targetId;
    
    /**
     * ID của User tạo link chia sẻ
     */
    @Indexed
    private String userId;
    
    /**
     * Tiêu đề hiển thị khi xem link
     * Mặc định: tên file ảnh hoặc tên album
     */
    private String title;
    
    /**
     * Mô tả (tùy chọn)
     */
    private String description;
    
    /**
     * Mật khẩu bảo vệ (đã hash)
     * Null nếu không có mật khẩu
     */
    private String password;
    
    /**
     * Có yêu cầu mật khẩu không?
     */
    private boolean passwordProtected = false;
    
    /**
     * Thời điểm hết hạn (null = không hết hạn)
     */
    private LocalDateTime expiresAt;
    
    /**
     * Link còn hoạt động không?
     * false = đã bị hủy/vô hiệu hóa
     */
    private boolean active = true;
    
    /**
     * Số lượt xem
     */
    private int viewCount = 0;
    
    /**
     * Thời điểm tạo
     */
    private LocalDateTime createdAt = LocalDateTime.now();
    
    /**
     * Thời điểm cập nhật lần cuối
     */
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    /**
     * Enum loại chia sẻ
     */
    public enum ShareType {
        PHOTO,  // Chia sẻ một ảnh
        ALBUM   // Chia sẻ một album
    }
    
    /**
     * Kiểm tra link đã hết hạn chưa
     */
    public boolean isExpired() {
        if (expiresAt == null) return false;
        return LocalDateTime.now().isAfter(expiresAt);
    }
    
    /**
     * Kiểm tra link có thể truy cập
     */
    public boolean isAccessible() {
        return active && !isExpired();
    }
    
    /**
     * Tăng số lượt xem
     */
    public void incrementViewCount() {
        this.viewCount++;
        this.updatedAt = LocalDateTime.now();
    }
}
