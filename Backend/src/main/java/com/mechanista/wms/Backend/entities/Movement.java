package com.mechanista.wms.Backend.entities;

import com.mechanista.wms.Backend.entities.enums.MovementType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table
@Getter
@Setter
@ToString
@NoArgsConstructor
public class Movement {
    @Id
    @GeneratedValue
    private UUID id_movement;

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private User id_user;

    @ManyToOne
    @JoinColumn(name = "id_shelf")
    private Shelf id_shelf;

    @ManyToOne
    @JoinColumn(name = "id_pallet")
    private Pallet id_pallet;

    @ManyToOne
    @JoinColumn(name = "id_product", nullable = false)
    private Product id_product;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovementType movementType;

    private int quantity;
    private LocalDate date_time;
    private String notes;

    public Movement(User id_user, MovementType movementType, int quantity, Shelf id_shelf, Pallet id_pallet, Product id_product, LocalDate date_time, String notes) {
        this.id_product = id_product;
        this.id_user = id_user;
        this.movementType = movementType;
        this.quantity = quantity;
        this.id_shelf = id_shelf;
        this.id_pallet = id_pallet;
        this.date_time = date_time;
        this.notes = notes;
    }
}
