package helloworld.backend_SpringBoot.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Service;

import helloworld.backend_SpringBoot.Model.Admin;
import helloworld.backend_SpringBoot.Model.Student;
import helloworld.backend_SpringBoot.Security.ArgonTwo;

@Service
public class PasswordHash 
{
    @Autowired
    private ArgonTwo argon2;
    @Autowired
    private StudentService studentService;
    @Autowired
    private AdminService adminService;

    public String hashPassword(String password)
    {
        Argon2PasswordEncoder encoder = argon2.argon2Encoder();
        String hashPassword = encoder.encode(password);
        return hashPassword;
    }


    public boolean isStudentPasswordCorrect(String mail, String password)
    {
        Argon2PasswordEncoder encoder = argon2.argon2Encoder();
        Student RegisteredStudent     = studentService.getStudentByMail(mail);
        String CorrectPassword        = RegisteredStudent.getPassword();

        if (encoder.matches(password, CorrectPassword)) {
            return true;
        } 
        else {
            return false;
        }
    }
    
    public boolean isAdminPasswordCorrect(String mail, String password) 
    {
        Argon2PasswordEncoder encoder = argon2.argon2Encoder();
        Admin admin                   = adminService.getAdminByMail(mail);
        String CorrectPassword        = admin.getPassword();

        if (encoder.matches(password, CorrectPassword)) {
            return true;
        } 
        else {
            return false;
        }
    }



}
