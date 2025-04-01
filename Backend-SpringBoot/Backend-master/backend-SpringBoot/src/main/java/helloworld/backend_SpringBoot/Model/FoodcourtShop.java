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
import java.sql.Date;

@Entity
@Table(name="food_court_shop")
@Data
@NoArgsConstructor
public class FoodcourtShop 
{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="Shop_id")
    private Integer shopId;

    @Column(name="Shop_name")
    private String shopName;

    @OneToOne
    @JoinColumn(name="Owner_id", referencedColumnName="Id")
    private Student student;

    @Column(name="Description")
    private String description;

    @Lob
    @Column(name="image", columnDefinition="LONGBLOB")
    private byte[] image;

    @Column(name="Created_date")
    private Date createdDate;

}
