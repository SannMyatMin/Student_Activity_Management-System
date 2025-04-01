package helloworld.backend_SpringBoot.DTOs;

import java.util.Base64;

import lombok.Data;


@Data
public class SelectionDataEx 
{
    private String name;
    private String roll_number;
    private String gender;
    private String image;

    public SelectionDataEx(String name, String roll_num, String gender, byte[] imageByte){
        this.name =  name;
        this.roll_number = roll_num;
        this.gender = gender;
        this.image = Base64.getEncoder().encodeToString(imageByte);
    } 

}
