package helloworld.backend_SpringBoot.Model;

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
@Table(name="shop_item")
@Data
@NoArgsConstructor
public class ShopItems 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="Item_id")
    private Integer itemId;

    @Column(name="Item_name", unique=true)
    private String itemName;

    @Lob
    @Column(name="image", columnDefinition="LONGBLOB")
    private byte[] image;

    @ManyToOne
    @JoinColumn(name="Shop_id", referencedColumnName="Shop_id")
    private FoodcourtShop shop;

    @Column(name="Price")
    private String price;

    @Column(name="Quantity")
    private Integer quantity;

    @Column(name="Prepared_minute")
    private Integer preparedMinute;
}
