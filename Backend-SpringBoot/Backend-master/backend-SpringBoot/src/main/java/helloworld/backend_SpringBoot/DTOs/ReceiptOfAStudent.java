package helloworld.backend_SpringBoot.DTOs;

import java.sql.Date;
import java.util.Base64;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReceiptOfAStudent {

    private String shop_name;
    private String shop_image;
    private Integer total_bill;
    private Date date;
    private List<ReceiptItem> items;

    public ReceiptOfAStudent(String shop_name, byte[] shop_image, Integer total_bill, Date date, List<ReceiptItem> items) {
        this.shop_name  = shop_name;
        this.total_bill = total_bill;
        this.date       = date;
        this.shop_image = Base64.getEncoder().encodeToString(shop_image);
        this.items      = items;
    }

}
