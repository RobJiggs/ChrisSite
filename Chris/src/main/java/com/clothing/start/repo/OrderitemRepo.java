package com.clothing.start.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.clothing.start.entity.OrderItem;
@Transactional
@Repository
public interface OrderitemRepo extends JpaRepository<OrderItem, Long> {
	@Query(value = "SELECT * FROM orderitem WHERE order_id = :order_id", nativeQuery = true)
	List<OrderItem> findOrderItems(@Param("order_id") long order_id);

}
