package com.clothing.start.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clothing.start.entity.PasswordResetToken;
import com.clothing.start.entity.Users;
import com.clothing.start.repo.PasswordResetRepo;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    PasswordResetRepo tokenRepository;

    public PasswordResetToken generateToken(Users user) {
        // Generate a unique password reset token
        String token = generateUniqueToken();

        // Set the expiration timestamp (e.g., 24 hours from now)
        LocalDateTime expiryDateTime = LocalDateTime.now().plusHours(24);

        // Create a new password reset token entity
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setToken(token);
        passwordResetToken.setUser(user);
        passwordResetToken.setExpiryDateTime(expiryDateTime);

        // Save the token in the database
        return tokenRepository.save(passwordResetToken);
    }

    private String generateUniqueToken() {
    	UUID uuid = UUID.randomUUID();
        return uuid.toString();
    }
    
    
    
    public PasswordResetToken findByToken(String token) {
        return tokenRepository.findByToken(token);
    }
    
    public void delete(PasswordResetToken token) {
        // Delete the password reset token from the database
        tokenRepository.delete(token);
    }
}
