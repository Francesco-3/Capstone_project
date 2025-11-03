package com.mechanista.wms.Backend.payloads;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record ProductDTO(
        @NotBlank(message = "Il codice del prodotto è obbligatorio!")
        @Max(value = 5, message = "Il codice seriale del prodotto deve essere di massimo 5 caratteri!")
        String productCode,

        @NotBlank(message = "La descrizione è obbligatoria!")
        @Min(value = 50, message = "La descrizione deve essere minimo di 50 caratteri!")
        String description,

        @NotBlank(message = "L'unità di misura è obbligatoria! (kg, lt, cm...)")
        String measurement,

        @NotBlank(message = "Il peso è obbligatorio!")
        double weight,

        @NotNull(message = "Il prezzo è obbligatorio!")
        double price,

        @NotNull(message = "La scorta minima è obbligatoria")
        @Min(value = 10, message = "La scorta minima deve essere di almeno 10 unità!")
        Integer stock,

        @NotNull(message = "La data di inserimento è obbligatoria!")
        LocalDate insertion_date
) {
}
