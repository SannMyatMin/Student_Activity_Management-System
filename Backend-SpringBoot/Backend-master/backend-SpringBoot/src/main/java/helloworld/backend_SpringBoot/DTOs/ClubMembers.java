package helloworld.backend_SpringBoot.DTOs;

import java.sql.Date;
import java.util.Base64;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ClubMembers 
{
    private String name;
    private String image;
    private String role;
    private Date joined_date;

    public ClubMembers(String name, byte[] imageByte, String role, Date date) {
        this.name        = name;
        this.image       = Base64.getEncoder().encodeToString(imageByte);
        this.role        = role;
        this.joined_date = date;
    }
}
