package helloworld.backend_SpringBoot.DTOs;

import java.sql.Date;
import java.util.Base64;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class StudentOrders 
{
    private String student_name;
    private String image;
    private String order_code;
    private String purchased_items;
    private Integer total_bill;
    private Date date;

    public StudentOrders(String name, byte[] imageByte, String order_code, String items, Integer total_bill, Date date) {
        this.student_name    = name;
        this.image           = Base64.getEncoder().encodeToString(imageByte);
        this.order_code      = order_code;
        this.purchased_items = items;
        this.total_bill      = total_bill;
        this.date            = date;
    }


}
