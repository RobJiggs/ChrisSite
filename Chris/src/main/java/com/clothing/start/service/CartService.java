package com.clothing.start.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clothing.start.entity.Cart;
import com.clothing.start.entity.Users;
import com.clothing.start.repo.CartRepo;

@Service
public class CartService {

	
	@Autowired
	CartRepo cartRepo;
	
	
	public Cart getUserCart(long userid) {
		
		return cartRepo.findCartByUserid(userid);
		
		
	}
	public Cart getGuestCart(String IPAddress) {
		return cartRepo.findByIpAddress(IPAddress);
		
		
	}


	public void saveCart(Cart cart) {
		// TODO Auto-generated method stub
		cartRepo.save(cart);
	}


	public Cart getCartById(long cartId) {
		// TODO Auto-generated method stub
		return cartRepo.findById(cartId).get();
	}
	
	
	
}
