package helloworld.backend_SpringBoot.Model;

import java.sql.Date;
import java.sql.Time;

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
@Table(name = "notification")
@Data
@NoArgsConstructor
public class Notification 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Noti_id")
    private Integer noti_id;

    @ManyToOne
    @JoinColumn(name="Student_id",referencedColumnName = "Id")
    private Student student;

    @Column(name = "Noti_time")
    private Time noti_time;

    @Column(name="Noti_date")
    private Date noti_date;
}
