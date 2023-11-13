package com.clothing.start.entity;




import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.LazyGroup;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
@Entity
public class Address {

	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(nullable = false)
	private long addyid;
	private String street;
	@Column(nullable = false)
	private String city;
	@Column(nullable = false)
	private String state;
	@Column(nullable = false)
	private String country;
	
	@Column(nullable=true)
	private String etc;
	
	private String zipcode;
	
	public enum Status {
		  MAIN,
		  SECONDARY
		}
	@Enumerated(EnumType.STRING)
	private Status status;
	
	
	 @ManyToMany
	    @JoinTable(name = "user_address",
	               joinColumns = @JoinColumn(name = "address_id"),
	               inverseJoinColumns = @JoinColumn(name = "user_id"))
	
	private Set<Users> users = new HashSet<>();
	@JsonIgnore
	@OneToOne(mappedBy = "address")
	@LazyGroup("order")
    private Orders order;
	
	
	
	

	public String getEtc() {
		return etc;
	}
	public void setEtc(String etc) {
		this.etc = etc;
	}
	public Set<Users> getUsers() {
		return users;
	}
	public void setUsers(Set<Users> users) {
		this.users = users;
	}
	public long getAddyid() {
		return addyid;
	}
	public void setAddyid(long addyid) {
		this.addyid = addyid;
	}
	public String getStreet() {
		return street;
	}
	public void setStreet(String street) {
		this.street = street;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	
	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}
	 public Orders getOrder() {
	        return order;
	    }

	    public void setOrder(Orders order) {
	        this.order = order;
	    }

	
	public Address(long addyid, String street, String city, String state, String country) {
		super();
		this.addyid = addyid;
		this.street = street;
		this.city = city;
		this.state = state;
		this.country = country;
	}
	public Address() {
		super();
		// TODO Auto-generated constructor stub
	}
	public String getZipcode() {
		return zipcode;
	}
	public void setZipcode(String zipcode) {
		this.zipcode = zipcode;
	}
	
	
	
	
}
