package com.mechanista.wms.Backend.entities;

import com.mechanista.wms.Backend.entities.enums.MovementType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "movements")
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
    private User userId;

    @ManyToOne
    @JoinColumn(name = "id_shelf")
    private Shelf shelfId;

    @ManyToOne
    @JoinColumn(name = "id_pallet")
    private Pallet palletId;

    @ManyToOne
    @JoinColumn(name = "id_product", nullable = false)
    private Product productId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovementType movementType;

    private int quantity;
    private LocalDate date;
    private String notes;

    public Movement(User userId, MovementType movementType, int quantity, Shelf shelfId, Pallet palletId, Product id_product, LocalDate date, String notes) {
        this.productId = productId;
        this.userId = userId;
        this.movementType = movementType;
        this.quantity = quantity;
        this.shelfId = shelfId;
        this.palletId = palletId;
        this.date = date;
        this.notes = notes;
    }
}
