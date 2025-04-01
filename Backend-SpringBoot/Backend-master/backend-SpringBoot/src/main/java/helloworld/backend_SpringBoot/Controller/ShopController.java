package helloworld.backend_SpringBoot.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import helloworld.backend_SpringBoot.DTOs.ItemsOfAShop;
import helloworld.backend_SpringBoot.DTOs.OrderedItems;
import helloworld.backend_SpringBoot.DTOs.ReceiptOfAStudent;
import helloworld.backend_SpringBoot.DTOs.ShopData;
import helloworld.backend_SpringBoot.Service.FoodcourtShopService;
import helloworld.backend_SpringBoot.Service.OrderItemService;
import helloworld.backend_SpringBoot.Service.OrderService;
import helloworld.backend_SpringBoot.Service.ReceiptService;
import helloworld.backend_SpringBoot.Service.ShopItemService;

@CrossOrigin
@RestController
@RequestMapping("/shop")
public class ShopController 
{
    @Autowired
    private FoodcourtShopService shopService;
    @Autowired
    private ShopItemService itemService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private OrderItemService oItemService;
    @Autowired
    private ReceiptService receiptService;
 
    @GetMapping("/getShops")
    public ResponseEntity<List<ShopData>> getAllShop() {
        return ResponseEntity.ok(shopService.getAllShop());
    }

    @PostMapping("/addItem")
    public ResponseEntity<String> addItem(@RequestParam("shop_name") String shopName,
                                          @RequestParam("item-name") String itemName,
                                          @RequestParam("image") MultipartFile image,
                                          @RequestParam("price") String price,
                                          @RequestParam("quantity") Integer quantity)
    {
        try 
        {
            Integer minute   = 5;
            byte[] imagebyte = image.getBytes();
            itemService.addItem(itemName, imagebyte, shopName, price, quantity, minute);
            return ResponseEntity.ok("Item is successfully added");
        } 
        catch (Exception e) 
        {
            return ResponseEntity.status(401).body("Fail to add");
        }
    }
    
    @GetMapping("/getItemOfShop")
    public ResponseEntity<List<ItemsOfAShop>> getItemOfShop(String shopName) {
        return ResponseEntity.ok(itemService.getItemsOfAShop(shopName));
    }


    @PostMapping("/updateItem")
    public ResponseEntity<String> updateItem(@RequestParam("old-name") String oldName,
                                             @RequestParam("new-name") String newName,
                                             @RequestParam("image") MultipartFile image,
                                             @RequestParam("price") String price,
                                             @RequestParam("quantity") Integer quantity)
    {
        try {
            Integer minute   = 5;
            byte[] imagebyte = image.getBytes();
            itemService.updateItem(oldName, newName, imagebyte, price, quantity, minute);
            return ResponseEntity.ok("update success");
        }
        catch (Exception e)
        {
            return ResponseEntity.status(401).body("fail to update");
        }
    }


    @PostMapping("/deleteItem")
    public ResponseEntity<String> deleteItem(@RequestBody Map<String,String> item) {
        String itemName = item.get("item_name");
        try {
            itemService.deleteItem(itemName);
            return ResponseEntity.ok("Item deleated");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("fail to delete");
        }
    }
    


    @PostMapping("/updateShop")
    public ResponseEntity<String> updateShop(@RequestParam("old_name") String oldName,
                                             @RequestParam("new_name") String newName,
                                             @RequestParam("image") MultipartFile image,
                                             @RequestParam("new_description") String newDescription)
    {
        try {
            byte[] imageByte = image.getBytes();
            shopService.updateShop(oldName, newName, imageByte, newDescription);
            return ResponseEntity.ok("Update success");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Fail to update");
        }
    }
    
    @PostMapping("/getShop")
    public ResponseEntity<Object> getShopbyOwner(@RequestBody Map<String,String> shopOwner) {
        String ownerName = shopOwner.get("owner_name");
        try {
            return ResponseEntity.ok(shopService.getShopByOwner(ownerName));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("fail");
        }
    }

    @PostMapping("/placeOrder")
    public ResponseEntity<Object> getOrder(@RequestBody Map<String,Object> orderData) {
        String studentName = (String) orderData.get("name");
        String shopName    = (String) orderData.get("shop_name");
        Integer Total_bill = (Integer) orderData.get("total_bill");
        ObjectMapper objectMapper = new ObjectMapper();
        List<OrderedItems> Items  = objectMapper.convertValue(orderData.get("items"),
                                    new TypeReference<List<OrderedItems>>() {});
        try {
            String orderCode = orderService.getOrderCode();
            orderService.addOrder(orderCode, studentName, shopName, Total_bill);
            for (OrderedItems item : Items) {
                String item_name = item.getItem_name();
                Integer price    = item.getPrice();
                Integer quantity = item.getQuantity();
                oItemService.addOrderItem(item_name, orderCode, quantity, price);
                itemService.reduceQuantityOfItem(item_name, quantity);
            }
            return ResponseEntity.ok(receiptService.getReceipt(orderCode));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Fail");
        }
    }

    @GetMapping("/getAllReceipts")
    public ResponseEntity<Object> getReceiptsOfAStudent(@RequestParam("name") String studentName) {
        List<ReceiptOfAStudent> receipts = receiptService.getAllReceiptsOfStudent(studentName);
        try {
            return ResponseEntity.ok(receipts);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("fail");
        }
    }

    @PostMapping("/getOrderRecord")
    public ResponseEntity<Object> getOrderRecords(@RequestBody Map<String,String> shop){
        String shopName = shop.get("shop_name");
        try {
            return ResponseEntity.ok(orderService.getOrdersofShop(shopName));
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(401).body("Faol");
        }
    }

    






    /* 
    @GetMapping("/receipt")
    public ResponseEntity<Object> getItm(@RequestBody Map<String,String> orderCode) {
        return ResponseEntity.ok(receiptService.getReceipt(orderCode.get("code")));
    }
    */

    /* 
    @GetMapping("/item")
    public ResponseEntity<List<ReceiptItem>> getItm(@RequestBody Map<String,String> orderCode)
    {
        return ResponseEntity.ok(oItemService.getItems(orderCode.get("code")));
    }
    */

    /* 
    @GetMapping("/status")
    public ResponseEntity<ReceiptStatus> getOrderStatus(@RequestBody Map<String,String> orderCode)
    {
        return ResponseEntity.ok(orderService.getOrderStatus(orderCode.get("code")));
    }
    */

}
