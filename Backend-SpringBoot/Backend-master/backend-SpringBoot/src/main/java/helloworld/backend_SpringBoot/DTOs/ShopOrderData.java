package helloworld.backend_SpringBoot.DTOs;

import java.sql.Date;

public interface ShopOrderData {
    String getShop_name();

    byte[] getImage();

    Integer getTotal_bill();

    Date getDate();
    
}