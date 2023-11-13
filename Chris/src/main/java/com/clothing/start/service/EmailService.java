package com.clothing.start.service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
	
	
	@Autowired
	JavaMailSender javaMailSender;
	@Value("${app.baseURL}") // Add this line to read the base URL from configuration
    private String baseURL;
	
	Logger logger = LoggerFactory.getLogger(EmailService.class);
	
	public void sendPasswordResetEmail(String recipientEmail, String resetToken) {
		String resetLink = baseURL + "/reset-password/" + resetToken;

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(recipientEmail);
        mailMessage.setSubject("Password Reset");
        mailMessage.setText("To reset your password, click the following link: " + resetLink);
        javaMailSender.send(mailMessage);
    }
	
	
	public ResponseEntity<String> sendOrderConfirmationEmail(String recipientEmail, String subject, String emailContent) {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper;
        try {
            helper = new MimeMessageHelper(message, true);
            helper.setTo(recipientEmail);
            helper.setSubject(subject);
            helper.setText(emailContent, true);
        } catch (MessagingException e) {
        	logger.error("Failed to send email: {}", e.getMessage());
            
            // Return a custom error message or response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email");
        }
        
        
        javaMailSender.send(message);
        return ResponseEntity.status(HttpStatus.OK).body("Email Sent");

        }

        
    }

