package helloworld.backend_SpringBoot.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ShopOwner 
{
    private String shopName;
    private String description;
    private byte[] image;
}
