package helloworld.backend_SpringBoot.DTOs;

import lombok.Data;

@Data
public class OrderedItems 
{
    private String item_name;
    private Integer price;
    private Integer quantity;

    public OrderedItems() 
    {
        
    }

    public OrderedItems(String itemName, Integer price, Integer quantity)
    {
        this.item_name = itemName;
        this.price     = price;
        this.quantity  = quantity;
    }



}
