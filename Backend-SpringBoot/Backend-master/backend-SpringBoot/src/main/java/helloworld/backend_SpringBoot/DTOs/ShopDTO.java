package helloworld.backend_SpringBoot.DTOs;

import java.util.Base64;

import lombok.Data;

@Data
public class ShopDTO 
{
    private String shopName;
    private String description;
    private String image;

    public ShopDTO(String shopnName, String Description, byte[] imageByte) 
    {
        this.shopName    = shopnName;
        this.description = Description;
        this.image       = Base64.getEncoder().encodeToString(imageByte);
    }

}
