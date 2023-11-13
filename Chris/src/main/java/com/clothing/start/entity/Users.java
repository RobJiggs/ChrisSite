package com.clothing.start.entity;

import java.util.Set;

import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Size;

import org.hibernate.annotations.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinColumn;

@Entity
public class Users {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(nullable = false)
	
	private long userID;

	@Column(nullable = false, unique = true)
	private String username;
	
	@Column(nullable = false)
	private String password;
	
	private String firstname;

	private String lastname;
	

	
	private String phonenumber;
	@Column(unique=true)
	private String email;
	
	@OneToOne(mappedBy = "user")
	@LazyGroup("cart")
	@JsonIgnore
	@Fetch(FetchMode.JOIN)
    private Cart cart;
	
	@OneToMany(mappedBy="user",fetch = FetchType.LAZY)
	@JsonIgnore
	@LazyGroup("orders")
    private Set<Orders> orders;
	
	@Size(max = 2)
	@ManyToMany(mappedBy = "users")
	    
	    
    private Set<Address> addresses;
	
	
	@OneToOne(mappedBy = "user")
    private PasswordResetToken passwordResetToken;
	
	
	public long getUserID() {
		return userID;
	}

	public void setUserID(long userID) {
		this.userID = userID;
	}

	public String getUserName() {
		return username;
	}

	public void setUserName(String username) {
		this.username = username;
	}

	public String getPassWord() {
		return password;
	}

	public void setPassWord(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstname;
	}

	public void setFirstName(String firstname) {
		this.firstname = firstname;
	}

	public String getLastName() {
		return lastname;
	}

	public void setLastName(String lastname) {
		this.lastname = lastname;
	}

	

	public String getPhoneNumber() {
		return phonenumber;
	}

	public void setPhoneNumber(String phonenumber) {
		this.phonenumber = phonenumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Set<Orders> getOrders() {
		return orders;
	}

	public void setOrders(Set<Orders> orders) {
		this.orders = orders;
	}

	public Users() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Users(long userID, String username, String password, String firstname, String lastname,
			String phonenumber, String email, Set<Orders> orders) {
		super();
		this.userID = userID;
		this.username = username;
		this.password = password;
		this.firstname = firstname;
		this.lastname = lastname;
		
		this.phonenumber = phonenumber;
		this.email = email;
		this.orders = orders;
	}

	public Cart getCart() {
		return cart;
	}

	public void setCart(Cart cart) {
		this.cart = cart;
	}

	public PasswordResetToken getPasswordResetToken() {
		return passwordResetToken;
	}

	public void setPasswordResetToken(PasswordResetToken passwordResetToken) {
		this.passwordResetToken = passwordResetToken;
	}
	
	
	
	
	

}
