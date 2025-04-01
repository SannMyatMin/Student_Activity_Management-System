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
@Table(name = "forms")
@Data
@NoArgsConstructor
public class Forms 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="Form_id")
    private Integer form_id;

    @ManyToOne
    @JoinColumn(name="Student_id",referencedColumnName="Id")
    private Student studentId;

    @Column(name="Title",unique=true)
    private String title;

    @Column(name="Description")
    private String description;

    @Column(name="Type")
    private String type;

    @Column(name="Submitted_date")
    private Date submitted_date;


}
