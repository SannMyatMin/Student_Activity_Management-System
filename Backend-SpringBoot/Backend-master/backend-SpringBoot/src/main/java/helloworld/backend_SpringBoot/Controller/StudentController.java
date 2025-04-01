package helloworld.backend_SpringBoot.Controller;

import java.io.InputStream;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import helloworld.backend_SpringBoot.Service.ClubRequestService;
import helloworld.backend_SpringBoot.Service.ClubService;
import helloworld.backend_SpringBoot.Service.FoodcourtShopService;
import helloworld.backend_SpringBoot.Service.FormsService;
import helloworld.backend_SpringBoot.Service.MailService;
import helloworld.backend_SpringBoot.Service.PasswordHash;
import helloworld.backend_SpringBoot.Service.SelectionService;
import helloworld.backend_SpringBoot.Service.StudentService;
import helloworld.backend_SpringBoot.Service.VoatingService;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class StudentController {
    @Autowired
    private MailService mailService;
    @Autowired
    private StudentService studentService;
    @Autowired
    private PasswordHash passwordHash;
    @Autowired
    private FormsService formService;
    @Autowired
    private ClubService clubService;
    @Autowired
    private ClubRequestService clubReqService;
    @Autowired
    private ClubMembershipService membershipService;
    @Autowired
    private FoodcourtShopService shopService;
    @Autowired
    private SelectionService selectionService;
    @Autowired
    private VoatingService voatingService;

    @PostMapping("/mail")
    public ResponseEntity<String> checkMail(@RequestBody Map<String, String> UserMail) {
        String mail = UserMail.get("mail");
        if (studentService.isAlreadyLogIn(mail)) {
            return ResponseEntity.status(401).body("Student already log in");
        }
        if (studentService.checkStudentByMail(mail)) {
            mailService.sendOTP(mail);
            return ResponseEntity.ok("OTP sent");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student with this mail does not exit");
        }
    }

    @PostMapping("/otp")
    public ResponseEntity<String> checkOTP(@RequestBody Map<String, String> MailOTP) {
        String Mail = MailOTP.get("mail");
        String OTP = MailOTP.get("otp");
        int otp = Integer.parseInt(OTP);

        if (mailService.isOTPCorrect(Mail, otp)) {
            return ResponseEntity.ok("OTP correct");
        } else {
            return ResponseEntity.status(400).body("Invalid OTP");
        }
    }

    @PostMapping("/password")
    public ResponseEntity<Object> acceptPassword(@RequestBody Map<String, String> MailPassword) {
        String Mail = MailPassword.get("mail");
        String Password = MailPassword.get("password");
        try {
            InputStream inputStream = getClass().getResourceAsStream("Default.jpg");
            byte[] imgByte = inputStream.readAllBytes();
            String HashedPassword = passwordHash.hashPassword(Password);
            studentService.updatePassword(Mail, HashedPassword, imgByte);
            return ResponseEntity.ok(studentService.getDataforProfile(Mail));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body("password and image not get");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> loginData(@RequestBody Map<String, String> LoginData) {
        String Mail = LoginData.get("mail");
        String Password = LoginData.get("password");
        if (studentService.checkStudentByMail(Mail)) {
            if (passwordHash.isStudentPasswordCorrect(Mail, Password)) {
                return ResponseEntity.ok(studentService.getDataforProfile(Mail));
            } else {
                return ResponseEntity.status(401).body("Incorrect password");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student with this mail not exist");
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<Object> getDataForProfile(@RequestParam String mail) {
        if (studentService.checkStudentByMail(mail)) {
            return ResponseEntity.ok(studentService.getDataforProfile(mail));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student with this mail does not exist");
        }
    }

    @PostMapping("/updatePF")
    public ResponseEntity<Object> updateProfileImage(@RequestParam("mail") String mail,
            @RequestParam("pf_image") MultipartFile image) {
        try {
            byte[] ImageByte = image.getBytes();
            studentService.updateProfileImage(mail, ImageByte);
            return ResponseEntity.ok(studentService.getDataforProfile(mail));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Cannot update");
        }
    }

    @PostMapping("/submitShopForm")
    public ResponseEntity<String> requestShop(@RequestParam("name") String studentName,
            @RequestParam("title") String title,
            @RequestParam("description") String drscription) {
        if (formService.isFormHaveExisted(studentName, title)) {
            return ResponseEntity.status(401).body("Form already existed");
        }
        if (shopService.isUsedShopName(title)) {
            return ResponseEntity.status(401).body("Shop with this name has already existed");
        }
        try {
            formService.addshopReqForm(title, studentName, drscription);
            return ResponseEntity.ok("Form submitted Success");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("error");
        }
    }

    @PostMapping("/submitClubForm")
    public ResponseEntity<String> requestClub(@RequestBody Map<String, String> ClubForm) {
        String ClubName = ClubForm.get("club_name");
        String Description = ClubForm.get("description");
        String StudentName = ClubForm.get("name");
        if (formService.isFormHaveExisted(StudentName, ClubName)) {
            return ResponseEntity.status(401).body("Form already existed");
        }
        if (clubService.isClubExisted(ClubName)) {
            return ResponseEntity.status(401).body("Club already existed");
        }
        try {
            formService.addClubReqForm(StudentName, ClubName, Description);
            return ResponseEntity.ok("Form successfully submitted");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Fail to submit");
        }
    }

    @PostMapping("/applyClub")
    public ResponseEntity<String> applyClub(@RequestBody Map<String, String> reqClub) {
        String name = reqClub.get("name");
        String clubName = reqClub.get("club_name");
        if (membershipService.isAlreadyInClub(name, clubName)) {
            return ResponseEntity.status(401).body("Your already in club");
        }
        if (clubReqService.isAlreadyReqClub(name, clubName)) {
            return ResponseEntity.status(401).body("You already requested to this club");
        }
        try {
            clubReqService.storeReqForm(name, clubName);
            return ResponseEntity.ok("Request to club success");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("fail to join");
        }
    }

    @PostMapping("/addSelectionImage")
    public ResponseEntity<String> addSelectionImage(@RequestParam("name") String name,
            @RequestParam("image") MultipartFile image) {
        try {
            byte[] imageByte = image.getBytes();
            selectionService.addImage(name, imageByte);
            return ResponseEntity.ok("image added");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Fail");
        }
    }

    @PostMapping("/vote")
    public ResponseEntity<String> voating(@RequestBody Map<String, String> voteData) {
        String voter = voteData.get("voter_name");
        String selection = voteData.get("selection_name");
        String position = voteData.get("position");

        if (voter == null || selection == null || position == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        try {
            voatingService.addVote(voter, selection, position);
            return ResponseEntity.ok("Vote added");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("Fail");
        }
    }

    /*
     * @GetMapping("/testPFdata")
     * public ResponseEntity<Object> getPfD(String mail)
     * {
     * return ResponseEntity.ok(studentService.getDataforProfile(mail));
     * }
     */

    /*
     * @PostMapping("/PF")
     * public ResponseEntity<Object> updateProf(String Mail) {
     * 
     * try {
     * InputStream inputStream = getClass().getResourceAsStream("Default.jpg");
     * byte[] ImageByte = inputStream.readAllBytes();
     * studentService.updateProfileImage(Mail, ImageByte);
     * return ResponseEntity.ok(studentService.getDataforProfile(Mail));
     * } catch (Exception e) {
     * return ResponseEntity.status(401).body("Cannot update");
     * }
     * }
     */

}
