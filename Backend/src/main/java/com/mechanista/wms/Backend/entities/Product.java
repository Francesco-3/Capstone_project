package com.mechanista.wms.Backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Product {
    @Id
    @GeneratedValue
    private UUID id_product;

    private String productCode;
    private String description;

    @Column(nullable = false)
    private String measurement;

    private double weight;
    private double price;
    private int stock;

    @Column(nullable = false)
    private LocalDate insertion_date;
}
