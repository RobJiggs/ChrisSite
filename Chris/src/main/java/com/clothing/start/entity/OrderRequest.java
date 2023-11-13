package com.clothing.start.entity;

import java.util.Set;

public class OrderRequest {
    private String intent;
    private String currencyCode;
    private String amount;
    
    private Set<CartItem> cartitems;
    
    // Default constructor
    public OrderRequest() {
    }
    
    // Getters and setters for the fields
    
    public String getIntent() {
        return intent;
    }
    
    public void setIntent(String intent) {
        this.intent = intent;
    }
    
    public String getCurrencyCode() {
        return currencyCode;
    }
    
    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }
    
    public String getAmount() {
        return amount;
    }
    
    public void setAmount(String amount) {
        this.amount = amount;
    }

	public Set<CartItem> getCartitems() {
		return cartitems;
	}

	public void setCartitems(Set<CartItem> cartitems) {
		this.cartitems = cartitems;
	}
}
