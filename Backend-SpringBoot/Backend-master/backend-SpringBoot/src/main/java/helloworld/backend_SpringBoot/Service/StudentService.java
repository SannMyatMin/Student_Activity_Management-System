package helloworld.backend_SpringBoot.Service;

import java.util.Optional;

import org.eclipse.angus.mail.handlers.text_html;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import helloworld.backend_SpringBoot.DTOs.StudentProfile;
import helloworld.backend_SpringBoot.DTOs.StudentProfileDTO;
import helloworld.backend_SpringBoot.Model.Student;
import helloworld.backend_SpringBoot.Repository.StudentRepository;

@Service
public class StudentService 
{
    @Autowired
    private StudentRepository studentRepo;

    public boolean checkStudentByMail(String mail) {
        return studentRepo.existsByMail(mail);
    }

    public boolean checkStudentByName(String name) {
        return studentRepo.existsByName(name);
    }

    public Student getById(Integer id) {
        Optional<Student> student = studentRepo.findById(id);
        return student.get();
    }

    public void addNewStudent(String name, String roll_number, String mail, String gender) {
        Student new_student = new Student();
        new_student.setName(name);
        new_student.setRollNumber(roll_number);
        new_student.setMail(mail);
        new_student.setGender(gender);
        studentRepo.save(new_student);
    }

    public void updatePassword(String mail, String password, byte[] imageByte) {
        Student Student = getStudentByMail(mail);
        Student.setPassword(password);
        Student.setImage(imageByte);
        studentRepo.save(Student);
    }

    public void updateProfileImage(String mail, byte[] imageByte) {
        Student Student = getStudentByMail(mail);
        Student.setImage(imageByte);
        studentRepo.save(Student);
    }

    public boolean isAlreadyLogIn(String mail) {
        Student student = getStudentByMail(mail);
        if (student.getPassword() != null) {
            return true;
        }
        else {
            return false;
        }
    }
    
    public Student getStudentByMail(String mail) {
        Optional<Student> Student = studentRepo.findByMail(mail);
        return Student.get();
    }

    public Student getStudentByName(String name) {
        Optional<Student> Student = studentRepo.searchBy_Name(name);
        return Student.get();
    }

    public StudentProfile getDataforProfile(String mail) {
        Optional<StudentProfileDTO> StudentDTO = studentRepo.getStudentProfileByMail(mail);
        StudentProfileDTO student              = StudentDTO.get();

        StudentProfile studentProfile = new StudentProfile(student.getName(),
                                                           student.getRollNumber(),
                                                           student.getMail(),
                                                           student.getImage(),
                                                           student.getRoles(),
                                                           student.getJoined_clubs());
        return studentProfile;
    }


    


}
