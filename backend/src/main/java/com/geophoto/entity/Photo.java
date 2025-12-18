package com.geophoto.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Photo Document
 * Represents a photo with GPS metadata stored in MongoDB
 */
@Document(collection = "photos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Photo {
    
    @Id
    private String id;
    
    private String fileName;
    
    private String url;
    
    private String thumbnailUrl;
    
    // Note: Geospatial indexing disabled temporarily
    // @GeoSpatialIndexed requires GeoJSON format or [longitude, latitude] array
    private Double latitude;
    
    private Double longitude;
    
    private LocalDateTime takenAt;
    
    private String description;
    
    private LocalDateTime uploadedAt = LocalDateTime.now();
    
    /**
     * User ID who owns this photo
     * Stored as reference (not embedded)
     */
    @Indexed
    private String userId;
}

