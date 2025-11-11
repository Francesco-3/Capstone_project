package com.mechanista.wms.Backend.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ShelfDTO(
        @NotBlank(message = "L'id dello scaffale è obbligatorio!")
        UUID rackId,

        @NotNull(message = "Il numero della mensola è obbligatorio! (1-4 dall'alto al basso)")
        Integer shelfNumber,

        double capacity) {
}
