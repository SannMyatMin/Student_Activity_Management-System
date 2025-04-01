package helloworld.backend_SpringBoot.DTOs;

import java.util.Base64;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ShopData
{
    private String shopName;
    private String description;
    private String image;

    public ShopData(String shopName,String descriptio, byte[] imageByte)
    {
        this.shopName    = shopName;
        this.description = descriptio;
        this.image       = Base64.getEncoder().encodeToString(imageByte);
    }

}
