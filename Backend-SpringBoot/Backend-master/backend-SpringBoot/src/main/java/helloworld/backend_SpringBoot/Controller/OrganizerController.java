package helloworld.backend_SpringBoot.Controller;

import java.io.InputStream;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import helloworld.backend_SpringBoot.Service.FormsService;
import helloworld.backend_SpringBoot.Service.OrganizerService;
import helloworld.backend_SpringBoot.Service.SelectionService;
import helloworld.backend_SpringBoot.Service.VoatingService;

@CrossOrigin
@RestController
@RequestMapping("/organizer")
public class OrganizerController 
{
    @Autowired
    private FormsService formService;
    @Autowired
    private OrganizerService organizerService;
    @Autowired
    private SelectionService selectionService;
    @Autowired
    private VoatingService voatingService;

    @GetMapping("/getReqShops")
    public ResponseEntity<Object> getReqShops() {
        try {
            return ResponseEntity.ok(formService.getRequestedShops());
        }
        catch (Exception e) {
            return ResponseEntity.status(401).body("fail");
        }
    }

    @PostMapping("/approveShop")
    public ResponseEntity<String> approveShop(@RequestBody Map<String, String> shop) {
        String shopName = shop.get("shop_name");
        try {
            InputStream inputStream = getClass().getResourceAsStream("defaultShop.png");
            byte[] imageByte = inputStream.readAllBytes();
            organizerService.approveShop(shopName,imageByte);
            formService.removeForm(shopName);
            return ResponseEntity.ok("shop added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("fail");
        }
    }
    
    @PostMapping("/rejectShop")
    public ResponseEntity<String> rejectShop(@RequestBody Map<String, String> shop) {
        String shopName = shop.get("shop_name");
        try {
            formService.removeForm(shopName);
            return ResponseEntity.ok("Rejecting shop success");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Fail");
        }
    }
    
    @PostMapping("/addSelection")
    public ResponseEntity<String> addSelection(@RequestBody Map<String, String> student) {
        String name = student.get("name");
        try {
            InputStream stream = getClass().getResourceAsStream("Default.jpg");
            byte[] imageByte = stream.readAllBytes();
            selectionService.addSelection(name, imageByte);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Fail");
        }
    }

    @GetMapping("/getSelections")
    public ResponseEntity<Object> getSelections() {
        try {
            return ResponseEntity.ok(selectionService.getAllSelections());
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Fail");
        }
    }

    @GetMapping("/getWonSelections")
    public ResponseEntity<Object> getWonSelections() {
        try{
           return ResponseEntity.ok(voatingService.getWinners());
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("Fail");
        }
    }

    /* 
    @GetMapping("/getWinners")
    public ResponseEntity<Object> getWinners() {
        try{
            return ResponseEntity.ok(voatingService.getWinners());
        }
        catch (Exception e) {
            return ResponseEntity.status(401).body("Fail");
        }
    }*/
    
    

}
