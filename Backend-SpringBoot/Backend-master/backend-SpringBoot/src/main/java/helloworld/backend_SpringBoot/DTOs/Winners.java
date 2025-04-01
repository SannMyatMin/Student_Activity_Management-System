package helloworld.backend_SpringBoot.DTOs;

import java.util.Base64;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Winners 
{
    private String name;
    private String roll_number;
    private String image;
    private String position;

    public Winners(String name, String roll_number, byte[] imageByte, String position) {
        this.name        = name;
        this.roll_number = roll_number;
        this.image       = Base64.getEncoder().encodeToString(imageByte);
        this.position    = position;
    }

}
