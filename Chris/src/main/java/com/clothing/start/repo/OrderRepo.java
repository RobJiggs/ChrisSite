package com.clothing.start.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.clothing.start.entity.CartItem;
import com.clothing.start.entity.Orders;


@Transactional
@Repository
public interface OrderRepo extends JpaRepository<Orders, Long>  {

	@Query(value = "SELECT * FROM orders WHERE user_id = :user_id", nativeQuery = true)
    List<Orders> findOrderItems(@Param("user_id") long user_id);

}
