package helloworld.backend_SpringBoot.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import helloworld.backend_SpringBoot.DTOs.ShopItemData;
import helloworld.backend_SpringBoot.Model.ShopItems;

@Repository
public interface ShopItemRepository extends JpaRepository<ShopItems,Integer>
{
    @Query(value = "SELECT si.item_name AS itemName, si.image AS image, si.price AS price, si.quantity As quantity " +
                "FROM shop_item si " +
                "JOIN food_court_shop fs ON si.shop_id = fs.shop_id " +
                "WHERE fs.shop_name = :shopName", nativeQuery = true)
    List<ShopItemData> getItemByShopName(@Param("shopName") String shopName);


    Optional<ShopItems> findByItemName(String itemName);




}
