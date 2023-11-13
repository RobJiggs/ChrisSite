package com.clothing.start.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.clothing.start.entity.Address;


@Transactional
@Repository
public interface AddressRepo extends JpaRepository<Address, Long>{
	
	@Query(value = "SELECT a.* FROM address a INNER JOIN user_address ua ON a.addyid = ua.address_id WHERE ua.user_id = :userId", nativeQuery = true)
	List<Address> findAddressesByUserid(@Param("userId") long userId);

	 
	@Query("SELECT a FROM Address a INNER JOIN a.users u WHERE u.userID = :userId AND a.status = 'MAIN'")
	Address findMainAddressByUserId(@Param("userId") Long userId);

	  
	@Query("SELECT a FROM Address a INNER JOIN a.users u WHERE u.userID = :userId AND a.status = 'SECONDARY'")
	Address findSecondaryAddressByUserId(@Param("userId") Long userId);


}
