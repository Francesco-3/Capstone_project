package com.mechanista.wms.Backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "racks")
@Getter
@Setter
@ToString
@NoArgsConstructor
public class Rack {
    @Id
    @GeneratedValue
    private UUID id_rack;

    @Column(unique = true)
    private String rackCode;

    @ManyToOne
    @JoinColumn(name = "id_section", nullable = false)
    private Section sectionId;

    public Rack(String rackCode, Section sectionId) {
        this.rackCode = rackCode;
        this.sectionId = sectionId;
    }
}
