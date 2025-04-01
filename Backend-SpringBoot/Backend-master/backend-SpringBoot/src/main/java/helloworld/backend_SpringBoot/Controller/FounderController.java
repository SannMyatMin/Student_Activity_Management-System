package helloworld.backend_SpringBoot.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import helloworld.backend_SpringBoot.Service.ClubMembershipService;
import helloworld.backend_SpringBoot.Service.ClubRequestService;

@CrossOrigin
@RestController
@RequestMapping("/founder")
public class FounderController 
{
    @Autowired
    private ClubMembershipService membershipService;
    @Autowired
    private ClubRequestService clubReqService;


    @PostMapping("/reqMembers")
    public ResponseEntity<Object> getClubRequests(@RequestBody Map<String, String> club) {
        String clubName = club.get("club_name");
        try {
            return ResponseEntity.ok(clubReqService.getClubReqList(clubName));
        }
        catch (Exception e) {
            return ResponseEntity.status(401).body("Fail");
        }
    }


    @PostMapping("/acceptMember")
    public ResponseEntity<String> acceptClubMember(@RequestBody Map<String, String> newMember) {
        String studentName = newMember.get("name");
        String clubName = newMember.get("club_name");
        try {
            membershipService.addMembership(studentName, clubName);
            clubReqService.removeRequest(studentName, clubName);
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            return ResponseEntity.status(402).body("Fail");
        }
    }
    
    @PostMapping("/rejectMember")
    public ResponseEntity<String> rejectMember(@RequestBody Map<String, String> student) {
        String studentName = student.get("name");
        String clubName = student.get("club_name");
        try {
            clubReqService.removeRequest(studentName,clubName);
            return ResponseEntity.ok("Reject the request");
        }
        catch (Exception e) {
            return ResponseEntity.status(401).body("Fail");
        }
    }

}
