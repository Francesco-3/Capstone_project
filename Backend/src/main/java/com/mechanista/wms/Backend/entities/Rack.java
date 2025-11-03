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
    private String position;

    @ManyToOne
    @JoinColumn(name = "id_section", nullable = false)
    private Section id_section;

    public Rack(String shelfCode, String position, Section id_section) {
        this.shelfCode = shelfCode;
        this.position = position;
        this.id_section = id_section;
    }
}
