package helloworld.backend_SpringBoot.Model;

import java.sql.Date;
import java.sql.Time;

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
@Table(name = "post")
@NoArgsConstructor
@Data
public class Post 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="Post_id")
    private Integer post_id;

    @ManyToOne
    @JoinColumn(name="Creator_id", referencedColumnName = "Id")
    private Student creator;

    @Column(name="Title")
    private String title;

    @Column(name = "Poster_name")
    private String poster_name;

    @Column(name="Caption")
    private String caption;

    @Column(name="Content")
    private String content;

    @Lob
    @Column(name="Image",columnDefinition = "LONGBLOB", nullable = true)
    private byte[] image;

    @Column(name="Visibility")
    private String visibility;

    @Column(name="Created_time")
    private Time created_time;

    @Column(name="Created_date")
    private Date created_date;
}
