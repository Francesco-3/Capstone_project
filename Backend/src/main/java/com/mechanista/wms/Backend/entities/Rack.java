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
public class Rack {
    @Id
    @GeneratedValue
    private UUID id_rack;

    private String shelfCode;

    @ManyToOne
    @JoinColumn(name = "id_section", nullable = false)
    private Section id_section;

    public Rack(String shelfCode, Section id_section) {
        this.shelfCode = shelfCode;
        this.id_section = id_section;
    }
}
