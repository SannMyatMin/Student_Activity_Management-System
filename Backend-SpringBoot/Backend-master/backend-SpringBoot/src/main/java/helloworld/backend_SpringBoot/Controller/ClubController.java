package helloworld.backend_SpringBoot.Controller;

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

import helloworld.backend_SpringBoot.Service.ClubMembershipService;
import helloworld.backend_SpringBoot.Service.ClubService;

@CrossOrigin
@RestController
@RequestMapping("/club")
public class ClubController 
{
    @Autowired
    private ClubService clubService;
    @Autowired
    private ClubMembershipService membershipService;

    @GetMapping("/getClubs")
    public ResponseEntity<Object> getAllClubs() {
        try {
            return ResponseEntity.ok(clubService.getAllClub());
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Fail");
        }
    }
    
    @PostMapping("/getClubMembers")
    public ResponseEntity<Object> getClubDatas(@RequestBody Map<String, String> club) {
        String clubName = club.get("club_name");
        try {
            return ResponseEntity.ok(membershipService.getClubMembers(clubName));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Fail");
        }

    }

    @PostMapping("/updateClub")
    public ResponseEntity<String> updateClub(@RequestParam("old_name") String oldNname,
                                             @RequestParam("new_name") String newName,
                                             @RequestParam("title") String title,
                                             @RequestParam("description") String description,
                                             @RequestParam("image") MultipartFile image)
    {
        try {
            byte[] imageByte = image.getBytes();
            clubService.updateClub(oldNname, newName, title, description, imageByte);
            return ResponseEntity.ok("club is updated");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Fail");
        }
    }

    @PostMapping("/removeFromClub")
    public ResponseEntity<String> removeFromClub(@RequestBody Map<String, String> student) {
        String student_name = student.get("student_name");
        String club_name = student.get("club_name");
        try {
            membershipService.removeFromClub(student_name,club_name);
            return ResponseEntity.ok(student_name + " is removed from " +club_name);
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("Fail");
        }
    }

}
