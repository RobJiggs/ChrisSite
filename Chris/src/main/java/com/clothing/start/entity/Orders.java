package com.clothing.start.entity;

import java.sql.Date;
import java.util.Set;

import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.LazyGroup;

import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Entity

public class Orders {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(nullable = false)
	private long orderNumber;
	private Date dateOfOrder;
	public enum status {
		  CONFIRMED,
		  PROCESSED,
		  INTRANSIT,
		  DELIVERED
		}
	@Enumerated(EnumType.STRING)
	private status status;
	private String statusMessage;
	private double totalPrice;
	
	@Column(nullable=true)
	private String phonenumber;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = true,referencedColumnName ="userID")
	@JsonIgnore
	private Users user;
	
	private String shipto;
	@OneToOne(fetch = FetchType.LAZY,cascade = CascadeType.MERGE)
	@JoinColumn(name = "address_id", referencedColumnName = "addyid",nullable=true)
	@JsonIgnoreProperties("order")
	@LazyGroup("address")
	
    private Address address;
	
	
	private String addressDetails;
	@OneToMany(mappedBy = "order", fetch = FetchType.EAGER)
	@JsonManagedReference
    private Set<OrderItem> orderItems;

	public long getOrderNumber() {
		return orderNumber;
	}

	public void setOrderNumber(long orderNumber) {
		this.orderNumber = orderNumber;
	}

	public Date getDateOfOrder() {
		return dateOfOrder;
	}

	public void setDateOfOrder(Date dateOfOrder) {
		this.dateOfOrder = dateOfOrder;
	}

	public status getStatus() {
		return status;
	}

	public void setStatus(status status) {
		this.status = status;
	}

	public String getStatusMessage() {
		return statusMessage;
	}

	public void setStatusMessage(String statusMessage) {
		this.statusMessage = statusMessage;
	}
	@JsonIgnore
	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public Users getUser() {
		return user;
	}

	public void setUser(Users user) {
		this.user = user;
	}

	public Set<OrderItem> getOrderItems() {
		return orderItems;
	}

	public void setOrderItems(Set<OrderItem> orderItems) {
		this.orderItems = orderItems;
	}

	public Orders() {
		super();
		// TODO Auto-generated constructor stub
	}

	public String getAddressDetails() {
		return addressDetails;
	}

	public void setAddressDetails(String addressDetails) {
		this.addressDetails = addressDetails;
	}

	public double getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(double totalprice2) {
		this.totalPrice = totalprice2;
	}

	public String getPhonenumber() {
		return phonenumber;
	}

	public void setPhonenumber(String phonenumber) {
		this.phonenumber = phonenumber;
	}


	public Orders(long orderNumber, Date dateOfOrder, com.clothing.start.entity.Orders.status status,
			String statusMessage, double totalPrice, String phonenumber, Users user, String shipto, Address address,
			String addressDetails, Set<OrderItem> orderItems) {
		super();
		this.orderNumber = orderNumber;
		this.dateOfOrder = dateOfOrder;
		this.status = status;
		this.statusMessage = statusMessage;
		this.totalPrice = totalPrice;
		this.phonenumber = phonenumber;
		this.user = user;
		this.shipto = shipto;
		this.address = address;
		this.addressDetails = addressDetails;
		this.orderItems = orderItems;
	}

	public String getShipto() {
		return shipto;
	}

	public void setShipto(String shipto) {
		this.shipto = shipto;
	}

	
	
	

	
	
	
	
}
