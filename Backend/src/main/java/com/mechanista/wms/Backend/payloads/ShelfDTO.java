package com.mechanista.wms.Backend.payloads;

import com.mechanista.wms.Backend.entities.Rack;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ShelfDTO(
        @NotBlank(message = "L'id dello scaffale è obbligatorio!")
        Rack id_rack,

        @NotNull(message = "Il numero della mensola è obbligatorio! (1-4 dall'alto al basso)")
        Integer shelfNumber,

        double capacity) {
}
