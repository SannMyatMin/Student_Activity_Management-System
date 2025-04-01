package helloworld.backend_SpringBoot.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.sql.Date; // Use this instead of util.Date
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import helloworld.backend_SpringBoot.DTOs.ReqClubs;
import helloworld.backend_SpringBoot.DTOs.ReqShops;
import helloworld.backend_SpringBoot.DTOs.RequestedClubs;
import helloworld.backend_SpringBoot.DTOs.RequestedShops;
import helloworld.backend_SpringBoot.Model.Forms;
import helloworld.backend_SpringBoot.Model.Student;
import helloworld.backend_SpringBoot.Repository.FormsRepository;

@Service
public class FormsService 
{
    @Autowired
    private FormsRepository formRepo;
    @Autowired
    private StudentService studentService;

    public void addClubReqForm(String name, String clubName, String description){
        Student student = studentService.getStudentByName(name);
        Forms clubForm  = new Forms();
        clubForm.setStudentId(student);
        clubForm.setTitle(clubName);
        clubForm.setDescription(description);
        clubForm.setType("club");
        clubForm.setSubmitted_date(Date.valueOf(LocalDate.now()));
        formRepo.save(clubForm);
    }

    public void addshopReqForm(String shopName, String studentName, String description) {
        Student student = studentService.getStudentByName(studentName);
        Forms shopForm = new Forms();
        shopForm.setStudentId(student);
        shopForm.setTitle(shopName);
        shopForm.setDescription(description);
        shopForm.setType("shop");
        shopForm.setSubmitted_date((Date.valueOf(LocalDate.now())));
        formRepo.save(shopForm);
    }
    
    public boolean isFormHaveExisted(String studentName, String title) {
        Student student = studentService.getStudentByName(studentName);
        if (formRepo.isFormAlreadyExisted(student.getId(), title) > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    public List<ReqShops> getRequestedShops() {
        List<RequestedShops> reqShops = formRepo.getRequestedShops();
        return reqShops.stream()
                       .map(ReqShop -> new ReqShops(ReqShop.getStudent_name(),
                                                    ReqShop.getStudent_image(),
                                                    ReqShop.getTitle(),
                                                    ReqShop.getDescription()))
                       .collect(Collectors.toList());
    }

    public List<ReqClubs> getRequestedClubs() {
        List<RequestedClubs> reqClubs = formRepo.getRequestedClubs();
        return reqClubs.stream()
                       .map(club -> new ReqClubs(club.getStudent_name(),
                                                 club.getStudent_image(),
                                                 club.getTitle(),
                                                 club.getDescription()))
                       .collect(Collectors.toList());                        
    }
    

    public Forms getFormByTitle(String title) {
        Optional<Forms> form = formRepo.findByTitle(title);
        return form.get();
    }

    public void removeForm(String title) {
        Forms form = getFormByTitle(title);
        formRepo.delete(form);
    }

}
