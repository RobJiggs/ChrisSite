package com.clothing.start.entity;

import java.sql.Date;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.LazyGroup;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
public class Cart {
	   @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(nullable = false)
	    private long cartID;
	   
	    private Date created_at;
	    private Date updated_at;
	    @Column(nullable = true)
	    private String ipAddress;
	    
	    @OneToOne(fetch = FetchType.LAZY)
		@JoinColumn(name = "user_id", referencedColumnName = "userID",nullable=true)
	    @JsonIgnoreProperties("cart")
		@LazyGroup("user")
	    @JsonIgnore
	    private Users user;
	    
	    
	    public String getipAddress() {
			return ipAddress;
		}

		public void setipAddress(String ipAddress) {
			this.ipAddress = ipAddress;
		}

		@OneToMany(mappedBy = "cart")
	    private Set<CartItem> cartItems;

		public long getCartID() {
			return cartID;
		}

		public void setCartID(long cartID) {
			this.cartID = cartID;
		}

		public Date getCreated_at() {
			return created_at;
		}

		public Users getUser() {
			return user;
		}

		public void setUser(Users user) {
			this.user = user;
		}

		public void setCreated_at(Date created_at) {
			this.created_at = created_at;
		}

		public Date getUpdated_at() {
			return updated_at;
		}

		public void setUpdated_at(Date updated_at) {
			this.updated_at = updated_at;
		}

		

		public Cart(long cartID, Date created_at, Date updated_at) {
			super();
			this.cartID = cartID;
			this.created_at = created_at;
			this.updated_at = updated_at;
			
		}

		public Cart() {
			super();
			// TODO Auto-generated constructor stub
		}
	    
	    
	    

}
