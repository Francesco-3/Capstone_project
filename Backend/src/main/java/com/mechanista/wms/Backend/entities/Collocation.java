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
    private Product id_product;

    @ManyToOne
    @JoinColumn(name = "id_shelf")
    private Shelf id_shelf;

    @ManyToOne
    @JoinColumn(name = "id_pallet")
    private Pallet id_pallet;

    public Collocation(int quantity, Product id_product, Shelf id_shelf, Pallet id_pallet) {
        this.quantity = quantity;
        this.id_product = id_product;
        this.id_shelf = id_shelf;
        this.id_pallet = id_pallet;
    }
}
