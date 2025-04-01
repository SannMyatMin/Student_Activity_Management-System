package helloworld.backend_SpringBoot.DTOs;

import java.sql.Date;
import java.util.Base64;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ClubRequestList 
{
    private String name;
    private String image;
    private Date date;

    public ClubRequestList(String name, byte[] imageByte, Date date) {
        this.name  = name;
        this.image = Base64.getEncoder().encodeToString(imageByte);
        this.date  = date;
    }

 }
