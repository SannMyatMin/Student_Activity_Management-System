package helloworld.backend_SpringBoot.DTOs;

import java.sql.Date;
import java.sql.Time;
import java.util.Base64;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Posts 
{
    private Integer post_id;
    private String creator_name;
    private String title;
    private String poster_name;
    private String caption;
    private String content;
    private String image;
    private String visibility;
    private Date created_date;
    private Time created_time;

    public Posts(Integer post_id, String creator_name,
                 String title, String poster_name, String caption,
                 String content, byte[] imageByte,
                 String visibility,
                 Date date, Time time) 
    {
        this.post_id      = post_id;
        this.creator_name = creator_name;
        this.title        = title;
        this.poster_name  = poster_name;
        this.caption      = caption;
        this.content      = content;
        this.image        = (imageByte != null) ? Base64.getEncoder().encodeToString(imageByte) : null;
        this.visibility   = visibility;
        this.created_date = date;
        this.created_time = time;
    }


}
