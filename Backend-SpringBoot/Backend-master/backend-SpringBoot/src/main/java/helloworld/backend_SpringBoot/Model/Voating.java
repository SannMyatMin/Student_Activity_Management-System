package helloworld.backend_SpringBoot.Model;

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
@Table(name = "voating")
@Data
@NoArgsConstructor
public class Voating 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Voating_id")
    private Integer voating_id;

    @ManyToOne
    @JoinColumn(name="Selection_id", referencedColumnName = "Selection_id")
    private Selection selection_id;

    @ManyToOne
    @JoinColumn(name="Student_id", referencedColumnName = "Id")
    private Student student_id;

    @Column(name="Position")
    private String position;
}
