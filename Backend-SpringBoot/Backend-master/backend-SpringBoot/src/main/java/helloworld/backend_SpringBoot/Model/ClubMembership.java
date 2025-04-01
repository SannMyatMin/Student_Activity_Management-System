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
@Table(name = "club_membership")
@Data
@NoArgsConstructor
public class ClubMembership 
{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer membershipId;

    @ManyToOne
    @JoinColumn(name="Member_id", referencedColumnName="Id")
    private Student member;

    @ManyToOne
    @JoinColumn(name="Club_id", referencedColumnName="Club_id")
    private Club club;

    @Column(name="Role")
    private String role;

    @Column(name="Joined_date")
    private Date joined_date;
}
