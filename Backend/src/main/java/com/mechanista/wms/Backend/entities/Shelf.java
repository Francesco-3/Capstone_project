package com.mechanista.wms.Backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "shelfs")
@Getter
@Setter
@ToString
@NoArgsConstructor
public class Shelf {
    @Id
    @GeneratedValue
    private UUID id_shelf;

    @ManyToOne
    @JoinColumn(name = "id_rack", nullable = false)
    private Rack rackId;

    @Column(unique = true)
    private int shelfNumber;
    private double capacity;

    public Shelf(Rack rackId, int shelfNumber, double capacity) {
        this.rackId = rackId;
        this.shelfNumber = shelfNumber;
        this.capacity = capacity;
    }
}
