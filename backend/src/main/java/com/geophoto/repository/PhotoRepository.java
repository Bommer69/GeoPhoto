package com.geophoto.repository;

import com.geophoto.entity.Photo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Photo Repository
 * MongoDB Repository for Photo documents
 */
@Repository
public interface PhotoRepository extends MongoRepository<Photo, String> {
    
    /**
     * Find all photos that have GPS coordinates (latitude and longitude not null)
     */
    @Query("{ 'latitude': { $ne: null }, 'longitude': { $ne: null } }")
    List<Photo> findAllWithGpsCoordinates();
    
    /**
     * Find all photos by user ID
     */
    List<Photo> findByUserId(String userId);
    
    /**
     * Find all photos by user ID with GPS coordinates
     */
    List<Photo> findByUserIdAndLatitudeIsNotNullAndLongitudeIsNotNull(String userId);
    
    /**
     * Count photos by user ID
     */
    long countByUserId(String userId);
}

