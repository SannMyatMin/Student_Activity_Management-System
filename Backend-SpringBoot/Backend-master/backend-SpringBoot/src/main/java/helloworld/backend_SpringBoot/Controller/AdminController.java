package helloworld.backend_SpringBoot.Controller;

import java.io.InputStream;
import java.util.Map;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import helloworld.backend_SpringBoot.Service.AdminService;
import helloworld.backend_SpringBoot.Service.ClubMembershipService;
import helloworld.backend_SpringBoot.Service.FormsService;
import helloworld.backend_SpringBoot.Service.OrganizerService;
import helloworld.backend_SpringBoot.Service.PasswordHash;
import helloworld.backend_SpringBoot.Service.StudentService;
import helloworld.backend_SpringBoot.DTOs.ClubData;
import helloworld.backend_SpringBoot.DTOs.StudentData;

@CrossOrigin
@RestController
@RequestMapping("/admin")
public class AdminController 
{
    @Autowired
    private AdminService adminService;
    @Autowired
    private OrganizerService organizerService;
    @Autowired
    private StudentService studentService;
    @Autowired
    private FormsService formsService;
    @Autowired
    private ClubMembershipService membershipService;
    @Autowired
    private PasswordHash passwordHash;

    @PostMapping("/login")
    public ResponseEntity<Object> adminLogin(@RequestBody Map<String,String> FormData) {
        String mail     = FormData.get("mail");
        String password = FormData.get("password");
        if (adminService.checkAdminByMail(mail)) {
            if (passwordHash.isAdminPasswordCorrect(mail,password)) {
                return ResponseEntity.ok(adminService.getAdminPfData(mail));
            } 
            else {
                return ResponseEntity.status(401).body("Invalid password");
            }
        } 
        else {
            return ResponseEntity.status(401).body("Admin not found");
        }
    }

    
    @PostMapping("/addOrganizer")
    public ResponseEntity<String> addOrganizer(@RequestBody Map<String,String> addOrganizer) {
        String studentMail = addOrganizer.get("mail");
        try {
            organizerService.addOrganizer(studentMail);
            return ResponseEntity.ok("Organizer added successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("Fail");
        }
    }

    @PostMapping("/removeOrganizer")
    public ResponseEntity<String> removeOrganizer(@RequestBody Map<String,String> removedStudent) {
        String mail = removedStudent.get("mail");
        try
        {
            organizerService.removeOrganizer(mail);
            return ResponseEntity.ok("Removed from organizer");
        }
        catch (Exception e)
        {
            return ResponseEntity.status(401).body("Fail");
        }
    }


    @GetMapping("/studentData")
    public ResponseEntity<List<StudentData>> getStudentData() {
        return ResponseEntity.ok(adminService.getStudentDatas());
    }


    @GetMapping("/clubs")
    public ResponseEntity<List<ClubData>> getClubs() {
        return ResponseEntity.ok(adminService.getClubDatas());
    }


    @GetMapping("/getReqClubs")
    public ResponseEntity<Object> getReqClubs() {
        try {
            return ResponseEntity.ok(formsService.getRequestedClubs());
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Fail");
        }
    }
    
    @PostMapping("/approveClub")
    public ResponseEntity<String> approveClub(@RequestBody Map<String,String> club)
    {
        String studentName = club.get("name");
        String clubName = club.get("club_name");
        try {
            InputStream inputStream = getClass().getResourceAsStream("defaultClub.jpg");
            byte[] imageByte        = inputStream.readAllBytes();
            adminService.approveClub(clubName, imageByte);
            membershipService.addFounder(studentName, clubName);
            formsService.removeForm(clubName);
            return ResponseEntity.ok("club added");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Fail");
        }
    }
    
    @PostMapping("/rejectClub")
    public ResponseEntity<String> rejectClub(@RequestBody Map<String, String> club) {
        String clubName = club.get("club_name");
        try {
            formsService.removeForm(clubName);
            return ResponseEntity.ok("Club is rejected");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Fail");
        }
    }

    @PostMapping("/addStudent")
    public ResponseEntity<String> addStudent(@RequestBody Map<String, String> student) {
        String name        = student.get("name");
        String roll_number = student.get("roll_number");
        String gender      = student.get("gender");
        String mail = student.get("mail");
        if (studentService.checkStudentByMail(mail) && studentService.checkStudentByName(name)) {
            return ResponseEntity.status(401).body("Student had already existed");
        }
        if (studentService.checkStudentByMail(mail)) {
            return ResponseEntity.status(401).body("Student with this mail existed");
        }
        if (studentService.checkStudentByName(name)) {
            return ResponseEntity.status(401).body("Student with this name existed");
        }
        try {
            studentService.addNewStudent(name, roll_number, mail, gender);
            return ResponseEntity.ok("Student added");
        }
        catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(401).body("Fail");
        }
    }
    


/* 
    @PostMapping("/addAdmin")
    public void addadmin(@RequestBody Map<String,String> req)
    {
        String name = req.get("name");
        String mail = req.get("mail");
        String pass = req.get("password");

        String hashPasw = passwordHash.hashPassword(pass);
        try{
            InputStream inputStream = getClass().getResourceAsStream("Default.jpg");
            byte[] imgByte = inputStream.readAllBytes();

            Admin admin = new Admin();
            admin.setName(name);
            admin.setMail(mail);
            admin.setPassword(hashPasw);
            admin.setImage(imgByte);

            adminService.addAdmin(admin);
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
    }
*/   
    
}
