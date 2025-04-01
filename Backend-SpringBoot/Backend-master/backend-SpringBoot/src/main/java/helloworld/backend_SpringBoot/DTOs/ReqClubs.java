package helloworld.backend_SpringBoot.DTOs;

import java.util.Base64;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReqClubs 
{
    private String student_name;
    private String student_image;
    private String club_name;
    private String description;

    public ReqClubs(String student_name, byte[] image, String club_name, String description) {
        this.student_name = student_name;
        this.student_image        = Base64.getEncoder().encodeToString(image);
        this.club_name    = club_name;
        this.description  = description;
    }
}
