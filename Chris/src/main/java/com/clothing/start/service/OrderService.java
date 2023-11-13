package com.clothing.start.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clothing.start.entity.OrderItem;
import com.clothing.start.entity.Orders;
import com.clothing.start.repo.OrderRepo;

@Service
public class OrderService {
	@Autowired
	OrderRepo orderRepo;
	
	
	
	
	public Orders getOrdersByid(Long OrdersId) {
		return orderRepo.findById(OrdersId).get();
	}




	public List<Orders> getOrdersByCustomer(long customerid) {
		// TODO Auto-generated method stub
		return orderRepo.findOrderItems(customerid);
	}
	
	public Orders saveOrder(Orders ord) {
		
		return orderRepo.save(ord);
		
		
	}
}
