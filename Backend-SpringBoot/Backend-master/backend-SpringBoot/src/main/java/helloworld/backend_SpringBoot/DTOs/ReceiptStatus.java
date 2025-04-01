package helloworld.backend_SpringBoot.DTOs;

import java.sql.Date;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReceiptStatus 
{
    private String order_code;
    private Integer total_bill;
    private Date date;

    public ReceiptStatus(String order_code, Integer total_bill, Date date)
    {
        this.order_code = order_code;
        this.total_bill = total_bill;
        this.date      = date;
    }

}
