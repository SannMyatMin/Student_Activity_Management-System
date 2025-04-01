package helloworld.backend_SpringBoot.DTOs;

import java.util.Base64;
import lombok.Data;

@Data
public class ReqShops 
{
    private String student_name;
    private String student_image;
    private String title;
    private String description;

    public ReqShops(String studentName, byte[] studentImage, String title, String description)
    {
        this.student_name  = studentName;
        this.student_image = Base64.getEncoder().encodeToString(studentImage);
        this.title         = title;
        this.description   = description;
    } 


}
