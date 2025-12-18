package com.geophoto.controller;

import com.geophoto.entity.Photo;
import com.geophoto.repository.PhotoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * Test Data Controller
 * Only for development - adds sample photos with GPS coordinates
 */
@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class TestDataController {
    
    private final PhotoRepository photoRepository;
    
    /**
     * POST /api/test/add-sample-photos
     * Adds sample photos with GPS coordinates for testing
     */
    @PostMapping("/add-sample-photos")
    public ResponseEntity<String> addSamplePhotos() {
        log.info("Adding sample photos with GPS coordinates");
        
        // Clear existing photos
        photoRepository.deleteAll();
        
        List<Photo> samplePhotos = Arrays.asList(
            createPhoto("007009ab-2bcd-4f96-9a80-e3bafa17f14f.jpg", 16.0544, 108.2022, "Cầu Rồng - Đà Nẵng"),
            createPhoto("0af9ef26-7061-4eca-8714-387417ff5f89.jpg", 21.0285, 105.8542, "Hồ Gươm - Hà Nội"),
            createPhoto("3289b1ee-bcb9-4ae0-a528-8786d6a3b8fc.jpg", 10.7769, 106.7009, "Nhà thờ Đức Bà - Sài Gòn"),
            createPhoto("4b0226fb-089e-4fb6-8872-5288007ce56d.jpg", 16.4637, 107.5909, "Đại Nội - Huế"),
            createPhoto("4e722e59-76d7-4b50-a247-4804a0e0a734.jpg", 12.2388, 109.1967, "Biển Nha Trang"),
            createPhoto("6bef9a78-483b-479f-8dba-027403964cfb.jpg", 10.3499, 107.0843, "Vũng Tàu"),
            createPhotoWithoutGPS("6fac883e-3e3b-44b6-8288-f730c94f86fb.jpg", "Ảnh không có GPS - cần thêm thủ công")
        );
        
        photoRepository.saveAll(samplePhotos);
        
        log.info("Successfully added {} sample photos", samplePhotos.size());
        return ResponseEntity.ok("Added " + samplePhotos.size() + " sample photos with GPS coordinates!");
    }
    
    /**
     * DELETE /api/test/clear-all-photos
     * Clears all photos from database (files remain on disk)
     */
    @DeleteMapping("/clear-all-photos")
    public ResponseEntity<String> clearAllPhotos() {
        log.info("Clearing all photos from database");
        long count = photoRepository.count();
        photoRepository.deleteAll();
        log.info("Cleared {} photos", count);
        return ResponseEntity.ok("Cleared " + count + " photos from database");
    }
    
    private Photo createPhoto(String filename, Double latitude, Double longitude, String description) {
        Photo photo = new Photo();
        photo.setFileName(filename);
        photo.setUrl("/uploads/" + filename);
        photo.setThumbnailUrl("/uploads/" + filename);
        photo.setLatitude(latitude);
        photo.setLongitude(longitude);
        photo.setDescription(description);
        photo.setTakenAt(LocalDateTime.now().minusDays((long)(Math.random() * 30)));
        return photo;
    }
    
    private Photo createPhotoWithoutGPS(String filename, String description) {
        Photo photo = new Photo();
        photo.setFileName(filename);
        photo.setUrl("/uploads/" + filename);
        photo.setThumbnailUrl("/uploads/" + filename);
        photo.setDescription(description);
        return photo;
    }
}






