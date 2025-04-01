package helloworld.backend_SpringBoot.Model;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "organizer")
@Getter
@Setter
@NoArgsConstructor
public class Organizer 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="Organizer_id")
    private int Organizer_id;

    @OneToOne
    @JoinColumn(name="Student_id", referencedColumnName="Id")
    private Student studentId;

    @Column(name="Joined_date")
    private Date joined_date;
}
