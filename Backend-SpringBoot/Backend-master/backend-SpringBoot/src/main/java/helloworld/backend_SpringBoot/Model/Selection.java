package helloworld.backend_SpringBoot.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "selection")
@Data
@NoArgsConstructor
public class Selection 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="Selection_id")
    private Integer selection_id;

    @OneToOne
    @JoinColumn(name="Student_id", referencedColumnName = "Id")
    private Student studentId;

    @Lob
    @Column(name="Image", columnDefinition = "LONGBLOB")
    private byte[] image;

    @Column(name="Role")
    private String role;
}
