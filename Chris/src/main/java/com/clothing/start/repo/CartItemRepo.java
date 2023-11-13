package com.clothing.start.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.clothing.start.entity.Cart;
import com.clothing.start.entity.CartItem;
@Transactional
@Repository
public interface CartItemRepo extends JpaRepository<CartItem, Long> {
	
	@Query(value = "SELECT * FROM cartitem WHERE cart_id = :cart_id", nativeQuery = true)
    List<CartItem> findCartItems(@Param("cart_id") long cart_id);

}
