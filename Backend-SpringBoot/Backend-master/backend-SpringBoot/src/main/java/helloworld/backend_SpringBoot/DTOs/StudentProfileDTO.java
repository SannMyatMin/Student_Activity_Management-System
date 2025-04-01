package helloworld.backend_SpringBoot.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentProfileDTO 
{
    private String name;
    private String rollNumber;
    private String mail;
    private byte[] image;
    private String roles;
    private String joined_clubs;

}
