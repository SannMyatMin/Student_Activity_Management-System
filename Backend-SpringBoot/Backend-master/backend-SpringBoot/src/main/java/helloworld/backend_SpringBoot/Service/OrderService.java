package helloworld.backend_SpringBoot.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import helloworld.backend_SpringBoot.DTOs.OrderCode;
import helloworld.backend_SpringBoot.DTOs.ReceiptStatus;
import helloworld.backend_SpringBoot.DTOs.ShopOrderData;
import helloworld.backend_SpringBoot.DTOs.ShopOrders;
import helloworld.backend_SpringBoot.DTOs.StudentOrders;
import helloworld.backend_SpringBoot.Model.FoodcourtShop;
import helloworld.backend_SpringBoot.Model.Orders;
import helloworld.backend_SpringBoot.Model.Student;
import helloworld.backend_SpringBoot.Repository.OrderRepository;

@Service
public class OrderService 
{
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private StudentService studentService;
    @Autowired
    private FoodcourtShopService shopService;

    public void addOrder(String orderCode,String studentName, String shopName, Integer totalBill) {
        Student student    = studentService.getStudentByName(studentName);
        FoodcourtShop shop = shopService.getShopData(shopName);
        Orders order = new Orders();
        order.setOrderCode(orderCode);
        order.setStudent(student);
        order.setShop(shop);
        order.setTotalBill(totalBill);
        order.setDate(Date.valueOf(LocalDate.now()));
        orderRepo.save(order);
    }
    

    public String getOrderCode() {
        String orderCode = "";
        SecureRandom random = new SecureRandom();
        do
        {
            char letter1 = (char) ('A' + random.nextInt(26));
            char letter2 = (char) ('A' + random.nextInt(26));
            int number   = random.nextInt(900) + 100;
            orderCode    = "" + letter1 + letter2 + "-" + number;
        } 
        while (orderRepo.existsByOrderCode(orderCode));
        return orderCode;
    }


    public Orders getOrderData(String orderCode) {
        Optional<Orders> order = orderRepo.findByOrderCode(orderCode);
        return order.get();
    }


    public ReceiptStatus getOrderStatus(String orderCode) {
        Optional<ReceiptStatus> orderStatus = orderRepo.getreceiptStatus(orderCode);
        return orderStatus.get();
    }


    public List<OrderCode> getAllOrderCodesOfStudent(String studentName) {
        return orderRepo.getOrderCodeOfStudent(studentName);
    }


    public ShopOrderData getShopOrderData(String orderCode) {
        Optional<ShopOrderData> data = orderRepo.getShopOrderData(orderCode);
        return data.get();
    }

    public List<StudentOrders> getOrdersofShop(String shopName) {
        List<ShopOrders> orders = orderRepo.getShopOrders(shopName);
        return orders.stream()
                     .map(order -> new StudentOrders(order.getStudent_name(),
                                                     order.getImage(),
                                                     order.getOrder_code(),
                                                     order.getPurchased_items(),
                                                     order.getTotal_bill(),
                                                     order.getDate()))
                     .collect(Collectors.toList());
    }

}
