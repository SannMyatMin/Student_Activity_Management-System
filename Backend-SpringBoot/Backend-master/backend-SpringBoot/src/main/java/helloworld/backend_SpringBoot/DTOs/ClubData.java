package helloworld.backend_SpringBoot.DTOs;

import java.util.Date;

public interface ClubData 
{
    String getClub_name();

    String getClub_founder();

    Integer getNumber_of_members();

    Date getCreated_date();
}
