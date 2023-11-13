package com.clothing.start.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clothing.start.entity.Cart;
import com.clothing.start.entity.CartItem;
import com.clothing.start.entity.Users;
import com.clothing.start.repo.CartItemRepo;
import com.clothing.start.repo.CartRepo;

@Service
public class CartItemService {

	
	@Autowired
	CartItemRepo cartitemRepo;
	
	
	public List<CartItem> getCartItems(long cartid) {
		return cartitemRepo.findCartItems(cartid);
		
		
		
	}
	public CartItem saveci (CartItem ci) {
		
		return cartitemRepo.save(ci);
		
		
	}
	public void deleteCI(CartItem cartItem) {
		cartitemRepo.delete(cartItem);
		
	}
	public CartItem getById(long cartitemid) {
		// TODO Auto-generated method stub
		return cartitemRepo.findById(cartitemid).get();
	}
	public void delete(CartItem cartItem) {
		// TODO Auto-generated method stub
		cartitemRepo.delete(cartItem);
	}
}
