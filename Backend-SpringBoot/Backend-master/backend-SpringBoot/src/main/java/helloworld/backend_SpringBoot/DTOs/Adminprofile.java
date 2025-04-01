package helloworld.backend_SpringBoot.DTOs;

import java.util.Base64;
import lombok.Data;

@Data
public class Adminprofile 
{
    private String name;
    private String mail;
    private String image;

    public Adminprofile(String name, String mail, byte[] image)
    {
        this.name  = name;
        this.mail  = mail;
        this.image = Base64.getEncoder().encodeToString(image);
    }
}
