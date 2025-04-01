package helloworld.backend_SpringBoot.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "admin")
@Getter
@Setter
@NoArgsConstructor
public class Admin 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="Admin_id")
    private int adminId;

    @Column(name="Name")
    private String name;

    @Column(name="Mail", unique=true)
    private String mail;

    @Column(name="Password", nullable=true)
    private String password;

    @Lob
    @Column(name="Image", columnDefinition="LONGBLOB")
    private byte[] image;
}
