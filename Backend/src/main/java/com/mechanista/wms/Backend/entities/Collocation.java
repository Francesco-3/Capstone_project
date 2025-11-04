package com.mechanista.wms.Backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Collocation {
    @Id
    @GeneratedValue
    private UUID id_collocation;

    private int quantity;

    @ManyToOne
    @JoinColumn(name = "id_product")
    private Product productId;

    @ManyToOne
    @JoinColumn(name = "id_shelf")
    private Shelf shelfId;

    @ManyToOne
    @JoinColumn(name = "id_pallet")
    private Pallet palletId;

    public Collocation(int quantity, Product productId, Shelf shelfId, Pallet palletId) {
        this.quantity = quantity;
        this.productId = productId;
        this.shelfId = shelfId;
        this.palletId = palletId;
    }
}
