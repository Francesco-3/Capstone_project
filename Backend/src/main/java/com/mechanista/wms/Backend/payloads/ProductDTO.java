package com.mechanista.wms.Backend.payloads;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record ProductDTO(
        @NotBlank(message = "Il codice del prodotto è obbligatorio!")
        @Size(max = 10, message = "Il codice seriale del prodotto deve essere di massimo 10 caratteri!")
        String productCode,

        @NotBlank(message = "Il nome del prodotto è obbligatorio!")
        String productName,

        @NotBlank(message = "La descrizione è obbligatoria!")
        String description,

        @NotBlank(message = "L'unità di misura è obbligatoria! (kg, lt, cm...)")
        String measurement,

        @NotNull(message = "Il peso è obbligatorio!")
        @Positive(message = "Il prezzo deve essere maggiore di 0!")
        Double weight,

        @NotNull(message = "Il prezzo è obbligatorio!")
        @Positive(message = "Il prezzo deve essere maggiore di 0!")
        Double price,

        @NotNull(message = "La scorta minima è obbligatoria")
        @Min(value = 10, message = "La scorta minima deve essere di almeno 10 unità!")
        Integer stock,

        @NotNull(message = "La data di inserimento è obbligatoria!")
        LocalDate insertionDate) {
}
