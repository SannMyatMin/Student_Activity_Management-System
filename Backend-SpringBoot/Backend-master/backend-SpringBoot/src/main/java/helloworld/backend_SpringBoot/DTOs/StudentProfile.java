package helloworld.backend_SpringBoot.DTOs;

import java.util.Base64;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentProfile 
{
    private String name;
    private String rollNumber;
    private String mail;
    private String image;
    private String roles;
    private String joined_clubs;

    public StudentProfile(String name,
                          String rollNumber,
                          String mail, 
                          byte[] imageBytes,
                          String roles,
                          String joined_clubs) 
    {
        this.name        = name;
        this.rollNumber   = rollNumber;
        this.mail         = mail;
        this.image        = Base64.getEncoder().encodeToString(imageBytes);
        this.roles        = roles;
        this.joined_clubs = joined_clubs;
    }

}
