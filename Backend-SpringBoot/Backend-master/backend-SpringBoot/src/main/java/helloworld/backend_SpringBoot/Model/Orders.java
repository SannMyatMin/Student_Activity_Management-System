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
@Table(name="orders")
@Data
@NoArgsConstructor
public class Orders 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="Order_Id")
    private Integer orderId;

    @Column(name="Order_code",unique=true)
    private String orderCode;

    @ManyToOne
    @JoinColumn(name="Student_id",referencedColumnName="Id")
    private Student student;

    @ManyToOne
    @JoinColumn(name="Shop_id",referencedColumnName="Shop_id")
    private FoodcourtShop shop;

    @Column(name="Total_bill")
    private Integer totalBill;

    @Column(name="Date")
    private Date date;
}
