package helloworld.backend_SpringBoot.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import helloworld.backend_SpringBoot.DTOs.ReceiptItem;
import helloworld.backend_SpringBoot.Model.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem,Integer>
{
    @Query(value="""
                SELECT si.item_name, oi.quantity, oi.total_price
                FROM order_item oi
                JOIN shop_item si ON oi.Item_id = si.Item_id
                JOIN orders o ON oi.Order_id = o.Order_id
                WHERE o.order_code = :order_code 
                """,nativeQuery = true)
    List<ReceiptItem> getByorderCode(@Param("order_code") String OrderCode);
}
