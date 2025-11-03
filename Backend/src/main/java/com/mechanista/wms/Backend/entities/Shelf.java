package com.mechanista.wms.Backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table
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
    private Rack id_rack;
    private int shelfNumber;
    private double capacity;

    public Shelf(Rack id_rack, int shelfNumber, double capacity) {
        this.id_rack = id_rack;
        this.shelfNumber = shelfNumber;
        this.capacity = capacity;
    }
}
