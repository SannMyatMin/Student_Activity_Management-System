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
@Table(name = "order_item")
@Data
@NoArgsConstructor
public class OrderItem 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="Id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name="Item_id",referencedColumnName="Item_id")
    private ShopItems shopItem;

    @ManyToOne
    @JoinColumn(name="Order_id",referencedColumnName="Order_id")
    private Orders order;

    @Column(name="Quantity")
    private Integer quantity;

    @Column(name="Total_price")
    private Integer totalPrice;
}
