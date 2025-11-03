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

    private String palletCode;
    private String position;
    private double maxRate;

    @ManyToOne
    @JoinColumn(name = "id_section", nullable = false)
    private Section id_section;

    public Pallet(String palletCode, String position, Section id_section, double maxRate) {
        this.palletCode = palletCode;
        this.position = position;
        this.id_section = id_section;
        this.maxRate = maxRate;
    }
}
