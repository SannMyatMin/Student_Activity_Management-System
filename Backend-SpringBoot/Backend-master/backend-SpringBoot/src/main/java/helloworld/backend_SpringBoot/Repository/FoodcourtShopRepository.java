package helloworld.backend_SpringBoot.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import helloworld.backend_SpringBoot.DTOs.ShopOwner;
import helloworld.backend_SpringBoot.DTOs.Shops;
import helloworld.backend_SpringBoot.Model.FoodcourtShop;

@Repository
public interface FoodcourtShopRepository extends JpaRepository<FoodcourtShop,Integer>
{

    boolean existsByShopName(String shopName);

    Optional<FoodcourtShop> getShopByShopName(String shopName);

    @Query("SELECT fs.shopName AS shopName, fs.description AS description, fs.image AS image FROM FoodcourtShop fs")
    List<Shops> getShops();


    @Query(value = """
            SELECT f.shop_name AS shopName,
                   f.description AS description,
                   f.image AS image
            FROM food_court_shop f
            JOIN student s ON f.owner_id = s.id
            WHERE s.name = :studentName
            """, nativeQuery = true)
    Optional<ShopOwner> findByStudentName(@Param("studentName") String studentName);

}
