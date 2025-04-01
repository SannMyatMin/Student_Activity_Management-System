package helloworld.backend_SpringBoot.Model;

import java.sql.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "club")
@Data
@NoArgsConstructor
public class Club 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="Club_id")
    private Integer clubId;

    @Column(name="Club_name", unique=true)
    private String clubName;

    @ManyToOne
    @JoinColumn(name="Founder_id", referencedColumnName="Id")
    private Student founder;

    @Column(name="Description")
    private String Description;

    @Column(name="Title")
    private String title;

    @Lob
    @Column(name="Image",columnDefinition="LONGBLOB")
    private byte[] image;

    @Column(name="Created_date")
    private Date createdDate;
    
}
