package com.clothing.start.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clothing.start.entity.CartItem;
import com.clothing.start.entity.OrderItem;
import com.clothing.start.repo.OrderitemRepo;
@Service
public class OrderItemService {
	@Autowired
	OrderitemRepo orderitemRepo;
	
	public List<OrderItem> getUserOrder(long orderNumber) {
		// TODO Auto-generated method stub
		return orderitemRepo.findOrderItems(orderNumber);
	}
	
	public OrderItem saveOrderItem(OrderItem oi) {
		
		return orderitemRepo.save(oi);
		
		
	}

	public OrderItem getById(long orderitemid) {
		// TODO Auto-generated method stub
		return orderitemRepo.findById(orderitemid).get();
	}

}
