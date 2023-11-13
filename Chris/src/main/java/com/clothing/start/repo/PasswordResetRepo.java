package com.clothing.start.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clothing.start.entity.PasswordResetToken;

public interface PasswordResetRepo extends JpaRepository<PasswordResetToken, Long> {
	
	PasswordResetToken findByToken(String token);
    // Additional methods if needed
}