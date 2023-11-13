package com.clothing.start.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
public class CartItem {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(nullable = false)
	private long cartitemID;
	private int quantity;  
	private double price;
	@ManyToOne(fetch = FetchType.LAZY, optional = false,cascade = CascadeType.MERGE)
	@JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;
	
	
	@ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
	@JoinColumn(name = "item_id", referencedColumnName = "itemID")
    private Items item;


	public long getCartitemID() {
		return cartitemID;
	}


	public void setCartitemID(long cartitemID) {
		this.cartitemID = cartitemID;
	}


	public int getQuantity() {
		return quantity;
	}


	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}


	public double getPrice() {
		return price;
	}


	public void setPrice(double price) {
		this.price = price;
	}


	public Cart getCart() {
		return cart;
	}


	public void setCart(Cart cart) {
		this.cart = cart;
	}


	public Items getItem() {
		return item;
	}


	public void setItem(Items item) {
		this.item = item;
	}


	public CartItem() {
		super();
		// TODO Auto-generated constructor stub
	}


	public CartItem(long cartitemID, int quantity, double price, Cart cart, Items item) {
		super();
		this.cartitemID = cartitemID;
		this.quantity = quantity;
		this.price = price;
		this.cart = cart;
		this.item = item;
	}
	 

	
	
	
}
