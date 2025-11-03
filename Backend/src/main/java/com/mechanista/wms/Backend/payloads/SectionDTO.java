package com.mechanista.wms.Backend.payloads;

import jakarta.validation.constraints.NotBlank;

public record SectionDTO(
        @NotBlank(message = "Il codice della sezione è obbligatorio! (A, B, C, o D)")
        String sectionCode,

        @NotBlank(message = "La descrizione è obbligatoria! (Corridoio Correttivo, Sezione Pedane...)")
        String description) {
}
