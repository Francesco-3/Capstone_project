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
public class Pallet {
    @Id
    @GeneratedValue
    private UUID id_pallet;

    @Column(unique = true)
    private String palletCode;

    private double maxRate;

    @ManyToOne
    @JoinColumn(name = "id_section", nullable = false)
    private Section sectionId;

    public Pallet(String palletCode, Section sectionId, double maxRate) {
        this.palletCode = palletCode;
        this.sectionId = sectionId;
        this.maxRate = maxRate;
    }
}
