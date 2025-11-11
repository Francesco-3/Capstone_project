package com.mechanista.wms.Backend.payloads;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record RackDTO(
        @NotBlank(message = "Il codice del ripiano è obbligatorio! (S01, S12, S55...)")
        String shelfCode,

        @NotBlank(message = "L'id della sezione è obbligatoria!")
        UUID sectionId) {
}
