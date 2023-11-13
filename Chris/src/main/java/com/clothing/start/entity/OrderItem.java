package com.clothing.start.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

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
public class OrderItem {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(nullable = false)
	private long orderitemID;
	private int quantity;  
	private double price;
	@ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
	@JoinColumn(name = "order_id", nullable = false)
	@JsonBackReference
    private Orders order;
	
	
	@ManyToOne(cascade = CascadeType.MERGE,fetch=FetchType.LAZY)
	@JoinColumn(name = "item_id", referencedColumnName = "itemID")
    private Items item;


	public long getOrderitemID() {
		return orderitemID;
	}


	public void setOrderitemID(long orderitemID) {
		this.orderitemID = orderitemID;
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


	public Orders getOrder() {
		return order;
	}


	public void setOrder(Orders order) {
		this.order = order;
	}


	public Items getItem() {
		return item;
	}


	public void setItem(Items item) {
		this.item = item;
	}


	public OrderItem(long orderitemID, int quantity, double price, Orders order, Items item) {
		super();
		this.orderitemID = orderitemID;
		this.quantity = quantity;
		this.price = price;
		this.order = order;
		this.item = item;
	}


	public OrderItem() {
		super();
		// TODO Auto-generated constructor stub
	}

	
	
	
	
}
