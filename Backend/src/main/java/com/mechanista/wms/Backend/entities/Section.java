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
public class Section {
    @Id
    @GeneratedValue
    private UUID id_section;

    private String sectionCode;
    private String description;

    public Section(String sectionCode, String description) {
        this.sectionCode = sectionCode;
        this.description = description;
    }
}
