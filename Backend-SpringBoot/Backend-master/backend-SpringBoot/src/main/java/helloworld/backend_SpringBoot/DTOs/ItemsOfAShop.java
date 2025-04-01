package helloworld.backend_SpringBoot.DTOs;

import java.util.Base64;

import lombok.Data;

@Data
public class ItemsOfAShop
{
    private String itemname;
    private String image;
    private String price;
    private Integer quantity;

    public ItemsOfAShop(String itemname, byte[] imageByte, String price, Integer quantity)
    {
        this.itemname = itemname;
        this.image    = Base64.getEncoder().encodeToString(imageByte);
        this.price    = price;
        this.quantity = quantity;
    }


}
