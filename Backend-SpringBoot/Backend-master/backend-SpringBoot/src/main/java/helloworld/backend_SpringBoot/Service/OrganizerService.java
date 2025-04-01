package helloworld.backend_SpringBoot.Service;

import org.springframework.stereotype.Service;

import helloworld.backend_SpringBoot.Model.Forms;
import helloworld.backend_SpringBoot.Model.Organizer;
import helloworld.backend_SpringBoot.Model.Student;
import helloworld.backend_SpringBoot.Repository.OrganizerRepository;
import java.sql.Date; // Use this instead of util.Date
import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class OrganizerService 
{
    @Autowired
    private OrganizerRepository organizerRepository;
    @Autowired
    private StudentService studentService;
    @Autowired
    private FormsService formService;
    @Autowired
    private FoodcourtShopService shopService;

    public void addOrganizer(String StudentMail){
        Student student     = studentService.getStudentByMail(StudentMail);
        Organizer organizer = new Organizer();
        organizer.setStudentId(student);
        organizer.setJoined_date(Date.valueOf(LocalDate.now()));
        organizerRepository.save(organizer);
    }

    public void removeOrganizer(String StudentMail){
        Student Student     = studentService.getStudentByMail(StudentMail);
        Organizer Organizer = organizerRepository.findByStudentId(Student);
        organizerRepository.delete(Organizer);
    }

    public void approveShop(String shopName, byte[] imageByte) {
        Forms form = formService.getFormByTitle(shopName);
        shopService.addShop(form.getTitle(),
                            form.getStudentId(),
                            imageByte,
                            form.getDescription());                 
    }


}
