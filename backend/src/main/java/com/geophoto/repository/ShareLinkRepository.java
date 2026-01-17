package com.geophoto.repository;

import com.geophoto.entity.ShareLink;
import com.geophoto.entity.ShareLink.ShareType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * =====================================================
 * ShareLinkRepository - Repository truy vấn ShareLink
 * =====================================================
 * 
 * Mô tả: Interface kế thừa MongoRepository để thao tác với collection "share_links"
 * 
 * Các method query tự động:
 * - findBy... : Tìm kiếm theo điều kiện
 * - existsBy... : Kiểm tra tồn tại
 * - deleteBy... : Xóa theo điều kiện
 * 
 * @author GeoPhoto Team
 */
@Repository
public interface ShareLinkRepository extends MongoRepository<ShareLink, String> {
    
    /**
     * Tìm link chia sẻ theo shareCode
     * Dùng cho trang public view
     * 
     * @param shareCode Mã chia sẻ trong URL
     * @return Optional chứa ShareLink nếu tìm thấy
     */
    Optional<ShareLink> findByShareCode(String shareCode);
    
    /**
     * Tìm link chia sẻ theo shareCode và còn active
     * 
     * @param shareCode Mã chia sẻ
     * @param active Trạng thái active
     * @return Optional chứa ShareLink
     */
    Optional<ShareLink> findByShareCodeAndActive(String shareCode, boolean active);
    
    /**
     * Tìm tất cả link chia sẻ của một user
     * Sắp xếp theo ngày tạo mới nhất
     * 
     * @param userId ID của user
     * @return Danh sách ShareLink
     */
    List<ShareLink> findByUserIdOrderByCreatedAtDesc(String userId);
    
    /**
     * Tìm tất cả link chia sẻ active của user
     * 
     * @param userId ID của user
     * @param active Trạng thái active
     * @return Danh sách ShareLink
     */
    List<ShareLink> findByUserIdAndActiveOrderByCreatedAtDesc(String userId, boolean active);
    
    /**
     * Tìm link chia sẻ cho một target cụ thể
     * Dùng để kiểm tra đã có link chia sẻ cho ảnh/album chưa
     * 
     * @param targetId ID của Photo/Album
     * @param type Loại (PHOTO hoặc ALBUM)
     * @param userId ID của user
     * @return Danh sách ShareLink
     */
    List<ShareLink> findByTargetIdAndTypeAndUserId(String targetId, ShareType type, String userId);
    
    /**
     * Tìm link active cho một target
     * 
     * @param targetId ID của Photo/Album
     * @param type Loại
     * @param userId ID user
     * @param active Trạng thái
     * @return Danh sách ShareLink
     */
    List<ShareLink> findByTargetIdAndTypeAndUserIdAndActive(
        String targetId, ShareType type, String userId, boolean active);
    
    /**
     * Kiểm tra shareCode đã tồn tại chưa
     * 
     * @param shareCode Mã chia sẻ
     * @return true nếu đã tồn tại
     */
    boolean existsByShareCode(String shareCode);
    
    /**
     * Đếm số link chia sẻ của user
     * 
     * @param userId ID của user
     * @return Số lượng link
     */
    long countByUserId(String userId);
    
    /**
     * Đếm số link active của user
     * 
     * @param userId ID của user
     * @param active Trạng thái
     * @return Số lượng link
     */
    long countByUserIdAndActive(String userId, boolean active);
    
    /**
     * Xóa tất cả link chia sẻ cho một target
     * Dùng khi xóa Photo/Album
     * 
     * @param targetId ID của Photo/Album
     * @param type Loại
     */
    void deleteByTargetIdAndType(String targetId, ShareType type);
}
