package com.mechanista.wms.Backend.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RackDTO(
        @NotBlank(message = "Il codice scaffale è obbligatorio! (R01, R12, R55...)")
        String rackCode,

        @NotNull(message = "L'id della sezione è obbligatoria!")
        UUID sectionId) {
}
