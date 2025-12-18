package com.geophoto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Photo Data Transfer Object
 * Used for API responses to avoid exposing Document directly
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhotoDTO {
    
    private String id; // MongoDB uses String IDs (ObjectId)
    private String fileName;
    private String url;
    private String thumbnailUrl;
    private Double latitude;
    private Double longitude;
    private LocalDateTime takenAt;
    private String description;
    private LocalDateTime uploadedAt;
}

