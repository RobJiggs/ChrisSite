package com.clothing.start.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.clothing.start.entity.Address;
import com.clothing.start.entity.Cart;
@Transactional
@Repository
public interface CartRepo extends JpaRepository<Cart,Long>{
	Cart findByIpAddress(String ipAddress);
	 
	@Query(value = "SELECT * FROM cart WHERE user_id = :user_id", nativeQuery = true)
    Cart findCartByUserid(@Param("user_id") long user_id);

}
