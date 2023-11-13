package com.clothing.start.entity;

import java.sql.Date;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
@Entity
public class Items  {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(nullable = false)
	private long itemID;
	private String itemName;
	private String sex;
	private String category;
	private String color;
	private double price;
	private String size;
	private String image;
	private Boolean available;
	private Boolean featured;
	
	private Date dateAdded;
	@JsonIgnore
	@OneToMany(mappedBy = "item")
    private Set<CartItem> cartitem;
	@JsonIgnore
	@OneToMany(mappedBy = "item")
    private Set<OrderItem> orderitem;

	public long getItemID() {
		return itemID;
	}

	public void setItemID(long itemID) {
		this.itemID = itemID;
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public String getSize() {
		return size;
	}

	public void setSize(String size) {
		this.size = size;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	
	
	public Items() {
		super();
		// TODO Auto-generated constructor stub
	}

	

	public Date getDateAdded() {
		return dateAdded;
	}

	public void setDateAdded(Date dateAdded) {
		this.dateAdded = dateAdded;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public Boolean getFeatured() {
		return featured;
	}

	public void setFeatured(Boolean featured) {
		this.featured = featured;
	}

	

	public Boolean getAvailable() {
		return available;
	}

	public void setAvailable(Boolean available) {
		this.available = available;
	}

	public Items(long itemID, String itemName, String sex, String category, String color, double price, String size,
			String image, Boolean available, Boolean featured, Date dateAdded) {
		super();
		this.itemID = itemID;
		this.itemName = itemName;
		this.sex = sex;
		this.category = category;
		this.color = color;
		this.price = price;
		this.size = size;
		this.image = image;
		this.available = available;
		this.featured = featured;
		this.dateAdded = dateAdded;
		
		
	}

	
	


	
	
}

