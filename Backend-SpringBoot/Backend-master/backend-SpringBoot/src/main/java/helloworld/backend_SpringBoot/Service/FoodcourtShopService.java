package helloworld.backend_SpringBoot.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import helloworld.backend_SpringBoot.DTOs.ShopDTO;
import helloworld.backend_SpringBoot.DTOs.ShopData;
import helloworld.backend_SpringBoot.DTOs.ShopOwner;
import helloworld.backend_SpringBoot.DTOs.Shops;
import helloworld.backend_SpringBoot.Model.FoodcourtShop;
import helloworld.backend_SpringBoot.Model.Student;
import helloworld.backend_SpringBoot.Repository.FoodcourtShopRepository;

@Service
public class FoodcourtShopService 
{
    @Autowired
    private FoodcourtShopRepository foodcourtRepo;
    @Autowired
    private StudentService studentService;

    public void addShop(String name, String shopName, String description, byte[] imageByte)
    {
        Student student        = studentService.getStudentByName(name);
        FoodcourtShop new_shop = new FoodcourtShop();
        new_shop.setShopName(shopName);
        new_shop.setStudent(student);
        new_shop.setDescription(description);
        new_shop.setImage(imageByte);
        new_shop.setCreatedDate(Date.valueOf(LocalDate.now()));
        foodcourtRepo.save(new_shop);
    }
    
    public List<ShopData> getAllShop()
    {
        List<Shops> all_shop = foodcourtRepo.getShops();
        return all_shop.stream()
                       .map(Shop -> new ShopData(Shop.getShopName(), Shop.getDescription(), Shop.getImage()))
                       .collect(Collectors.toList());
    }


    public FoodcourtShop getShopData(String shopName)
    {
        Optional<FoodcourtShop> shop = foodcourtRepo.getShopByShopName(shopName);
        return shop.get();
    }

    public boolean isUsedShopName(String shopName)
    {
        return foodcourtRepo.existsByShopName(shopName);
    }

    public void updateShop(String oldName, String newName, byte[] imageByte, String newDescription)
    {
        FoodcourtShop current_shop = getShopData(oldName);
        current_shop.setShopName(newName);
        current_shop.setImage(imageByte);
        current_shop.setDescription(newDescription);
        foodcourtRepo.save(current_shop);
    }

 
    public ShopDTO getShopByOwner(String ownerName) {
        Optional<ShopOwner> Shop = foodcourtRepo.findByStudentName(ownerName);
        ShopOwner shopO = Shop.get();
        ShopDTO shopDTO = new ShopDTO(shopO.getShopName(),
                shopO.getDescription(),
                shopO.getImage());
        return shopDTO;
    }
    

    public void addShop(String shopName, Student student, byte[] imageByte, String description) { 
        FoodcourtShop new_shop = new FoodcourtShop();
        new_shop.setShopName(shopName);
        new_shop.setStudent(student);
        new_shop.setImage(imageByte);
        new_shop.setDescription(description);
        new_shop.setCreatedDate(Date.valueOf(LocalDate.now()));
        foodcourtRepo.save(new_shop);
    }



}
