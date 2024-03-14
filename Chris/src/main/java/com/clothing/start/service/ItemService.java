package com.clothing.start.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.clothing.start.entity.Items;
import com.clothing.start.repo.ItemRepo;



@Service
public class ItemService {
	@Autowired
	ItemRepo itemRepo;
	

	
	
	public List<Items> getAllItems() {
		return itemRepo.findDistinctItems();

	}
	
	
	
	public void saveItem(Items item) {
		
		itemRepo.save(item);
		
		
		
	}
	public Items getItemByid(Long ItemId) {
		return itemRepo.findById(ItemId).get();
	}
	public List<Items> itemNameContaining(String itemName){
		
		return itemRepo.findByItemNameContaining(itemName);
		
		
		
	}
	
	public List<Items> itemCategory(String category){
		
		return itemRepo.findDistinctItemNameWithItemsByCategory(category);
		
		
		
	}
public List<Items> itemColor(String color){
		
		return itemRepo.findDistinctItemNameWithItemsByColor(color);
		
		
		
	}

public List<Items> itemPrice(double minprice,double maxprice){
	
	return itemRepo.findItemsByPriceRange(minprice, maxprice);
	
	
}
	
public List<Items> itemFeatured(){
	
	return itemRepo.findByFeaturedItems();
	
	
}


public Items ItemsForCart(String name,String color,String sex,String size){
	
	
	
	return itemRepo.findItemByAttributes(name, color, sex, size);
	
}
public List<Items> ItemSearchSuggestions(String suggestion){
	
	
	return itemRepo.findItemsBySearchTerm(suggestion);
	
}

public List<String> ItemSizes(String name,String color,String sex){
	
	
	return itemRepo.findSizesByItemNameAndColor(name, color,sex);
	
	
	
}

public List<Object[]> findSizesAndColorsByExactItemName(String name){
	
	return itemRepo.findSizesAndColorsByExactItemName(name);
	
	
	
	
}
	


}
