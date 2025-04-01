package helloworld.backend_SpringBoot.Model;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "club_requests")
@Data
@NoArgsConstructor
public class ClubRequests 
{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="Request_id")
    private Integer requestId;

    @ManyToOne
    @JoinColumn(name="Club_id", referencedColumnName="Club_id")
    private Club club;

    @ManyToOne
    @JoinColumn(name="Student_id", referencedColumnName="Id")
    private Student student;

    @Column(name="Date")
    private Date date;
}
