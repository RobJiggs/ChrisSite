package com.clothing.start.repo;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.clothing.start.entity.Items;

@Transactional
@Repository
public interface ItemRepo extends JpaRepository<Items, Long>{
	@Query("SELECT i FROM Items i WHERE (i.itemID, i.itemName, i.sex, i.color) IN (SELECT MIN(i2.itemID), i2.itemName, i2.sex, i2.color FROM Items i2 GROUP BY i2.itemName, i2.sex, i2.color)")
	List<Items> findDistinctItems();

	@Query("SELECT i FROM Items i WHERE (i.itemID,i.category) IN (SELECT MIN(i2.itemID),i2.category FROM Items i2 GROUP BY i2.itemName, i2.sex, i2.category,i2.color)")
	List<Items> findDistinctItemNameWithItemsByCategory(@Param("category") String category);



	@Query("SELECT i FROM Items i WHERE i.color = :color AND (i.itemID, i.color) IN (SELECT MIN(i2.itemID), i2.color FROM Items i2 GROUP BY i2.itemName, i2.sex, i2.color)")
	List<Items> findDistinctItemNameWithItemsByColor(@Param("color") String color);


	@Query("SELECT i FROM Items i WHERE i.price >= :minPrice AND i.price <= :maxPrice AND (i.itemID, i.color) IN (SELECT MIN(i2.itemID), i2.color FROM Items i2 WHERE i2.price >= :minPrice AND i2.price <= :maxPrice GROUP BY i2.itemName, i2.sex, i2.color)")
	List<Items> findItemsByPriceRange(@Param("minPrice") double minPrice, @Param("maxPrice") double maxPrice);

	@Query("SELECT i FROM Items i WHERE i.itemName LIKE %?1% AND (i.itemID, i.color) IN (SELECT MIN(i2.itemID), i2.color FROM Items i2 WHERE i2.itemName LIKE %?1% GROUP BY i2.itemName, i2.sex, i2.color)")
	List<Items> findByItemNameContaining(String itemName);
	
	@Query("SELECT i.size, i.color,i.sex,i.image FROM Items i WHERE i.itemName = ?1")
	List<Object[]> findSizesAndColorsByExactItemName(String itemName);

	
	@Query("SELECT i FROM Items i WHERE i.featured = true AND (i.itemID, i.color) IN (SELECT MIN(i2.itemID), i2.color FROM Items i2 WHERE i2.featured = true GROUP BY i2.itemName, i2.sex, i2.color)")
	List<Items> findByFeaturedItems();


	@Query("SELECT i FROM Items i WHERE (i.itemID, i.itemName, i.sex, i.color) IN (SELECT MIN(i2.itemID), i2.itemName, i2.sex, i2.color FROM Items i2 GROUP BY i2.itemName, i2.sex, i2.color) " +
	        "AND (:sex IS NULL OR i.sex = :sex) " +
	        "AND (:category IS NULL OR i.category = :category) " +
	        "AND (:color IS NULL OR i.color = :color) " +
	        "AND (:minPrice IS NULL OR i.price >= :minPrice) " +
	        "AND (:maxPrice IS NULL OR i.price <= :maxPrice) " +
	        "AND (:size IS NULL OR i.size = :size) " +
	        "AND (:itemName IS NULL OR i.itemName = :itemName) " +
	        "AND (:minDateAdded IS NULL OR i.dateAdded >= :minDateAdded) " +
	        "AND (:featured IS NULL OR i.featured = :featured) " +
	        "AND (:available IS NULL OR i.available = :available)")
	List<Items> findByAttributes(@Param("sex") String sex,
	                             @Param("category") String category,
	                             @Param("color") String color,
	                             @Param("minPrice") Double minPrice,
	                             @Param("maxPrice") Double maxPrice,
	                             @Param("size") String size,
	                             @Param("itemName") String itemName,
	                             @Param("minDateAdded") Date minDateAdded,
	                             @Param("featured") Boolean featured,
	                             @Param("available") Boolean available);

	
	
	
	 	@Query("SELECT DISTINCT i.size FROM Items i WHERE i.itemName = :itemName AND i.color = :color AND i.sex=:sex")
	    List<String> findSizesByItemNameAndColor(@Param("itemName") String itemName, @Param("color") String color, @Param("sex") String sex);

	 	@Query("SELECT i FROM Items i WHERE i.itemName = :itemName AND i.color = :color AND i.sex = :sex AND i.size = :size")
	 	Items findItemByAttributes(@Param("itemName") String itemName, @Param("color") String color, @Param("sex") String sex, @Param("size") String size);

}
