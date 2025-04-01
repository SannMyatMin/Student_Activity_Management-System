package helloworld.backend_SpringBoot.DTOs;

import java.sql.Date;

public interface ShopOrders 
{
    String getStudent_name();

    byte[] getImage();

    String getOrder_code();

    String getPurchased_items();

    Integer getTotal_bill();

    Date getDate();
}
