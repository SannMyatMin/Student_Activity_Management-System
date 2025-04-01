package helloworld.backend_SpringBoot.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import helloworld.backend_SpringBoot.DTOs.ItemsOfAShop;
import helloworld.backend_SpringBoot.DTOs.ShopItemData;
import helloworld.backend_SpringBoot.Model.FoodcourtShop;
import helloworld.backend_SpringBoot.Model.ShopItems;
import helloworld.backend_SpringBoot.Repository.ShopItemRepository;

@Service
public class ShopItemService 
{
    @Autowired
    private ShopItemRepository itemRepo;
    @Autowired
    private FoodcourtShopService shopService;

    public void addItem(String itemName, byte[] image, String shopName, String price, Integer quantity, Integer minute) {
        FoodcourtShop Shop = shopService.getShopData(shopName);
        ShopItems new_Item = new ShopItems();
        new_Item.setItemName(itemName);
        new_Item.setImage(image);
        new_Item.setShop(Shop);
        new_Item.setPrice(price);
        new_Item.setQuantity(quantity);
        new_Item.setPreparedMinute(minute);
        itemRepo.save(new_Item);
    }


    public List<ItemsOfAShop> getItemsOfAShop(String shopName) {
        List<ShopItemData> itemData = itemRepo.getItemByShopName(shopName);
        return itemData.stream()
                .map(item -> new ItemsOfAShop(item.getItemName(), item.getImage(), item.getPrice(), item.getQuantity()))
                .collect(Collectors.toList());
    }


    public ShopItems getItemByName(String itemName) {
        Optional<ShopItems> item = itemRepo.findByItemName(itemName);
        return item.get();
    }

    
    public void updateItem(String oldName, String newName, byte[] image, String price, Integer quantity, Integer minute) {
        ShopItems current_item = getItemByName(oldName);
        current_item.setItemName(newName);
        current_item.setImage(image);
        current_item.setPrice(price);
        current_item.setQuantity(quantity);
        current_item.setPreparedMinute(minute);
        itemRepo.save(current_item);
    }
    
    public void reduceQuantityOfItem(String itemName, Integer ordered_quantity) {
        ShopItems shopItem      = getItemByName(itemName);
        Integer remain_quantity = shopItem.getQuantity() - ordered_quantity;
        shopItem.setQuantity(remain_quantity);
        itemRepo.save(shopItem);
    }


    public void deleteItem(String itemName) {
        ShopItems item = getItemByName(itemName);
        itemRepo.delete(item);
    }


    



}
