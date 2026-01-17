package com.geophoto.repository;

import com.geophoto.entity.Album;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * AlbumRepository - Repository truy vấn Album trong MongoDB
 * 
 * Mô tả: Interface kế thừa MongoRepository để thao tác với collection "albums"
 * Spring Data MongoDB sẽ tự động tạo implementation dựa trên tên method
 * 
 * Các method query tự động:
 * - findBy... : Tìm kiếm theo điều kiện
 * - countBy... : Đếm theo điều kiện
 * - existsBy... : Kiểm tra tồn tại
 * - OrderBy... : Sắp xếp kết quả
 * 
 * @author GeoPhoto Team
 */
@Repository
public interface AlbumRepository extends MongoRepository<Album, String> {
    
    /**
     * Tìm tất cả album của một user, sắp xếp theo ngày tạo mới nhất
     * 
     * @param userId ID của user
     * @return Danh sách album, mới nhất trước
     */
    List<Album> findByUserIdOrderByCreatedAtDesc(String userId);
    
    /**
     * Tìm album theo ID và userId (để kiểm tra quyền sở hữu)
     * Dùng để đảm bảo user chỉ có thể truy cập album của mình
     * 
     * @param id ID của album
     * @param userId ID của user
     * @return Optional chứa Album nếu tìm thấy và thuộc về user
     */
    Optional<Album> findByIdAndUserId(String id, String userId);
    
    /**
     * Đếm số album của một user
     * Dùng cho thống kê dashboard
     * 
     * @param userId ID của user
     * @return Số lượng album
     */
    long countByUserId(String userId);
    
    /**
     * Kiểm tra xem user đã có album với tên này chưa
     * Dùng để tránh tạo album trùng tên
     * 
     * @param name Tên album
     * @param userId ID của user
     * @return true nếu đã tồn tại
     */
    boolean existsByNameAndUserId(String name, String userId);
    
    /**
     * Tìm tất cả album chứa một ảnh cụ thể
     * Dùng để hiển thị "Ảnh này thuộc album nào?"
     * 
     * @param photoId ID của ảnh
     * @return Danh sách album chứa ảnh này
     */
    List<Album> findByPhotoIdsContaining(String photoId);
}
