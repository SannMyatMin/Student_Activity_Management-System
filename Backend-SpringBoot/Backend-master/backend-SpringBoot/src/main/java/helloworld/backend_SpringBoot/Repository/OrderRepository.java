package helloworld.backend_SpringBoot.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import helloworld.backend_SpringBoot.DTOs.OrderCode;
import helloworld.backend_SpringBoot.DTOs.ReceiptStatus;
import helloworld.backend_SpringBoot.DTOs.ShopOrderData;
import helloworld.backend_SpringBoot.DTOs.ShopOrders;
import helloworld.backend_SpringBoot.Model.Orders;

import java.util.List;
import java.util.Optional;


@Repository
public interface OrderRepository extends JpaRepository<Orders,Integer>
{

    boolean existsByOrderCode(String orderCode);

    Optional<Orders> findByOrderCode(String orderCode);

    @Query(value = """
            SELECT Order_code As order_code,Total_bill As total_bill,Date As date FROM orders WHERE Order_code=:order_code
            """,nativeQuery = true)
    Optional<ReceiptStatus> getreceiptStatus(@Param("order_code") String orderCode);

    @Query(value="""
            SELECT o.Order_code As order_code FROM orders o JOIN student s WHERE o.Student_id = s.Id AND s.Name=:student_name
            """, nativeQuery = true)
    List<OrderCode> getOrderCodeOfStudent(@Param("student_name") String studentName);

    @Query(value="""
            SELECT f.Shop_name As shop_name,f.Image As image,o.Total_bill As total_bill,o.Date As date From orders o JOIN food_court_shop f ON f.Shop_id = o.Shop_id  WHERE o.Order_code=:order_code
            """, nativeQuery = true)
    Optional<ShopOrderData> getShopOrderData(@Param("order_code") String OrderCode);

    @Query(value="""
            SELECT 
            s.Name AS student_name, s.Image as image,
            o.Order_code as order_code,GROUP_CONCAT(CONCAT(si.Item_name, ' x ', oi.Quantity) SEPARATOR ', ') AS purchased_items,
            o.Total_bill as total_bill,o.Date as date
            FROM orders o
            JOIN student s ON o.Student_id = s.Id
            JOIN order_item oi ON o.Order_id = oi.Order_id
            JOIN shop_item si ON oi.Item_id = si.Item_id
           JOIN food_court_shop f ON f.Shop_id = o.Shop_id  
           WHERE f.Shop_name =:shop_name
           GROUP BY o.Order_id, s.Name, o.Order_code, o.Total_bill, o.Date;
           """, nativeQuery=true)
    List<ShopOrders> getShopOrders(@Param("shop_name") String shop_name);
    
} 
