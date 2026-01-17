package com.geophoto.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

import java.io.IOException;

/**
 * JWT Authentication Filter
 * Filters every request and validates JWT token
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    
    /**
     * Skip filter for public endpoints
     */
    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();
        
        // Skip for OPTIONS requests (CORS preflight)
        if ("OPTIONS".equals(method)) {
            return true;
        }
        
        // Skip for public endpoints
        if (path.startsWith("/api/auth/") || 
            path.startsWith("/uploads/") || 
            path.startsWith("/h2-console/") ||
            path.startsWith("/api/public/")) {
            logger.info("✅ Skipping JWT filter for public endpoint: {} {}", method, path);
            return true;
        }
        
        return false;
    }
    
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, 
                                    @NonNull HttpServletResponse response, 
                                    @NonNull FilterChain filterChain) 
            throws ServletException, IOException {
        
        String path = request.getRequestURI();
        String method = request.getMethod();
        logger.debug("🔒 JWT filter processing: {} {}", method, path);
        
        try {
            String jwt = parseJwt(request);
            
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String username = jwtUtils.getUsernameFromJwtToken(jwt);
                
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(
                                userDetails, 
                                null, 
                                userDetails.getAuthorities());
                
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }
        
        filterChain.doFilter(request, response);
    }
    
    /**
     * Parse JWT token from Authorization header
     */
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        
        return null;
    }
}
