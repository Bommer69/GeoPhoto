package com.geophoto.dto;

import com.geophoto.entity.ShareLink.ShareType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * =====================================================
 * ShareLinkDTO - Đối tượng truyền dữ liệu Link chia sẻ
 * =====================================================
 * 
 * Mô tả: Dùng để trả về thông tin link chia sẻ qua API
 * 
 * Sử dụng:
 * - GET /api/shares         -> Danh sách ShareLinkDTO
 * - GET /api/shares/{code}  -> Chi tiết ShareLinkDTO
 * - POST /api/shares        -> Tạo mới, trả về ShareLinkDTO
 * 
 * @author GeoPhoto Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShareLinkDTO {
    
    /**
     * ID của link chia sẻ
     */
    private String id;
    
    /**
     * Mã chia sẻ (dùng trong URL)
     */
    private String shareCode;
    
    /**
     * URL đầy đủ để chia sẻ
     * VD: "http://localhost:5173/share/abc123"
     */
    private String shareUrl;
    
    /**
     * Loại chia sẻ: PHOTO hoặc ALBUM
     */
    private ShareType type;
    
    /**
     * ID của Photo/Album được chia sẻ
     */
    private String targetId;
    
    /**
     * Tiêu đề hiển thị
     */
    private String title;
    
    /**
     * Mô tả
     */
    private String description;
    
    /**
     * Có yêu cầu mật khẩu không?
     */
    private boolean passwordProtected;
    
    /**
     * Thời điểm hết hạn
     */
    private LocalDateTime expiresAt;
    
    /**
     * Link còn hoạt động không?
     */
    private boolean active;
    
    /**
     * Đã hết hạn chưa?
     */
    private boolean expired;
    
    /**
     * Số lượt xem
     */
    private int viewCount;
    
    /**
     * Thời điểm tạo
     */
    private LocalDateTime createdAt;
    
    // ============ Dữ liệu kèm theo (cho public view) ============
    
    /**
     * Thông tin ảnh (nếu type = PHOTO)
     */
    private PhotoDTO photo;
    
    /**
     * Thông tin album (nếu type = ALBUM)
     */
    private AlbumDTO album;
    
    /**
     * Danh sách ảnh trong album (nếu type = ALBUM)
     */
    private List<PhotoDTO> photos;
}
