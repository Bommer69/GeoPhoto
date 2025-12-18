package com.geophoto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Authentication Response DTO
 * Updated for MongoDB - ID is String (ObjectId)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private String id; // Changed from Long to String for MongoDB
    private String username;
    private String email;
    private String fullName;
    
    public AuthResponse(String token, String id, String username, String email, String fullName) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
    }
}
