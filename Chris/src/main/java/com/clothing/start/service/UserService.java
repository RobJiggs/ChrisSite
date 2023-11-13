package com.clothing.start.service;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.clothing.start.entity.Users;
import com.clothing.start.repo.UserRepo;

import jakarta.transaction.Transactional;



@Service
public class UserService {
	@Autowired
	UserRepo userrepo;
	
	@Autowired
	PasswordEncoder pwencoder;
	
	
	public List<Users> getAllUsers() {
		return userrepo.findAll();

	}
	
	public Users registerUser(Users user) {
		String encoderpw= pwencoder.encode(user.getPassWord());
		user.setPassWord(encoderpw);
		
		
		
		return userrepo.save(user);
		
		
		
	}
	
	public String returnpw(String password) {
		
		
		return pwencoder.encode(password);
		
		
	}
	public void saveUser(Users user) {
		
		userrepo.save(user);
		
		
		
	}
	
	public Users getUsersByid(Long UsersId) {
		return userrepo.findById(UsersId).get();
	}
	public Users getUserByUsername(String Username) {
		
		return userrepo.findByUsername(Username);
		
		
	}
	
public Users getUserByEmail(String Email) {
		
		return userrepo.findByEmail(Email);
		
		
	}

public void updatePassword(Users user, String newPassword) {
    // Update the user's password with the new password
    user.setPassWord(newPassword);
    
    // Save the updated user entity to the database
    userrepo.save(user);
}
	

	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userrepo.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("Invalid username or password.");
        }
        return new org.springframework.security.core.userdetails.User(
                user.getUserName(), user.getPassWord(), new ArrayList<>()
        );
    }

   public boolean authenticateUser(String username, String password) {
        UserDetails userDetails = loadUserByUsername(username);
        return pwencoder.matches(password, userDetails.getPassword());
    }
   
   
   public UserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
	    Users user = userrepo.findByEmail(email);
	    if (user == null) {
	        throw new UsernameNotFoundException("Invalid email or password.");
	    }
	    return new org.springframework.security.core.userdetails.User(
	            user.getEmail(), user.getPassWord(), new ArrayList<>()
	    );
	}

	public boolean authenticateUserEmail(String email, String password) {
	    UserDetails userDetails = loadUserByEmail(email);
	    return pwencoder.matches(password, userDetails.getPassword());
	}

}
