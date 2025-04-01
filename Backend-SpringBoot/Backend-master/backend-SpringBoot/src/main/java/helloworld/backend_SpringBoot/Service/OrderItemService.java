package helloworld.backend_SpringBoot.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import helloworld.backend_SpringBoot.DTOs.ReceiptItem;
import helloworld.backend_SpringBoot.Model.OrderItem;
import helloworld.backend_SpringBoot.Model.Orders;
import helloworld.backend_SpringBoot.Model.ShopItems;
import helloworld.backend_SpringBoot.Repository.OrderItemRepository;

@Service
public class OrderItemService 
{
    @Autowired
    private OrderItemRepository oItemRepo;
    @Autowired
    private OrderService orderService;
    @Autowired
    private ShopItemService itemService;

    public void addOrderItem(String itemName, String orderCode, Integer quantity, Integer price)
    {
        ShopItems item = itemService.getItemByName(itemName);
        Orders order = orderService.getOrderData(orderCode);
        Integer totalPrice = quantity * price;
        OrderItem orderItem = new OrderItem();
        orderItem.setShopItem(item);
        orderItem.setOrder(order);
        orderItem.setQuantity(quantity);
        orderItem.setTotalPrice(totalPrice);
        oItemRepo.save(orderItem);
    }
    
    
    public List<ReceiptItem> getIems(String orderCode)
    {
        return oItemRepo.getByorderCode(orderCode);
    }


}
