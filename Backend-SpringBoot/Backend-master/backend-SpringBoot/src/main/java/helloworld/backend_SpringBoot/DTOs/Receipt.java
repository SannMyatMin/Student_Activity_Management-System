package helloworld.backend_SpringBoot.DTOs;

import java.sql.Date;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Receipt 
{
    private String orderCode;
    private Integer totalBill;
    private Date date;
    private List<ReceiptItem> items;

    public Receipt(String orderCode, Integer totalBill, Date date, List<ReceiptItem> items)
    {
        this.orderCode = orderCode;
        this.totalBill = totalBill;
        this.items = items;
        this.date = date;
    }
}
