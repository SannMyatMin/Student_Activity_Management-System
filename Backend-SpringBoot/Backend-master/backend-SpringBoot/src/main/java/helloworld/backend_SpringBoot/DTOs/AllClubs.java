package helloworld.backend_SpringBoot.DTOs;

import java.sql.Date;
import java.util.Base64;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AllClubs 
{
    private String club_name;
    private String image;
    private String title;
    private String description;
    private Date created_date;

    public AllClubs(String name, String title, byte[] imageByte, String description, Date createdDate) {
        this.club_name    = name;
        this.title        = title;
        this.image        = Base64.getEncoder().encodeToString(imageByte);
        this.description  = description;
        this.created_date = createdDate;
    }

}
