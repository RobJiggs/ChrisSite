package com.clothing.start.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clothing.start.entity.Address;
import com.clothing.start.entity.Orders;
import com.clothing.start.repo.AddressRepo;
import com.clothing.start.repo.OrderRepo;

@Service
public class AddressService {
	@Autowired
	AddressRepo addressRepo;
	
	
	
	
	public Address getAddresssByid(Long AddresssId) {
		return addressRepo.findById(AddresssId).get();
	}
	
	public List<Address>getAddressByUser(Long userid){
		return addressRepo.findAddressesByUserid(userid);
		
		
		
		
		
	}
	
	
	public Address getMainAddress(Long UserId) {
		
		return addressRepo.findMainAddressByUserId(UserId);
		
		
	}
	
	public Address getSecondaryAddress(Long UserId) {
		
		return addressRepo.findSecondaryAddressByUserId(UserId);
		
		
	}

	public Address add(Address add) {
		// TODO Auto-generated method stub
		return addressRepo.save(add);
	}
	
	
	
	
}
