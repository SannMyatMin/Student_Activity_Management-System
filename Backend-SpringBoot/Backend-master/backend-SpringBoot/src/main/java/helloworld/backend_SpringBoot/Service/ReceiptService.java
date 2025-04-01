package helloworld.backend_SpringBoot.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import helloworld.backend_SpringBoot.DTOs.OrderCode;
import helloworld.backend_SpringBoot.DTOs.Receipt;
import helloworld.backend_SpringBoot.DTOs.ReceiptItem;
import helloworld.backend_SpringBoot.DTOs.ReceiptOfAStudent;
import helloworld.backend_SpringBoot.DTOs.ReceiptStatus;
import helloworld.backend_SpringBoot.DTOs.ShopOrderData;

@Service
public class ReceiptService 
{
    @Autowired
    private OrderService orderService;
    @Autowired
    private OrderItemService oItemService;

    public Receipt getReceipt(String orderCode) {
        ReceiptStatus status = orderService.getOrderStatus(orderCode);
        List<ReceiptItem> items = oItemService.getIems(orderCode);
        Receipt receipt = new Receipt(status.getOrder_code(), status.getTotal_bill(), status.getDate(), items);
        return receipt;
    }
    
    public List<ReceiptOfAStudent> getAllReceiptsOfStudent(String studentName) {
        List<OrderCode> orderCodes           = orderService.getAllOrderCodesOfStudent(studentName);
        List<ReceiptOfAStudent> receipt_list = new ArrayList<>(); 
        for (OrderCode code : orderCodes) {
            ShopOrderData data = orderService.getShopOrderData(code.getOrder_code());
            List<ReceiptItem> items = oItemService.getIems(code.getOrder_code());
            receipt_list.add(new ReceiptOfAStudent(data.getShop_name(),
                                                   data.getImage(),
                                                   data.getTotal_bill(),
                                                   data.getDate(),
                                                   items));
        }
        return receipt_list;
    }


}
